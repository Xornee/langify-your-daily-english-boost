-- Fix function search path warnings by adding SET search_path = public
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_course_lessons_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.courses SET lessons_count = lessons_count + 1 WHERE id = NEW.course_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.courses SET lessons_count = lessons_count - 1 WHERE id = OLD.course_id;
    END IF;
    RETURN NULL;
END;
$$;

CREATE OR REPLACE FUNCTION public.update_lesson_tasks_count()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.lessons SET tasks_count = tasks_count + 1 WHERE id = NEW.lesson_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.lessons SET tasks_count = tasks_count - 1 WHERE id = OLD.lesson_id;
    END IF;
    RETURN NULL;
END;
$$;