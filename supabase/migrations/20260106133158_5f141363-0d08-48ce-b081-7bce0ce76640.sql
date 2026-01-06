-- Create a function to get shuffled task options (without revealing which is correct)
CREATE OR REPLACE FUNCTION public.get_task_options(p_task_id uuid)
RETURNS text[]
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_correct_answer text;
  v_incorrect_answers text[];
  v_all_answers text[];
BEGIN
  -- Get the answers
  SELECT correct_answer, incorrect_answers INTO v_correct_answer, v_incorrect_answers
  FROM public.tasks
  WHERE id = p_task_id;
  
  IF v_correct_answer IS NULL THEN
    RETURN ARRAY[]::text[];
  END IF;
  
  -- Combine and shuffle answers
  v_all_answers := array_prepend(v_correct_answer, COALESCE(v_incorrect_answers, ARRAY[]::text[]));
  
  -- Simple shuffle using random()
  SELECT array_agg(val ORDER BY random()) INTO v_all_answers
  FROM unnest(v_all_answers) AS val;
  
  RETURN v_all_answers;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_task_options(uuid) TO authenticated, anon;