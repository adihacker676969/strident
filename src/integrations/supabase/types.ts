export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      courses: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_completed: boolean | null
          learning_level: string | null
          progress_percentage: number | null
          syllabus_text: string | null
          title: string
          total_xp: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_completed?: boolean | null
          learning_level?: string | null
          progress_percentage?: number | null
          syllabus_text?: string | null
          title: string
          total_xp?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_completed?: boolean | null
          learning_level?: string | null
          progress_percentage?: number | null
          syllabus_text?: string | null
          title?: string
          total_xp?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          badges: string[] | null
          bio: string | null
          created_at: string
          daily_study_target: number | null
          education_level: string | null
          full_name: string | null
          id: string
          last_activity_date: string | null
          level: number | null
          preferred_subjects: string[] | null
          streak: number | null
          updated_at: string
          user_id: string
          username: string | null
          xp: number | null
        }
        Insert: {
          avatar_url?: string | null
          badges?: string[] | null
          bio?: string | null
          created_at?: string
          daily_study_target?: number | null
          education_level?: string | null
          full_name?: string | null
          id?: string
          last_activity_date?: string | null
          level?: number | null
          preferred_subjects?: string[] | null
          streak?: number | null
          updated_at?: string
          user_id: string
          username?: string | null
          xp?: number | null
        }
        Update: {
          avatar_url?: string | null
          badges?: string[] | null
          bio?: string | null
          created_at?: string
          daily_study_target?: number | null
          education_level?: string | null
          full_name?: string | null
          id?: string
          last_activity_date?: string | null
          level?: number | null
          preferred_subjects?: string[] | null
          streak?: number | null
          updated_at?: string
          user_id?: string
          username?: string | null
          xp?: number | null
        }
        Relationships: []
      }
      quizzes: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          max_score: number | null
          passed: boolean | null
          questions: Json
          score: number | null
          topic_id: string
          xp_earned: number | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          max_score?: number | null
          passed?: boolean | null
          questions: Json
          score?: number | null
          topic_id: string
          xp_earned?: number | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          max_score?: number | null
          passed?: boolean | null
          questions?: Json
          score?: number | null
          topic_id?: string
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          completed_at: string | null
          course_id: string
          created_at: string
          description: string | null
          difficulty: string | null
          estimated_time: number | null
          id: string
          is_completed: boolean | null
          name: string
          next_revision_date: string | null
          notes: string | null
          order_index: number
          resources: Json | null
          updated_at: string
          video_progress: number | null
          xp_reward: number | null
        }
        Insert: {
          completed_at?: string | null
          course_id: string
          created_at?: string
          description?: string | null
          difficulty?: string | null
          estimated_time?: number | null
          id?: string
          is_completed?: boolean | null
          name: string
          next_revision_date?: string | null
          notes?: string | null
          order_index: number
          resources?: Json | null
          updated_at?: string
          video_progress?: number | null
          xp_reward?: number | null
        }
        Update: {
          completed_at?: string | null
          course_id?: string
          created_at?: string
          description?: string | null
          difficulty?: string | null
          estimated_time?: number | null
          id?: string
          is_completed?: boolean | null
          name?: string
          next_revision_date?: string | null
          notes?: string | null
          order_index?: number
          resources?: Json | null
          updated_at?: string
          video_progress?: number | null
          xp_reward?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "topics_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      leaderboard: {
        Row: {
          avatar_url: string | null
          badges: string[] | null
          full_name: string | null
          id: string | null
          level: number | null
          rank: number | null
          streak: number | null
          user_id: string | null
          username: string | null
          xp: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      add_xp: {
        Args: { p_user_id: string; p_xp_amount: number }
        Returns: {
          leveled_up: boolean
          new_level: number
          new_xp: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
