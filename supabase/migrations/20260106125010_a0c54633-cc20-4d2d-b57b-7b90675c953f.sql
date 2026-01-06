-- Allow all authenticated users to view user_daily_stats for leaderboard
CREATE POLICY "Anyone can view stats for leaderboard"
ON public.user_daily_stats
FOR SELECT
USING (true);

-- Drop the restrictive policy that only allows viewing own stats
DROP POLICY IF EXISTS "Users can view own stats" ON public.user_daily_stats;