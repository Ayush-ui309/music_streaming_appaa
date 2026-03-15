import React, { useEffect, useState, useCallback } from 'react';
import { getTopTracks, getTrendingTracks, getRecentTracks, getPodcasts, getAudiobooks, getMockLiveEvents } from '../api/jamendoApi';
import MusicCard from '../components/MusicCard';
import PlaylistCard from '../components/PlaylistCard';
import Loader from '../components/Loader';
import SearchBar from '../components/SearchBar';
import { HeroSkeleton, MusicCardSkeleton } from '../components/Skeleton';
import { parseJamendoTrack } from '../utils/helpers';
import { usePlayer } from '../hooks/usePlayer';
import { usePlaylists } from '../context/PlaylistContext';
import { historyService } from '../services/historyService';
import { recommendationService } from '../services/recommendationService';
import { Sparkles, Clock, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PILLS = ['Music', 'Podcasts', 'Audiobooks', 'Live Events'];

const Home = () => {
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
  const [activePill, setActivePill] = useState('Music');
  const { playTrack, currentTrack, isPlaying } = usePlayer();
  const { playlists, loading: loadingPlaylists } = usePlaylists();
  const navigate = useNavigate();

  const fetchHomeData = useCallback(async () => {
    setLoading(true);
    try {
      const [trendingRaw, recentRaw, topRaw, persData, historyData] = await Promise.all([
        getTrendingTracks(10),
        getRecentTracks(10),
        getTopTracks(20),
        recommendationService.getRecommendations(8),
        historyService.getHistory(6)
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
            onClick={() => setActivePill(pill)}
          >
            {pill}
          </button>
        ))}
      </div>

      {activePill === 'Music' ? (
        <>
          {/* Hero / For You */}
          {loading ? (
            <HeroSkeleton />
          ) : heroTrack ? (
            <div style={styles.heroCard} className="card" onClick={() => playTrack(heroTrack, data.recommended)}>
              <div style={styles.heroOverlay}></div>
              <img src={heroTrack.image || 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17'} alt="focus" style={styles.heroImg} />
              <div style={styles.heroContent}>
                <span style={styles.tag}>NEW RELEASE</span>
                <h3 style={styles.heroTitle}>{heroTrack.title}</h3>
                <p style={styles.heroSubtitle}>By {heroTrack.artist}</p>
                <button className="btn-primary" style={{ marginTop: '16px', padding: '10px 24px' }}>Play Now</button>
              </div>
            </div>
          ) : null}

          {/* Recently Played */}
          {data.history.length > 0 && (
            <>
              <div style={styles.sectionHeader}>
                <h2 className="title-md" style={{ marginTop: '40px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                   <Clock size={20} color="var(--primary-color)" /> Recently Played
                </h2>
              </div>
              <div className="grid-system">
                {data.history.map(track => (
                  <MusicCard key={`history-${track.id}`} track={track} onPlay={() => playTrack(track, data.history)} />
                ))}
              </div>
            </>
          )}

          {/* RecommendedHits / Hits */}
          <div style={styles.sectionHeader}>
            <h2 className="title-md" style={{ marginTop: '40px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} color="var(--primary-color)" /> Recommended For You
            </h2>
          </div>
          <div className="grid-system">
            {loading ? (
              Array(6).fill(0).map((_, i) => <MusicCardSkeleton key={i} />)
            ) : data.personalized.length > 0 ? (
              data.personalized.map(track => (
                <MusicCard key={`recommended-${track.id}`} track={track} onPlay={() => playTrack(track, data.personalized)} />
              ))
            ) : (
              data.recommended.slice(1, 7).map(track => (
                <MusicCard key={`hits-${track.id}`} track={track} onPlay={() => playTrack(track, data.recommended.slice(1, 7))} />
              ))
            )}
          </div>

          {/* Trending */}
          <div style={styles.sectionHeader}>
            <h2 className="title-md" style={{ marginTop: '40px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Globe size={20} color="var(--primary-color)" /> Trending Tracks
            </h2>
          </div>
          <div className="grid-system">
            {loading ? (
              Array(6).fill(0).map((_, i) => <MusicCardSkeleton key={i} />)
            ) : (
              data.trending.map(track => (
                <MusicCard key={`trending-${track.id}`} track={track} onPlay={() => playTrack(track, data.trending)} />
              ))
            )}
          </div>

          {/* Your Playlists Section */}
          {playlists.length > 0 && (
            <section style={styles.section}>
              <div style={styles.sectionHeader}>
                <h2 className="title-md" style={{ marginTop: '40px', display: 'flex', alignItems: 'center', gap: '8px' }}>Your Playlists</h2>
                <button style={styles.showAll} onClick={() => navigate('/library')}>See All</button>
              </div>
              <div className="grid-system">
                {playlists.map(playlist => (
                  <PlaylistCard key={playlist.id} playlist={playlist} />
                ))}
              </div>
            </section>
          )}
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
  heroCard: { position: 'relative', height: '320px', borderRadius: '24px', overflow: 'hidden', padding: 0, border: 'none', cursor: 'pointer', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' },
  heroImg: { width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 1 },
  heroOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to right, rgba(15, 23, 20, 0.95) 20%, rgba(15, 23, 20, 0.4) 100%)', zIndex: 2 },
  heroContent: { position: 'absolute', top: '50%', left: '48px', transform: 'translateY(-50%)', zIndex: 3, maxWidth: '500px' },
  tag: { backgroundColor: 'rgba(77, 244, 120, 0.2)', color: 'var(--primary-color)', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '16px', display: 'inline-block' },
  heroTitle: { fontSize: '48px', fontWeight: '900', margin: '0 0 8px 0', letterSpacing: '-1.5px', lineHeight: 1.1 },
  heroSubtitle: { color: 'var(--text-secondary)', fontSize: '18px', fontWeight: '500' },
  eventCard: { padding: 0, overflow: 'hidden' },
  eventImg: { width: '100%', aspectRatio: '16/9', objectFit: 'cover' },
  emptyState: { textAlign: 'center', padding: '64px', color: 'var(--text-secondary)' },
};

export default Home;
