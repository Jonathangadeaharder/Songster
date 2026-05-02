-- Enable anonymous sign-ins for guest users
-- Supabase anonymous auth creates real auth.users entries with is_anonymous = true
-- Existing RLS policies using auth.uid() already work for anonymous users

-- Allow anonymous users to read rooms they are members of (already covered by existing policy)
-- Allow anonymous users to create rooms (already covered by existing policy)
-- Allow anonymous users to join rooms (already covered by existing policy)

-- Add index for faster auth lookups
CREATE INDEX IF NOT EXISTS idx_players_user_id ON public.players(user_id);
