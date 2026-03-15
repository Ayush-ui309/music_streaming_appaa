# Music App

A full React.js web application for music streaming using:
- **React.js** (Vite framework)
- **Supabase** (Authentication and Database for user favorites/playlists)
- **Jamendo API** (Free music API for streaming tracks)
- **React Router** (Navigation)
- **Lucide React** (Icons)

## Setup Instructions

1. Ensure Node.js is installed.
2. Run `npm install` within the `music-app` directory to load all dependencies.
3. Use the pre-existing `.env` variables or confirm they are populated:
   ```env
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   VITE_JAMENDO_CLIENT_ID=...
   ```
4. Run `npm start` or `npm run dev` to start the development server.

## Features
- **Supabase Authentication**: Handle user login and sign-up with session storage.
- **Audio Player Context**: A persistent music player wrapper using React Context.
- **Jamendo API Integration**: Fetch tracks, top charts, and search across thousands of royalty-free songs.
- **Favorites & Playlists**: Managed gracefully in Supabase for authenticated users.

## Structure
Standard Vite-React scaffold utilizing Context APIs and centralized service patterns for clean separation.
