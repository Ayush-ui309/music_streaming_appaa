import axios from 'axios';
import { JAMENDO_API_URL, CLIENT_ID } from '../utils/constants';

const jamendoClient = axios.create({
  baseURL: JAMENDO_API_URL,
  params: { client_id: CLIENT_ID, format: 'json' },
});

// base fetch helper
export const getTracks = async (params = {}) => {
  try {
    const response = await jamendoClient.get('/tracks/', {
      params: { limit: 20, include: 'musicinfo', ...params },
    });
    return response.data.results || [];
  } catch (error) {
    console.error('Jamendo API error:', error);
    return [];
  }
};

// Original exports kept intact
export const searchTracks = async (query) =>
  getTracks({ search: query });

export const getTopTracks = async (limit = 50) =>
  getTracks({ boost: 'popularity_week', limit });

export const getTrackInfo = async (id) => {
  const results = await getTracks({ id });
  return results[0] || null;
};

// NEW: genre filter via Jamendo tag
export const getTracksByTag = async (tag, limit = 30) =>
  getTracks({ tags: tag, limit });

// NEW: recent releases
export const getRecentTracks = async (limit = 20) =>
  getTracks({ order: 'releasedate_desc', limit });

// NEW: trending (all-time popularity boost)
export const getTrendingTracks = async (limit = 20) =>
  getTracks({ boost: 'popularity_total', limit });

// NEW: mock podcasts (Jamendo has spoken word / ambient style content)
export const getPodcasts = async () =>
  getTracks({ tags: 'spoken', limit: 12 });

// NEW: mock audiobooks / ambient  
export const getAudiobooks = async () =>
  getTracks({ tags: 'ambient', limit: 12 });

// Mock data for content types Jamendo doesn't have
export const getMockLiveEvents = () => [
  { id: 'le1', title: 'Neon Dreams Live', artist: 'DJ Cosmic', image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300', date: 'Apr 2, 2025', venue: 'Tokyo Dome', price: '$45' },
  { id: 'le2', title: 'Jazz Under Stars', artist: 'The Blue Quartet', image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300', date: 'Apr 10, 2025', venue: 'Rooftop NYC', price: '$30' },
  { id: 'le3', title: 'Bass Odyssey', artist: 'Resonance', image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300', date: 'Apr 15, 2025', venue: 'Berlin Arena', price: '$55' },
  { id: 'le4', title: 'Acoustic Sessions', artist: 'Elara Jones', image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300', date: 'Apr 20, 2025', venue: 'London Café', price: '$20' },
  { id: 'le5', title: 'Electronic Pulse', artist: 'SynthCore', image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=300', date: 'May 1, 2025', venue: 'Amsterdam RAI', price: '$65' },
  { id: 'le6', title: 'Global Beats Fest', artist: 'Various Artists', image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=300', date: 'May 12, 2025', venue: 'Dubai Expo', price: '$80' },
];

// Recently played — stored in localStorage
export const getRecentlyPlayed = () => {
  try {
    return JSON.parse(localStorage.getItem('sonicwave_recent') || '[]');
  } catch {
    return [];
  }
};

export const addToRecentlyPlayed = (track) => {
  try {
    const recent = getRecentlyPlayed();
    const filtered = recent.filter(t => t.id !== track.id);
    const updated = [track, ...filtered].slice(0, 10);
    localStorage.setItem('sonicwave_recent', JSON.stringify(updated));
  } catch {}
};
