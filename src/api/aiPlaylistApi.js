// Mocked AI Playlist Generator
// In a real application, this would call an AI backend service (e.g., OpenAI)

const MOOD_PLAYLISTS = {
  chill: ['chillout', 'lofi', 'ambient'],
  workout: ['electronic', 'dance', 'upbeat'],
  focus: ['classical', 'instrumental', 'focus'],
  party: ['pop', 'hiphop', 'party']
};

export const generateAiPlaylist = async (moodDescription) => {
  // Simple keyword matching for mock
  const lowerDesc = moodDescription.toLowerCase();
  
  let tags = ['pop']; // default
  if (lowerDesc.includes('chill') || lowerDesc.includes('relax')) {
    tags = MOOD_PLAYLISTS.chill;
  } else if (lowerDesc.includes('workout') || lowerDesc.includes('gym') || lowerDesc.includes('run')) {
    tags = MOOD_PLAYLISTS.workout;
  } else if (lowerDesc.includes('study') || lowerDesc.includes('focus')) {
    tags = MOOD_PLAYLISTS.focus;
  } else if (lowerDesc.includes('party') || lowerDesc.includes('dance')) {
    tags = MOOD_PLAYLISTS.party;
  }

  // Import jamendo API dynamically to avoid circular dependency issues if any
  const { getTracks } = await import('./jamendoApi');
  
  // Fetch tracks based on derived tags
  const promises = tags.map(tag => getTracks({ tags: tag, limit: 5 }));
  const results = await Promise.all(promises);
  
  // Flatten and deduplicate
  const tracks = results.flat();
  const uniqueTracks = Array.from(new Map(tracks.map(item => [item.id, item])).values());
  
  return uniqueTracks.slice(0, 15); // Return top 15 tracks
};
