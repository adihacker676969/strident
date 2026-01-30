/**
 * useProfile.tsx
 * Custom hook to fetch and manage user profile data
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// Profile data structure matching our database
export interface Profile {
  id: string;
  user_id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  education_level: 'school' | 'college' | 'self_learner' | null;
  preferred_subjects: string[] | null;
  daily_study_target: number;
  xp: number;
  level: number;
  streak: number;
  last_activity_date: string | null;
  badges: string[];
  created_at: string;
  updated_at: string;
}

/**
 * Hook to fetch the current user's profile
 */
export const useProfile = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async (): Promise<Profile | null> => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data as Profile;
    },
    enabled: !!user, // Only run query when user is logged in
  });
};

/**
 * Hook to update the current user's profile
 */
export const useUpdateProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      toast({
        title: 'Profile updated!',
        description: 'Your changes have been saved.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error updating profile',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook to add XP to the current user
 */
export const useAddXP = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (xpAmount: number) => {
      if (!user) throw new Error('No user logged in');

      const { data, error } = await supabase
        .rpc('add_xp', {
          p_user_id: user.id,
          p_xp_amount: xpAmount,
        });

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      
      // Check if user leveled up
      if (data && data[0]?.leveled_up) {
        toast({
          title: '🎉 Level Up!',
          description: `Congratulations! You reached level ${data[0].new_level}!`,
        });
      }
    },
  });
};
