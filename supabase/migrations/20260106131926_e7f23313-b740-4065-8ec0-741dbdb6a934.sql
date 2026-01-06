-- Allow teachers and admins to view all lesson attempts for statistics
CREATE POLICY "Teachers and admins can view all attempts"
ON public.lesson_attempts
FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'moderator'::app_role)
);

-- Allow teachers and admins to view all user daily stats
CREATE POLICY "Teachers and admins can view all daily stats"
ON public.user_daily_stats
FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'moderator'::app_role)
);