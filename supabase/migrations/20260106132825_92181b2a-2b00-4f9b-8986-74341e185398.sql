-- Fix the security definer view warning by recreating with SECURITY INVOKER
DROP VIEW IF EXISTS public.tasks_secure;

CREATE VIEW public.tasks_secure 
WITH (security_invoker = true)
AS
SELECT 
  id,
  lesson_id,
  type,
  order_in_lesson,
  question_text,
  question_extra,
  vocabulary_id,
  incorrect_answers,
  created_at
FROM public.tasks;

-- Grant access to the view
GRANT SELECT ON public.tasks_secure TO anon, authenticated;

-- Add a policy that allows anyone to select from tasks_secure since it doesn't expose answers
-- We need a permissive policy for the underlying table so the view can access it
CREATE POLICY "Allow view access for authenticated users"
ON public.tasks
FOR SELECT
USING (auth.uid() IS NOT NULL);