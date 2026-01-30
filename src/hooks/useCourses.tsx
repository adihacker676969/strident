/**
 * useCourses.tsx
 * Custom hook to manage courses data
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Course data structure matching our database
export interface Course {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  learning_level: 'beginner' | 'intermediate' | 'advanced';
  syllabus_text: string | null;
  total_xp: number;
  is_completed: boolean;
  progress_percentage: number;
  created_at: string;
  updated_at: string;
}

// Topic data structure
export interface Topic {
  id: string;
  course_id: string;
  name: string;
  description: string | null;
  difficulty: 'easy' | 'medium' | 'hard';
  estimated_time: number;
  xp_reward: number;
  order_index: number;
  is_completed: boolean;
  completed_at: string | null;
  resources: unknown;
  notes: string | null;
  video_progress: number;
  next_revision_date: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Hook to fetch all courses for the current user
 */
export const useCourses = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['courses', user?.id],
    queryFn: async (): Promise<Course[]> => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching courses:', error);
        return [];
      }

      return data as Course[];
    },
    enabled: !!user,
  });
};

/**
 * Hook to fetch a single course with its topics
 */
export const useCourse = (courseId: string | undefined) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['course', courseId],
    queryFn: async (): Promise<{ course: Course; topics: Topic[] } | null> => {
      if (!user || !courseId) return null;

      // Fetch course
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (courseError) {
        console.error('Error fetching course:', courseError);
        return null;
      }

      // Fetch topics for this course
      const { data: topics, error: topicsError } = await supabase
        .from('topics')
        .select('*')
        .eq('course_id', courseId)
        .order('order_index', { ascending: true });

      if (topicsError) {
        console.error('Error fetching topics:', topicsError);
        return null;
      }

      return {
        course: course as Course,
        topics: topics as Topic[],
      };
    },
    enabled: !!user && !!courseId,
  });
};

/**
 * Hook to create a new course
 */
export const useCreateCourse = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (courseData: {
      title: string;
      description?: string;
      learning_level: 'beginner' | 'intermediate' | 'advanced';
      syllabus_text?: string;
    }) => {
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('courses')
        .insert({
          ...courseData,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses', user?.id] });
      toast({
        title: 'Course created!',
        description: 'Your new learning journey begins.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error creating course',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook to create topics for a course
 */
export const useCreateTopics = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (topicsData: {
      course_id: string;
      topics: Array<{
        name: string;
        description?: string;
        difficulty: 'easy' | 'medium' | 'hard';
        estimated_time: number;
        xp_reward: number;
        order_index: number;
      }>;
    }) => {
      const topicsToInsert = topicsData.topics.map((topic) => ({
        ...topic,
        course_id: topicsData.course_id,
      }));

      const { data, error } = await supabase
        .from('topics')
        .insert(topicsToInsert)
        .select();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course', variables.course_id] });
    },
  });
};

/**
 * Hook to mark a topic as completed
 */
export const useCompleteTopic = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ topicId, courseId }: { topicId: string; courseId: string }) => {
      const { data, error } = await supabase
        .from('topics')
        .update({
          is_completed: true,
          completed_at: new Date().toISOString(),
        })
        .eq('id', topicId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['course', variables.courseId] });
      toast({
        title: '🎉 Topic completed!',
        description: 'Great job! Keep up the learning streak.',
      });
    },
  });
};
