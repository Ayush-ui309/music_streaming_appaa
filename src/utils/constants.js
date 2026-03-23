export const JAMENDO_API_URL = 'https://api.jamendo.com/v3.0';
export const CLIENT_ID = import.meta.env.VITE_JAMENDO_CLIENT_ID;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  SEARCH: '/search',
  PLAYLIST: '/playlist/:id',
  FAVORITES: '/favorites',
  PROFILE: '/profile',
  WATCHLIST: '/watchlist',
};
