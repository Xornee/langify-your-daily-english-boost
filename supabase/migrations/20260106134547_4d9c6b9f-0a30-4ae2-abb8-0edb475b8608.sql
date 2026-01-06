-- Rename the role value from 'moderator' to 'teacher'
-- This makes the roles "live" and consistent across UI + policies
DO $$
BEGIN
  -- Only run if old value exists (safe to re-run)
  IF EXISTS (
    SELECT 1
    FROM pg_enum e
    JOIN pg_type t ON t.oid = e.enumtypid
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'public'
      AND t.typname = 'app_role'
      AND e.enumlabel = 'moderator'
  ) THEN
    ALTER TYPE public.app_role RENAME VALUE 'moderator' TO 'teacher';
  END IF;
END $$;

-- Update policies that referenced 'moderator'
DO $$
BEGIN
  -- lesson_attempts policies
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='lesson_attempts' AND policyname='Teachers and admins can view all attempts'
  ) THEN
    ALTER POLICY "Teachers and admins can view all attempts" ON public.lesson_attempts
    USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'teacher'::app_role));
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='lesson_attempts' AND policyname='Teachers and admins can view all attempts '
  ) THEN
    ALTER POLICY "Teachers and admins can view all attempts " ON public.lesson_attempts
    USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'teacher'::app_role));
  END IF;

  -- user_daily_stats policies
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_daily_stats' AND policyname='Teachers and admins can view all daily stats'
  ) THEN
    ALTER POLICY "Teachers and admins can view all daily stats" ON public.user_daily_stats
    USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'teacher'::app_role));
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='user_daily_stats' AND policyname='Teachers and admins can view all daily stats '
  ) THEN
    ALTER POLICY "Teachers and admins can view all daily stats " ON public.user_daily_stats
    USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'teacher'::app_role));
  END IF;
END $$;

-- courses: tighten insert policy to teachers/admins (it was allowing any authenticated user)
DROP POLICY IF EXISTS "Teachers can create courses" ON public.courses;
CREATE POLICY "Teachers can create courses"
ON public.courses
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'teacher'::app_role));

-- lessons/tasks management policies: swap to teacher naming (still checks course creator OR admin)
-- No changes required here because they don't reference the enum value directly.
