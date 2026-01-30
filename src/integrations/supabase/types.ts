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
      actor_submissions: {
        Row: {
          birth_year: number
          created_at: string
          email: string
          full_name: string
          gender: string
          id: string
          image_url: string | null
          is_course_graduate: boolean | null
          is_singer: boolean | null
          languages: string[]
          languages_other: string | null
          match_status: string
          matched_actor_id: string | null
          merge_report: Json | null
          normalized_email: string
          normalized_phone: string
          notes: string | null
          phone: string
          raw_payload: Json
          review_status: string
          skills: string[] | null
          skills_other: string | null
          vat_status: string
          voice_sample_url: string | null
        }
        Insert: {
          birth_year: number
          created_at?: string
          email: string
          full_name: string
          gender: string
          id?: string
          image_url?: string | null
          is_course_graduate?: boolean | null
          is_singer?: boolean | null
          languages: string[]
          languages_other?: string | null
          match_status?: string
          matched_actor_id?: string | null
          merge_report?: Json | null
          normalized_email: string
          normalized_phone: string
          notes?: string | null
          phone: string
          raw_payload: Json
          review_status?: string
          skills?: string[] | null
          skills_other?: string | null
          vat_status: string
          voice_sample_url?: string | null
        }
        Update: {
          birth_year?: number
          created_at?: string
          email?: string
          full_name?: string
          gender?: string
          id?: string
          image_url?: string | null
          is_course_graduate?: boolean | null
          is_singer?: boolean | null
          languages?: string[]
          languages_other?: string | null
          match_status?: string
          matched_actor_id?: string | null
          merge_report?: Json | null
          normalized_email?: string
          normalized_phone?: string
          notes?: string | null
          phone?: string
          raw_payload?: Json
          review_status?: string
          skills?: string[] | null
          skills_other?: string | null
          vat_status?: string
          voice_sample_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "actor_submissions_matched_actor_id_fkey"
            columns: ["matched_actor_id"]
            isOneToOne: false
            referencedRelation: "actors"
            referencedColumns: ["id"]
          },
        ]
      }
      actors: {
        Row: {
          birth_year: number
          city: string | null
          created_at: string | null
          dubbing_experience_years: number | null
          email: string | null
          full_name: string
          gender: string
          id: string
          image_url: string | null
          is_course_grad: boolean | null
          is_singer: boolean | null
          languages: Json | null
          notes: string | null
          other_lang_text: string | null
          phone: string
          singing_styles: Json | null
          singing_styles_other: Json | null
          skills: Json | null
          updated_at: string | null
          vat_status: string
          voice_sample_url: string | null
        }
        Insert: {
          birth_year: number
          city?: string | null
          created_at?: string | null
          dubbing_experience_years?: number | null
          email?: string | null
          full_name: string
          gender: string
          id?: string
          image_url?: string | null
          is_course_grad?: boolean | null
          is_singer?: boolean | null
          languages?: Json | null
          notes?: string | null
          other_lang_text?: string | null
          phone: string
          singing_styles?: Json | null
          singing_styles_other?: Json | null
          skills?: Json | null
          updated_at?: string | null
          vat_status: string
          voice_sample_url?: string | null
        }
        Update: {
          birth_year?: number
          city?: string | null
          created_at?: string | null
          dubbing_experience_years?: number | null
          email?: string | null
          full_name?: string
          gender?: string
          id?: string
          image_url?: string | null
          is_course_grad?: boolean | null
          is_singer?: boolean | null
          languages?: Json | null
          notes?: string | null
          other_lang_text?: string | null
          phone?: string
          singing_styles?: Json | null
          singing_styles_other?: Json | null
          skills?: Json | null
          updated_at?: string | null
          vat_status?: string
          voice_sample_url?: string | null
        }
        Relationships: []
      }
      casting_projects: {
        Row: {
          casting_director: string | null
          created_at: string | null
          director: string | null
          id: string
          name: string
          notes: string | null
          project_date: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          casting_director?: string | null
          created_at?: string | null
          director?: string | null
          id?: string
          name: string
          notes?: string | null
          project_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          casting_director?: string | null
          created_at?: string | null
          director?: string | null
          id?: string
          name?: string
          notes?: string | null
          project_date?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          actor_id: string | null
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          actor_id?: string | null
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          actor_id?: string | null
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "actors"
            referencedColumns: ["id"]
          },
        ]
      }
      folder_actors: {
        Row: {
          actor_id: string | null
          created_at: string | null
          folder_id: string | null
          id: string
        }
        Insert: {
          actor_id?: string | null
          created_at?: string | null
          folder_id?: string | null
          id?: string
        }
        Update: {
          actor_id?: string | null
          created_at?: string | null
          folder_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "folder_actors_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "actors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "folder_actors_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["id"]
          },
        ]
      }
      folders: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      project_actors: {
        Row: {
          actor_id: string | null
          created_at: string | null
          id: string
          notes: string | null
          project_id: string | null
          replicas_final: number | null
          replicas_planned: number | null
          role_id: string
          role_name: string
        }
        Insert: {
          actor_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          project_id?: string | null
          replicas_final?: number | null
          replicas_planned?: number | null
          role_id: string
          role_name: string
        }
        Update: {
          actor_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          project_id?: string | null
          replicas_final?: number | null
          replicas_planned?: number | null
          role_id?: string
          role_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_actors_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "actors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_actors_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "casting_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_actors_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "project_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      project_roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          project_id: string
          replicas_needed: number | null
          role_name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          project_id: string
          replicas_needed?: number | null
          role_name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          project_id?: string
          replicas_needed?: number | null
          role_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_roles_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "casting_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_scripts: {
        Row: {
          created_at: string | null
          file_name: string
          file_size_bytes: number | null
          file_type: string | null
          file_url: string | null
          id: string
          processed_at: string | null
          processing_error: string | null
          processing_status: string
          project_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_size_bytes?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          processed_at?: string | null
          processing_error?: string | null
          processing_status?: string
          project_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_size_bytes?: number | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          processed_at?: string | null
          processing_error?: string | null
          processing_status?: string
          project_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_scripts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "casting_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      script_casting_warnings: {
        Row: {
          created_at: string | null
          id: string
          notes: string | null
          project_id: string
          role_1_name: string
          role_2_name: string
          scene_reference: string | null
          warning_type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          notes?: string | null
          project_id: string
          role_1_name: string
          role_2_name: string
          scene_reference?: string | null
          warning_type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          notes?: string | null
          project_id?: string
          role_1_name?: string
          role_2_name?: string
          scene_reference?: string | null
          warning_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "script_casting_warnings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "casting_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      script_extracted_roles: {
        Row: {
          created_at: string | null
          first_appearance_script: string | null
          id: string
          notes: string | null
          project_id: string
          replicas_count: number | null
          role_name: string
          role_type: string | null
          script_id: string | null
        }
        Insert: {
          created_at?: string | null
          first_appearance_script?: string | null
          id?: string
          notes?: string | null
          project_id: string
          replicas_count?: number | null
          role_name: string
          role_type?: string | null
          script_id?: string | null
        }
        Update: {
          created_at?: string | null
          first_appearance_script?: string | null
          id?: string
          notes?: string | null
          project_id?: string
          replicas_count?: number | null
          role_name?: string
          role_type?: string | null
          script_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "script_extracted_roles_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "casting_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "script_extracted_roles_script_id_fkey"
            columns: ["script_id"]
            isOneToOne: false
            referencedRelation: "project_scripts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          role: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id: string
          role: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          role?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
