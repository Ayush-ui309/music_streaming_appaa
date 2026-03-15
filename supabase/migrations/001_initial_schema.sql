-- ================================================================
-- SonicWave Music App - Initial Supabase Schema
-- Run this entire script in the Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql/new
-- ================================================================

-- ────────────────────────────────────────────────────────────────
-- 1. PLAYLISTS TABLE
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.playlists (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  description TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ────────────────────────────────────────────────────────────────
-- 2. PLAYLIST_TRACKS TABLE
--    (stores Jamendo track IDs + cached metadata as JSONB)
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.playlist_tracks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  playlist_id UUID NOT NULL REFERENCES public.playlists(id) ON DELETE CASCADE,
  track_id    TEXT NOT NULL,           -- Jamendo track ID (string)
  metadata    JSONB DEFAULT '{}',      -- cached title, artist, image, audioUrl
  added_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(playlist_id, track_id)        -- prevent duplicate tracks in same playlist
);

-- ────────────────────────────────────────────────────────────────
-- 3. FAVORITES TABLE
-- ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.favorites (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id    TEXT NOT NULL,           -- Jamendo track ID (string)
  metadata    JSONB DEFAULT '{}',      -- cached title, artist, image, audioUrl
  liked_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, track_id)           -- prevent duplicate favorites
);

-- ────────────────────────────────────────────────────────────────
-- 4. ENABLE ROW-LEVEL SECURITY (RLS)
-- ────────────────────────────────────────────────────────────────
ALTER TABLE public.playlists      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites      ENABLE ROW LEVEL SECURITY;

-- ────────────────────────────────────────────────────────────────
-- 5. RLS POLICIES — PLAYLISTS
-- ────────────────────────────────────────────────────────────────

-- Users can only SELECT their own playlists
CREATE POLICY "Users can view own playlists"
  ON public.playlists FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only INSERT playlists for themselves
CREATE POLICY "Users can create own playlists"
  ON public.playlists FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only UPDATE their own playlists
CREATE POLICY "Users can update own playlists"
  ON public.playlists FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can only DELETE their own playlists
CREATE POLICY "Users can delete own playlists"
  ON public.playlists FOR DELETE
  USING (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────────
-- 6. RLS POLICIES — PLAYLIST_TRACKS
--    (Access is inherited via the parent playlist's user_id)
-- ────────────────────────────────────────────────────────────────

-- Users can view tracks in playlists they own
CREATE POLICY "Users can view tracks in own playlists"
  ON public.playlist_tracks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.playlists
      WHERE playlists.id = playlist_tracks.playlist_id
        AND playlists.user_id = auth.uid()
    )
  );

-- Users can add tracks to playlists they own
CREATE POLICY "Users can add tracks to own playlists"
  ON public.playlist_tracks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.playlists
      WHERE playlists.id = playlist_tracks.playlist_id
        AND playlists.user_id = auth.uid()
    )
  );

-- Users can delete tracks from their own playlists
CREATE POLICY "Users can remove tracks from own playlists"
  ON public.playlist_tracks FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.playlists
      WHERE playlists.id = playlist_tracks.playlist_id
        AND playlists.user_id = auth.uid()
    )
  );

-- ────────────────────────────────────────────────────────────────
-- 7. RLS POLICIES — FAVORITES
-- ────────────────────────────────────────────────────────────────

-- Users can view their own favorites
CREATE POLICY "Users can view own favorites"
  ON public.favorites FOR SELECT
  USING (auth.uid() = user_id);

-- Users can add their own favorites
CREATE POLICY "Users can add own favorites"
  ON public.favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own favorites
CREATE POLICY "Users can delete own favorites"
  ON public.favorites FOR DELETE
  USING (auth.uid() = user_id);

-- ────────────────────────────────────────────────────────────────
-- 8. INDEXES FOR PERFORMANCE
-- ────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_playlists_user_id       ON public.playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_playlist_tracks_playlist ON public.playlist_tracks(playlist_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id        ON public.favorites(user_id);

-- ================================================================
-- DONE! All tables, RLS, and indexes are set up.
-- ================================================================
