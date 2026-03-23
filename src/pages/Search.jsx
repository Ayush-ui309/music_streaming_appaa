import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchTracks, getTopTracks, getTracksByTag } from '../api/jamendoApi';
import MusicCard from '../components/MusicCard';
import HorizontalSection from '../components/HorizontalSection';
import { MusicCardSkeleton } from '../components/Skeleton';
import SearchBar from '../components/SearchBar';
import { parseJamendoTrack } from '../utils/helpers';
import { usePlayer } from '../hooks/usePlayer';

const GENRES = [
  { label: 'All', tag: null },
  { label: 'Rock', tag: 'rock' },
  { label: 'Jazz', tag: 'jazz' },
  { label: 'Electronic', tag: 'electronic' },
  { label: 'Hip Hop', tag: 'hiphop' },
  { label: 'Pop', tag: 'pop' },
  { label: 'Classical', tag: 'classical' },
  { label: 'Ambient', tag: 'ambient' },
];

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');

  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeGenre, setActiveGenre] = useState(GENRES[0]);
  const { playTrack } = usePlayer();

  const loadTracks = useCallback(async (genre, searchQuery) => {
    setLoading(true);
    try {
      let raw;
      if (searchQuery) {
        raw = await searchTracks(searchQuery);
      } else if (genre?.tag) {
        raw = await getTracksByTag(genre.tag, 30);
      } else {
        raw = await getTopTracks(30);
      }
      setTracks(raw.map(parseJamendoTrack).filter(t => t.audioUrl || t.audiodownload));
    } catch (err) {
      console.error('Search failed:', err);
      setTracks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTracks(activeGenre, query);
  }, [query, activeGenre, loadTracks]);

  const handleGenreClick = (genre) => {
    setActiveGenre(genre);
    setTracks([]);
  };

  return (
    <div style={styles.container}>
      <h1 className="title-lg" style={{ marginBottom: '24px' }}>Search</h1>

      <div style={{ marginBottom: '32px' }}>
        <SearchBar fullWidth />
      </div>

      {/* Genre Pills — only when no search query */}
      {!query && (
        <div style={{ marginBottom: '32px' }}>
          <h2 className="title-md">Browse Genres</h2>
          <div className="pill-container">
            {GENRES.map(genre => (
              <button
                key={genre.label}
                className={`pill ${activeGenre.label === genre.label ? 'active' : ''}`}
                onClick={() => handleGenreClick(genre)}
              >
                {genre.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Section heading */}
      <div style={styles.sectionHeader}>
        <h2 className="title-md" style={{ margin: 0 }}>
          {query
            ? `Results for "${query}"`
            : activeGenre.label === 'All' ? 'Recommended for You' : `${activeGenre.label} Music`
          }
        </h2>
        {!loading && <span style={styles.count}>{tracks.length} tracks</span>}
      </div>

      {loading ? (
        <div className="grid-system">
          {Array(8).fill(0).map((_, i) => <MusicCardSkeleton key={i} />)}
        </div>
      ) : tracks.length > 0 ? (
        <HorizontalSection title={query ? `Results for "${query}"` : activeGenre.label === 'All' ? 'Recommended for You' : `${activeGenre.label} Music`}>
          {tracks.map(track => (
            <MusicCard key={track.id} track={track} onPlay={() => playTrack(track, tracks)} />
          ))}
        </HorizontalSection>
      ) : (
        <div style={styles.emptyState}>
          <p style={{ fontSize: '48px' }}>🎵</p>
          <p style={{ color: 'var(--text-secondary)', marginTop: '16px' }}>
            {query ? `No results found for "${query}". Try a different search.` : 'No tracks found.'}
          </p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', maxWidth: '1200px', margin: '0 auto' },
  sectionHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px',
  },
  count: { fontSize: '13px', color: 'var(--text-secondary)' },
  emptyState: { textAlign: 'center', padding: '80px 0' },
};

export default Search;
