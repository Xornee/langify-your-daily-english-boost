-- Drop the old permissive policy
DROP POLICY IF EXISTS "Anyone can view tasks" ON public.tasks;

-- Create a view that hides answers (for students)
CREATE OR REPLACE VIEW public.tasks_secure AS
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

-- Create RLS policy: Students can only see tasks without correct answers (via view)
CREATE POLICY "Students can view tasks via secure view"
ON public.tasks
FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'moderator'::app_role) OR
  EXISTS (
    SELECT 1 FROM lessons l
    JOIN courses c ON c.id = l.course_id
    WHERE l.id = tasks.lesson_id AND c.created_by = auth.uid()
  )
);

-- Create a secure function to check answers
CREATE OR REPLACE FUNCTION public.check_task_answer(
  p_task_id uuid,
  p_user_answer text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_correct_answer text;
  v_is_correct boolean;
BEGIN
  -- Get the correct answer
  SELECT correct_answer INTO v_correct_answer
  FROM public.tasks
  WHERE id = p_task_id;
  
  IF v_correct_answer IS NULL THEN
    RETURN jsonb_build_object('error', 'Task not found');
  END IF;
  
  -- Check if answer is correct (case-insensitive comparison)
  v_is_correct := LOWER(TRIM(p_user_answer)) = LOWER(TRIM(v_correct_answer));
  
  -- Return result with correct answer (only shown after answering)
  RETURN jsonb_build_object(
    'is_correct', v_is_correct,
    'correct_answer', v_correct_answer
  );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.check_task_answer(uuid, text) TO authenticated;