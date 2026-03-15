import { favoriteService } from './favoriteService';
import { getTracksByTag } from '../api/jamendoApi';
import { parseJamendoTrack } from '../utils/helpers';

export const recommendationService = {
  async getRecommendations(limit = 10) {
    try {
      // 1. Get user's favorites to see what they like
      const favorites = await favoriteService.getFavorites();
      
      if (favorites.length === 0) {
        // Fallback to general popular tracks if no favorites
        return [];
      }

      // 2. Extract potential genres/tags from favorites
      // Note: metadata usually contains tags if we saved them. 
      // If not, we can use a fixed set or fetch more details.
      // For now, let's assume we can derive some tags or just pick a few random favorites' terms.
      
      // Simpler approach: Pick 2-3 random favorite tags and search tracks for them
      const tags = new Set();
      favorites.forEach(fav => {
        if (fav.metadata?.tags && Array.isArray(fav.metadata.tags)) {
          fav.metadata.tags.slice(0, 2).forEach(t => tags.add(t));
        }
      });

      // If no tags found in metadata, use fallback tags
      if (tags.size === 0) {
        tags.add('rock');
        tags.add('pop');
        tags.add('electronic');
      }

      const tagArray = Array.from(tags);
      const randomTag = tagArray[Math.floor(Math.random() * tagArray.length)];
      
      const rawTracks = await getTracksByTag(randomTag, limit);
      return rawTracks.map(parseJamendoTrack);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      return [];
    }
  }
};
