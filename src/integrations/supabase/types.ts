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
          created_by: string | null
          description: string
          estimated_minutes: number | null
          id: string
          image_url: string | null
          industry_tag: Database["public"]["Enums"]["industry_context"] | null
          is_published: boolean | null
          lessons_count: number | null
          level: Database["public"]["Enums"]["level"] | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description: string
          estimated_minutes?: number | null
          id?: string
          image_url?: string | null
          industry_tag?: Database["public"]["Enums"]["industry_context"] | null
          is_published?: boolean | null
          lessons_count?: number | null
          level?: Database["public"]["Enums"]["level"] | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string
          estimated_minutes?: number | null
          id?: string
          image_url?: string | null
          industry_tag?: Database["public"]["Enums"]["industry_context"] | null
          is_published?: boolean | null
          lessons_count?: number | null
          level?: Database["public"]["Enums"]["level"] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      daily_goals: {
        Row: {
          created_at: string
          id: string
          target_lessons_per_day: number | null
          target_xp_per_day: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          target_lessons_per_day?: number | null
          target_xp_per_day?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          target_lessons_per_day?: number | null
          target_xp_per_day?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      lesson_attempts: {
        Row: {
          completed_at: string | null
          correct_answers: number | null
          id: string
          lesson_id: string
          score_percent: number | null
          started_at: string
          total_questions: number | null
          user_id: string
          xp_earned: number | null
        }
        Insert: {
          completed_at?: string | null
          correct_answers?: number | null
          id?: string
          lesson_id: string
          score_percent?: number | null
          started_at?: string
          total_questions?: number | null
          user_id: string
          xp_earned?: number | null
        }
        Update: {
          completed_at?: string | null
          correct_answers?: number | null
          id?: string
          lesson_id?: string
          score_percent?: number | null
          started_at?: string
          total_questions?: number | null
          user_id?: string
          xp_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_attempts_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          estimated_minutes: number | null
          id: string
          order_in_course: number | null
          tasks_count: number | null
          title: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          estimated_minutes?: number | null
          id?: string
          order_in_course?: number | null
          tasks_count?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          estimated_minutes?: number | null
          id?: string
          order_in_course?: number | null
          tasks_count?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          industry_context:
            | Database["public"]["Enums"]["industry_context"]
            | null
          name: string
          preferred_interface_language: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          industry_context?:
            | Database["public"]["Enums"]["industry_context"]
            | null
          name: string
          preferred_interface_language?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          industry_context?:
            | Database["public"]["Enums"]["industry_context"]
            | null
          name?: string
          preferred_interface_language?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          correct_answer: string
          created_at: string
          id: string
          incorrect_answers: string[] | null
          lesson_id: string
          order_in_lesson: number | null
          question_extra: string | null
          question_text: string
          type: Database["public"]["Enums"]["task_type"] | null
          vocabulary_id: string | null
        }
        Insert: {
          correct_answer: string
          created_at?: string
          id?: string
          incorrect_answers?: string[] | null
          lesson_id: string
          order_in_lesson?: number | null
          question_extra?: string | null
          question_text: string
          type?: Database["public"]["Enums"]["task_type"] | null
          vocabulary_id?: string | null
        }
        Update: {
          correct_answer?: string
          created_at?: string
          id?: string
          incorrect_answers?: string[] | null
          lesson_id?: string
          order_in_lesson?: number | null
          question_extra?: string | null
          question_text?: string
          type?: Database["public"]["Enums"]["task_type"] | null
          vocabulary_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_vocabulary_id_fkey"
            columns: ["vocabulary_id"]
            isOneToOne: false
            referencedRelation: "vocabulary_items"
            referencedColumns: ["id"]
          },
        ]
      }
      user_daily_stats: {
        Row: {
          created_at: string
          date: string
          goal_met: boolean | null
          id: string
          lessons_completed: number | null
          user_id: string
          xp_earned: number | null
        }
        Insert: {
          created_at?: string
          date?: string
          goal_met?: boolean | null
          id?: string
          lessons_completed?: number | null
          user_id: string
          xp_earned?: number | null
        }
        Update: {
          created_at?: string
          date?: string
          goal_met?: boolean | null
          id?: string
          lessons_completed?: number | null
          user_id?: string
          xp_earned?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_vocabulary: {
        Row: {
          added_manually: boolean | null
          created_at: string
          id: string
          last_seen_at: string | null
          strength: number | null
          user_id: string
          vocabulary_id: string
        }
        Insert: {
          added_manually?: boolean | null
          created_at?: string
          id?: string
          last_seen_at?: string | null
          strength?: number | null
          user_id: string
          vocabulary_id: string
        }
        Update: {
          added_manually?: boolean | null
          created_at?: string
          id?: string
          last_seen_at?: string | null
          strength?: number | null
          user_id?: string
          vocabulary_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_vocabulary_vocabulary_id_fkey"
            columns: ["vocabulary_id"]
            isOneToOne: false
            referencedRelation: "vocabulary_items"
            referencedColumns: ["id"]
          },
        ]
      }
      vocabulary_items: {
        Row: {
          audio_url: string | null
          created_at: string
          english_word_or_phrase: string
          example_sentence: string | null
          id: string
          industry_tag: Database["public"]["Enums"]["industry_context"] | null
          translation: string
        }
        Insert: {
          audio_url?: string | null
          created_at?: string
          english_word_or_phrase: string
          example_sentence?: string | null
          id?: string
          industry_tag?: Database["public"]["Enums"]["industry_context"] | null
          translation: string
        }
        Update: {
          audio_url?: string | null
          created_at?: string
          english_word_or_phrase?: string
          example_sentence?: string | null
          id?: string
          industry_tag?: Database["public"]["Enums"]["industry_context"] | null
          translation?: string
        }
        Relationships: []
      }
    }
    Views: {
      tasks_secure: {
        Row: {
          created_at: string | null
          id: string | null
          incorrect_answers: string[] | null
          lesson_id: string | null
          order_in_lesson: number | null
          question_extra: string | null
          question_text: string | null
          type: Database["public"]["Enums"]["task_type"] | null
          vocabulary_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string | null
          incorrect_answers?: string[] | null
          lesson_id?: string | null
          order_in_lesson?: number | null
          question_extra?: string | null
          question_text?: string | null
          type?: Database["public"]["Enums"]["task_type"] | null
          vocabulary_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string | null
          incorrect_answers?: string[] | null
          lesson_id?: string | null
          order_in_lesson?: number | null
          question_extra?: string | null
          question_text?: string | null
          type?: Database["public"]["Enums"]["task_type"] | null
          vocabulary_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tasks_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_vocabulary_id_fkey"
            columns: ["vocabulary_id"]
            isOneToOne: false
            referencedRelation: "vocabulary_items"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      check_task_answer: {
        Args: { p_task_id: string; p_user_answer: string }
        Returns: Json
      }
      get_task_options: { Args: { p_task_id: string }; Returns: string[] }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      industry_context: "it" | "finance" | "office" | "general"
      level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
      task_type: "FLASHCARD" | "MULTIPLE_CHOICE" | "GAP_FILL"
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
    Enums: {
      app_role: ["admin", "moderator", "user"],
      industry_context: ["it", "finance", "office", "general"],
      level: ["A1", "A2", "B1", "B2", "C1", "C2"],
      task_type: ["FLASHCARD", "MULTIPLE_CHOICE", "GAP_FILL"],
    },
  },
} as const
