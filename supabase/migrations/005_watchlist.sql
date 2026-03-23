-- Create watchlist table
CREATE TABLE IF NOT EXISTS public.watchlist (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id    TEXT NOT NULL,           -- Jamendo track ID
  metadata    JSONB DEFAULT '{}',      -- cached metadata
  added_at    TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, track_id)
);

-- Enable RLS
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own watchlist" ON public.watchlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to own watchlist" ON public.watchlist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete from own watchlist" ON public.watchlist FOR DELETE USING (auth.uid() = user_id);

-- Index
CREATE INDEX IF NOT EXISTS idx_watchlist_user_id ON public.watchlist(user_id);
