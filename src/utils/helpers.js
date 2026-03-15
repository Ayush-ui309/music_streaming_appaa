export const generateRandomId = () => {
  return Math.random().toString(36).substring(2, 9);
};

export const parseJamendoTrack = (track) => {
  if (!track) return null;
  return {
    id: track.id,
    title: track.name,
    artist: track.artist_name,
    album: track.album_name,
    duration: track.duration,
    image: track.image,
    audioUrl: track.audio,
    audiodownload: track.audiodownload
  };
};

export const debounce = (func, delay) => {
  let timerId;
  return (...args) => {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
};
