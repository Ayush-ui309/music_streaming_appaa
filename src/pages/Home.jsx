import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getTopTracks, getTrendingTracks, getRecentTracks, getPodcasts, getAudiobooks, getMockLiveEvents } from '../api/jamendoApi';
import MusicCard from '../components/MusicCard';
import PlaylistCard from '../components/PlaylistCard';
import Footer from '../components/Footer';
import Loader from '../components/Loader';
import SearchBar from '../components/SearchBar';
import HorizontalSection from '../components/HorizontalSection';
import { HeroSkeleton, MusicCardSkeleton } from '../components/Skeleton';
import { parseJamendoTrack } from '../utils/helpers';
import { usePlayer } from '../hooks/usePlayer';
import { usePlaylists } from '../context/PlaylistContext';
import { historyService } from '../services/historyService';
import { recommendationService } from '../services/recommendationService';
import { Sparkles, Clock, Globe } from 'lucide-react';

const PILLS = ['Music', 'Podcasts', 'Audiobooks', 'Live Events'];

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get('tab');
  
  const [data, setData] = useState({
    trending: [],
    recent: [],
    recommended: [], // Hits
    personalized: [], // Based on history/likes
    history: [], // Recently Played from DB
    content: [], // podcasts, audiobooks, etc.
  });
  const [loading, setLoading] = useState(true);
  const [contentLoading, setContentLoading] = useState(false);
  const [activePill, setActivePill] = useState(tab || 'Music');
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const { playlists, loading: loadingPlaylists } = usePlaylists();
  const navigate = useNavigate();

  // Sync activePill with URL param
  useEffect(() => {
    if (tab && PILLS.includes(tab)) {
      setActivePill(tab);
    } else if (!tab) {
      setActivePill('Music');
    }
  }, [tab]);

  const handlePillClick = (pill) => {
    setActivePill(pill);
    if (pill === 'Music') {
      setSearchParams({});
    } else {
      setSearchParams({ tab: pill });
    }
  };

  const fetchHomeData = useCallback(async () => {
    setLoading(true);
    try {
      const [trendingRaw, recentRaw, topRaw, persData, historyData] = await Promise.all([
        getTrendingTracks(30),
        getRecentTracks(30),
        getTopTracks(30),
        recommendationService.getRecommendations(20),
        historyService.getHistory(10)
      ]);

      setData({
        trending: trendingRaw.map(parseJamendoTrack),
        recent: recentRaw.map(parseJamendoTrack),
        recommended: topRaw.map(parseJamendoTrack),
        personalized: persData,
        history: historyData,
        content: [],
      });
    } catch (error) {
      console.error("Failed to load home data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchContentData = useCallback(async (pill) => {
    if (pill === 'Music') {
      setData(prev => ({ ...prev, content: [] }));
      return;
    }
    setContentLoading(true);
    try {
      let results = [];
      if (pill === 'Podcasts') {
        const raw = await getPodcasts();
        results = raw.map(parseJamendoTrack);
      } else if (pill === 'Audiobooks') {
        const raw = await getAudiobooks();
        results = raw.map(parseJamendoTrack);
      } else if (pill === 'Live Events') {
        results = getMockLiveEvents();
      }
      setData(prev => ({ ...prev, content: results }));
    } catch (error) {
      console.error(`Failed to load ${pill}:`, error);
    } finally {
      setContentLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  useEffect(() => {
    fetchContentData(activePill);
  }, [activePill, fetchContentData]);

  if (loading) return <Loader text="Setting the stage..." />;

  const heroTrack = data.recommended[0];
  const trending = data.trending;
  const recommended = data.recommended.slice(1, 7);

  return (
    <div style={styles.homeContainer}>
      <div style={{ marginBottom: '32px' }}>
        <SearchBar fullWidth />
      </div>

      <div className="pill-container">
        {PILLS.map(pill => (
          <button 
            key={pill} 
            className={`pill ${activePill === pill ? 'active' : ''}`}
            onClick={() => handlePillClick(pill)}
          >
            {pill}
          </button>
        ))}
      </div>

      {activePill === 'Music' ? (
        <>
          <div style={{ marginTop: '16px' }}>
            {/* Trending - Match Spotify screenshot top row */}
            <HorizontalSection title="Trending songs" onShowAll={() => navigate('/trending')}>
              {loading ? (
                Array(6).fill(0).map((_, i) => <MusicCardSkeleton key={i} />)
              ) : (
                data.trending.map(track => (
                  <MusicCard key={`trending-${track.id}`} track={track} onPlay={() => playTrack(track, data.trending)} />
                ))
              )}
            </HorizontalSection>

            {/* Popular Artists - Using trending track unique artists as mock */}
            <HorizontalSection title="Popular artists" onShowAll={() => navigate('/search')}>
              {loading ? (
                Array(6).fill(0).map((_, i) => <MusicCardSkeleton key={i} />)
              ) : (
                data.trending.filter((v, i, a) => a.findIndex(t => t.artist === v.artist) === i).slice(0, 6).map(track => (
                  <MusicCard key={`artist-${track.id}`} track={track} variant="artist" />
                ))
              )}
            </HorizontalSection>

            {/* Recommended Hits */}
            <HorizontalSection title="Recommended For You">
              {loading ? (
                Array(6).fill(0).map((_, i) => <MusicCardSkeleton key={i} />)
              ) : data.personalized.length > 0 ? (
                data.personalized.map(track => (
                  <MusicCard key={`recommended-${track.id}`} track={track} onPlay={() => playTrack(track, data.personalized)} />
                ))
              ) : (
                data.recommended.slice(0, 20).map(track => (
                  <MusicCard key={`hits-${track.id}`} track={track} onPlay={() => playTrack(track, data.recommended.slice(0, 20))} />
                ))
              )}
            </HorizontalSection>

            {/* Recently Played */}
            {data.history.length > 0 && (
              <HorizontalSection title="Recently Played" onShowAll={() => navigate('/library')}>
                {data.history.map(track => (
                  <MusicCard key={`history-${track.id}`} track={track} onPlay={() => playTrack(track, data.history)} />
                ))}
              </HorizontalSection>
            )}

            {/* Your Playlists Section */}
            {playlists.length > 0 && (
              <HorizontalSection title="Your Playlists" onShowAll={() => navigate('/library')}>
                {playlists.map(playlist => (
                  <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
              </HorizontalSection>
            )}

            {/* Popular Albums & Singles (Mocked) */}
            <HorizontalSection title="Popular Albums & Singles" onShowAll={() => navigate('/search')}>
              {data.recommended.slice(5, 25).map(track => (
                <MusicCard key={`albums-${track.id}`} track={track} onPlay={() => playTrack(track)} />
              ))}
            </HorizontalSection>

            {/* Popular Radio (Mocked) */}
            <HorizontalSection title="Popular Radio" onShowAll={() => navigate('/search')}>
              {data.trending.slice(4, 24).map(track => (
                <MusicCard key={`radio-${track.id}`} track={track} onPlay={() => playTrack(track)} />
              ))}
            </HorizontalSection>

            {/* Featured Charts (Mocked) */}
            <HorizontalSection title="Featured Charts" onShowAll={() => navigate('/search')}>
              {data.recommended.slice(12, 28).map(track => (
                <MusicCard key={`charts-${track.id}`} track={track} onPlay={() => playTrack(track)} />
              ))}
            </HorizontalSection>

            <Footer />
          </div>
        </>
      ) : (
        <div style={{ marginTop: '16px' }}>
          <div style={styles.sectionHeader}>
            <h2 className="title-lg">{activePill}</h2>
          </div>
          {contentLoading ? (
            <Loader text={`Loading ${activePill}...`} />
          ) : data.content.length > 0 ? (
            <div className="grid-system">
              {activePill === 'Live Events' ? (
                data.content.map(event => (
                  <div key={event.id} className="card" style={styles.eventCard}>
                    <img src={event.image} alt={event.title} style={styles.eventImg} />
                    <div style={{ padding: '12px' }}>
                      <span style={{ ...styles.tag, marginBottom: '8px' }}>{event.date}</span>
                      <h4 className="text-ellipsis" style={{ fontSize: '16px', fontWeight: '800' }}>{event.title}</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: '4px 0' }}>{event.venue}</p>
                      <button className="btn-primary" style={{ width: '100%', marginTop: '12px', fontSize: '13px', padding: '8px' }}>Buy Tickets {event.price}</button>
                    </div>
                  </div>
                ))
              ) : (
                data.content.map(track => (
                  <MusicCard key={track.id} track={track} onPlay={() => playTrack(track, data.content)} />
                ))
              )}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <p>No {activePill.toLowerCase()} found at the moment.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  homeContainer: { display: 'flex', flexDirection: 'column', maxWidth: '1200px', margin: '0 auto', paddingBottom: '40px' },
  sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', marginTop: '16px' },
  showAll: { color: 'var(--primary-color)', fontWeight: '600', fontSize: '14px', cursor: 'pointer' },
  heroCard: { position: 'relative', height: '240px', borderRadius: '12px', overflow: 'hidden', padding: 0, border: 'none', cursor: 'pointer', boxShadow: '0 12px 32px rgba(0,0,0,0.5)' },
  heroImg: { width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 1 },
  heroOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to right, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.2) 100%)', zIndex: 2 },
  heroContent: { position: 'absolute', top: '50%', left: '32px', transform: 'translateY(-50%)', zIndex: 3, maxWidth: '400px' },
  tag: { backgroundColor: 'var(--primary-color)', color: '#000', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: '800', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '12px', display: 'inline-block' },
  heroTitle: { fontSize: '32px', fontWeight: '900', margin: '0 0 4px 0', letterSpacing: '-1px', lineHeight: 1.1 },
  heroSubtitle: { color: 'var(--text-secondary)', fontSize: '15px', fontWeight: '500' },
  eventCard: { padding: 0, overflow: 'hidden' },
  eventImg: { width: '100%', aspectRatio: '16/9', objectFit: 'cover' },
  emptyState: { textAlign: 'center', padding: '64px', color: 'var(--text-secondary)' },
};

export default Home;
