-- Create recently_played table
CREATE TABLE recently_played (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  track_id TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  played_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE recently_played ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage own history"
  ON recently_played FOR ALL USING (auth.uid() = user_id);

-- Indexes for performance
CREATE INDEX idx_recently_played_user_id ON recently_played(user_id);
CREATE INDEX idx_recently_played_played_at ON recently_played(played_at);
