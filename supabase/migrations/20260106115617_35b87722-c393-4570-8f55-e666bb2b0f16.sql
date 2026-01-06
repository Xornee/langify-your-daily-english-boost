-- Create app role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create industry context enum
CREATE TYPE public.industry_context AS ENUM ('it', 'finance', 'office', 'general');

-- Create task type enum
CREATE TYPE public.task_type AS ENUM ('FLASHCARD', 'MULTIPLE_CHOICE', 'GAP_FILL');

-- Create level enum
CREATE TYPE public.level AS ENUM ('A1', 'A2', 'B1', 'B2', 'C1', 'C2');

-- User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Profiles table for user data
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    preferred_interface_language TEXT DEFAULT 'pl',
    industry_context industry_context DEFAULT 'general',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Daily goals table
CREATE TABLE public.daily_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    target_xp_per_day INTEGER DEFAULT 50,
    target_lessons_per_day INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User daily stats table
CREATE TABLE public.user_daily_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    xp_earned INTEGER DEFAULT 0,
    lessons_completed INTEGER DEFAULT 0,
    goal_met BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, date)
);

-- Courses table
CREATE TABLE public.courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    industry_tag industry_context DEFAULT 'general',
    level level DEFAULT 'A2',
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    lessons_count INTEGER DEFAULT 0,
    estimated_minutes INTEGER DEFAULT 10,
    image_url TEXT,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Lessons table
CREATE TABLE public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    order_in_course INTEGER DEFAULT 1,
    estimated_minutes INTEGER DEFAULT 5,
    tasks_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Vocabulary items table
CREATE TABLE public.vocabulary_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    english_word_or_phrase TEXT NOT NULL,
    translation TEXT NOT NULL,
    example_sentence TEXT,
    industry_tag industry_context,
    audio_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tasks table
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
    type task_type DEFAULT 'MULTIPLE_CHOICE',
    question_text TEXT NOT NULL,
    question_extra TEXT,
    correct_answer TEXT NOT NULL,
    incorrect_answers TEXT[] DEFAULT '{}',
    vocabulary_id UUID REFERENCES public.vocabulary_items(id) ON DELETE SET NULL,
    order_in_lesson INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- User vocabulary (words saved by users)
CREATE TABLE public.user_vocabulary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    vocabulary_id UUID REFERENCES public.vocabulary_items(id) ON DELETE CASCADE NOT NULL,
    added_manually BOOLEAN DEFAULT true,
    strength INTEGER DEFAULT 0,
    last_seen_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, vocabulary_id)
);

-- Lesson attempts table
CREATE TABLE public.lesson_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE,
    score_percent INTEGER DEFAULT 0,
    total_questions INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    xp_earned INTEGER DEFAULT 0
);

-- Enable RLS on all tables
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_daily_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lesson_attempts ENABLE ROW LEVEL SECURITY;

-- Security definer function to check role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "Users can view own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles" ON public.user_roles
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for daily_goals
CREATE POLICY "Users can view own goals" ON public.daily_goals
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals" ON public.daily_goals
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals" ON public.daily_goals
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for user_daily_stats
CREATE POLICY "Users can view own stats" ON public.user_daily_stats
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stats" ON public.user_daily_stats
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stats" ON public.user_daily_stats
    FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for courses (public read, teacher/admin write)
CREATE POLICY "Anyone can view published courses" ON public.courses
    FOR SELECT USING (is_published = true);

CREATE POLICY "Teachers can create courses" ON public.courses
    FOR INSERT WITH CHECK (
        public.has_role(auth.uid(), 'admin') OR 
        auth.uid() IS NOT NULL
    );

CREATE POLICY "Creators can update own courses" ON public.courses
    FOR UPDATE USING (auth.uid() = created_by OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Creators can delete own courses" ON public.courses
    FOR DELETE USING (auth.uid() = created_by OR public.has_role(auth.uid(), 'admin'));

-- RLS Policies for lessons
CREATE POLICY "Anyone can view lessons" ON public.lessons
    FOR SELECT USING (true);

CREATE POLICY "Course creators can manage lessons" ON public.lessons
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.courses 
            WHERE id = lessons.course_id 
            AND (created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'))
        )
    );

-- RLS Policies for vocabulary_items (public read)
CREATE POLICY "Anyone can view vocabulary" ON public.vocabulary_items
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage vocabulary" ON public.vocabulary_items
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for tasks
CREATE POLICY "Anyone can view tasks" ON public.tasks
    FOR SELECT USING (true);

CREATE POLICY "Lesson creators can manage tasks" ON public.tasks
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.lessons l
            JOIN public.courses c ON c.id = l.course_id
            WHERE l.id = tasks.lesson_id 
            AND (c.created_by = auth.uid() OR public.has_role(auth.uid(), 'admin'))
        )
    );

-- RLS Policies for user_vocabulary
CREATE POLICY "Users can view own vocabulary" ON public.user_vocabulary
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can add to own vocabulary" ON public.user_vocabulary
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own vocabulary" ON public.user_vocabulary
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from own vocabulary" ON public.user_vocabulary
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for lesson_attempts
CREATE POLICY "Users can view own attempts" ON public.lesson_attempts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own attempts" ON public.lesson_attempts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own attempts" ON public.lesson_attempts
    FOR UPDATE USING (auth.uid() = user_id);

-- Trigger to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, name)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data ->> 'name', split_part(NEW.email, '@', 1))
    );
    
    -- Create default daily goal
    INSERT INTO public.daily_goals (user_id, target_xp_per_day, target_lessons_per_day)
    VALUES (NEW.id, 50, 1);
    
    -- Create default user role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
    
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_daily_goals_updated_at
    BEFORE UPDATE ON public.daily_goals
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
    BEFORE UPDATE ON public.courses
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
    BEFORE UPDATE ON public.lessons
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to update lessons_count in courses
CREATE OR REPLACE FUNCTION public.update_course_lessons_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.courses SET lessons_count = lessons_count + 1 WHERE id = NEW.course_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.courses SET lessons_count = lessons_count - 1 WHERE id = OLD.course_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_lesson_change
    AFTER INSERT OR DELETE ON public.lessons
    FOR EACH ROW EXECUTE FUNCTION public.update_course_lessons_count();

-- Function to update tasks_count in lessons
CREATE OR REPLACE FUNCTION public.update_lesson_tasks_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE public.lessons SET tasks_count = tasks_count + 1 WHERE id = NEW.lesson_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE public.lessons SET tasks_count = tasks_count - 1 WHERE id = OLD.lesson_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_task_change
    AFTER INSERT OR DELETE ON public.tasks
    FOR EACH ROW EXECUTE FUNCTION public.update_lesson_tasks_count();