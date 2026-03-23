# 🎵 Music Streaming App (MusicApp)

A sophisticated, full-featured music streaming web application built with React.js and Vite, powered by Supabase for backend services and Jamendo API for a vast library of royalty-free music.

![Vercel Deployment](https://img.shields.io/badge/Vercel-Deployed-green?style=for-the-badge&logo=vercel)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## ✨ Features

- **🔐 Secure Authentication**: Robust user login and sign-up powered by **Supabase Auth**.
- **🎶 High-Quality Streaming**: Seamless music playback using the **Jamendo API**.
- **🎧 Persistent Music Player**: A state-of-the-art player context that maintains playback across page navigation.
- **🔍 Advanced Search**: Find your favorite tracks, artists, and albums with real-time search.
- **📂 Playlist Management**: Create, edit, and manage custom playlists.
- **🤖 AI-Powered Playlists**: Generate smart playlists based on your listening habits (AI-assisted).
- **❤️ Favorites**: Like and save tracks to your personal favorites collection.
- **🕒 Recently Played**: Keep track of your listening history automatically.
- **🔔 Real-time Notifications**: Activity alerts and system updates integrated with Supabase.
- **👁️ Watchlist**: Save music videos and tracks for later viewing.
- **📱 Responsive Design**: Fully optimized for mobile, tablet, and desktop viewing.
- **⭐ Premium Tier**: Experience the "Premium" features with a dedicated subscriber interface.

## 🛠️ Tech Stack

- **Frontend**: [React.js](https://reactjs.org/) (Hooks, Context API)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Backend/Database**: [Supabase](https://supabase.com/) (PostgreSQL + Realtime)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: Vanilla CSS (Modern CSS variables and flexbox/grid)
- **API**: [Jamendo Music API](https://developer.jamendo.com/v3.0)

## 📁 Project Structure

```text
src/
├── api/             # API service integrations (Jamendo, AI Playlist)
├── components/      # Reusable UI components (Player, Navbar, Cards)
├── context/         # React Context providers (Auth, Player, Toast)
├── hooks/           # Custom React hooks (useAuth, usePlayer)
├── pages/           # Page components (Home, Dashboard, Profile)
├── routes/          # Navigation and routing setup
├── services/        # Business logic and Supabase services
├── styles/          # Global and component-specific styles
└── utils/           # Helper functions and constants
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18.x or higher)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Ayush-ui309/music_streaming_appaa.git
   cd music-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory and add your credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_JAMENDO_CLIENT_ID=your_jamendo_client_id
   ```

4. **Run the application**:
   ```bash
   npm run dev
   ```

## 🌐 Deployment

The application is deployed on **Vercel**. You can visit the live app here:
👉 [https://music-streaming-appaa.vercel.app/](https://music-streaming-appaa.vercel.app/)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---
Developed with ❤️ by [Ayush](https://github.com/Ayush-ui309)
