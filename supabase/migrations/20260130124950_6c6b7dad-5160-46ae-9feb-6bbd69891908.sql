-- ============================================
-- StudyFlow AI Database Schema
-- ============================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. User Profiles Table
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  education_level TEXT CHECK (education_level IN ('school', 'college', 'self_learner', NULL)),
  preferred_subjects TEXT[],
  daily_study_target INTEGER DEFAULT 30, -- in minutes
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  badges TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- 2. Courses Table
-- ============================================
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  learning_level TEXT CHECK (learning_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  syllabus_text TEXT,
  total_xp INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  progress_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS on courses
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Courses policies
CREATE POLICY "Users can view their own courses"
  ON public.courses FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own courses"
  ON public.courses FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own courses"
  ON public.courses FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own courses"
  ON public.courses FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================
-- 3. Topics Table
-- ============================================
CREATE TABLE public.topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
  estimated_time INTEGER DEFAULT 30, -- in minutes
  xp_reward INTEGER DEFAULT 100,
  order_index INTEGER NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  resources JSONB DEFAULT '[]',
  notes TEXT,
  video_progress INTEGER DEFAULT 0, -- percentage watched
  next_revision_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS on topics
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;

-- Topics policies (users can access topics of their own courses)
CREATE POLICY "Users can view topics of their courses"
  ON public.topics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE courses.id = topics.course_id 
      AND courses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create topics for their courses"
  ON public.topics FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE courses.id = course_id 
      AND courses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update topics of their courses"
  ON public.topics FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE courses.id = topics.course_id 
      AND courses.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete topics of their courses"
  ON public.topics FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.courses 
      WHERE courses.id = topics.course_id 
      AND courses.user_id = auth.uid()
    )
  );

-- ============================================
-- 4. Quizzes Table
-- ============================================
CREATE TABLE public.quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE NOT NULL,
  questions JSONB NOT NULL, -- Array of question objects
  score INTEGER,
  max_score INTEGER,
  passed BOOLEAN DEFAULT false,
  xp_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS on quizzes
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

-- Quizzes policies
CREATE POLICY "Users can view quizzes of their topics"
  ON public.quizzes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.topics t
      JOIN public.courses c ON c.id = t.course_id
      WHERE t.id = quizzes.topic_id 
      AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create quizzes for their topics"
  ON public.quizzes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.topics t
      JOIN public.courses c ON c.id = t.course_id
      WHERE t.id = topic_id 
      AND c.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update quizzes of their topics"
  ON public.quizzes FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.topics t
      JOIN public.courses c ON c.id = t.course_id
      WHERE t.id = quizzes.topic_id 
      AND c.user_id = auth.uid()
    )
  );

-- ============================================
-- 5. Leaderboard View (Global XP ranking)
-- ============================================
CREATE VIEW public.leaderboard AS
SELECT 
  p.id,
  p.user_id,
  p.username,
  p.full_name,
  p.avatar_url,
  p.xp,
  p.level,
  p.streak,
  p.badges,
  RANK() OVER (ORDER BY p.xp DESC) as rank
FROM public.profiles p
WHERE p.xp > 0
ORDER BY p.xp DESC;

-- ============================================
-- 6. Update timestamp trigger function
-- ============================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_topics_updated_at
  BEFORE UPDATE ON public.topics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- 7. Auto-create profile on user signup
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'username',
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- 8. XP and Level update function
-- ============================================
CREATE OR REPLACE FUNCTION public.add_xp(
  p_user_id UUID,
  p_xp_amount INTEGER
)
RETURNS TABLE(new_xp INTEGER, new_level INTEGER, leveled_up BOOLEAN)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_xp INTEGER;
  current_level INTEGER;
  calculated_level INTEGER;
BEGIN
  -- Get current XP and level
  SELECT xp, level INTO current_xp, current_level
  FROM public.profiles WHERE user_id = p_user_id;
  
  -- Calculate new XP
  new_xp := COALESCE(current_xp, 0) + p_xp_amount;
  
  -- Calculate level based on XP thresholds
  -- Level 1: 0-100, Level 2: 100-300, Level 3: 300-600, Level 4: 600+
  calculated_level := CASE
    WHEN new_xp >= 600 THEN 4
    WHEN new_xp >= 300 THEN 3
    WHEN new_xp >= 100 THEN 2
    ELSE 1
  END;
  
  new_level := calculated_level;
  leveled_up := calculated_level > COALESCE(current_level, 1);
  
  -- Update profile
  UPDATE public.profiles 
  SET xp = new_xp, level = new_level, last_activity_date = CURRENT_DATE
  WHERE user_id = p_user_id;
  
  RETURN NEXT;
END;
$$;