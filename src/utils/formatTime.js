/**
 * Formats seconds into MM:SS format
 * @param {number} seconds
 * @returns {string} Default to "0:00" if invalid
 */
export const formatTime = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};
