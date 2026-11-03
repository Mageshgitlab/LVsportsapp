-- ==============================================================================
-- LV SPORTS CARNIVAL - SUPABASE DATABASE SETUP
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/cqkhfskjxeghcmknvibs/sql/new
-- ==============================================================================

-- 1. Create the carnival_state table
CREATE TABLE IF NOT EXISTS public.carnival_state (
  id TEXT PRIMARY KEY,
  data JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.carnival_state ENABLE ROW LEVEL SECURITY;

-- 3. Create policies for public access (TV screens & Admin)
DROP POLICY IF EXISTS "Allow public read on carnival_state" ON public.carnival_state;
CREATE POLICY "Allow public read on carnival_state"
  ON public.carnival_state
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Allow public write on carnival_state" ON public.carnival_state;
CREATE POLICY "Allow public write on carnival_state"
  ON public.carnival_state
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- 4. Enable Supabase Realtime for instant live score broadcasts to all TV screens
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'carnival_state'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.carnival_state;
  END IF;
END $$;
