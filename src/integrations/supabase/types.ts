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
      _migrations: {
        Row: {
          applied_at: string
          filename: string
        }
        Insert: {
          applied_at?: string
          filename: string
        }
        Update: {
          applied_at?: string
          filename?: string
        }
        Relationships: []
      }
      actor_submissions: {
        Row: {
          accents: Json | null
          birth_year: number
          created_at: string
          deleted_at: string | null
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
          singing_level: string | null
          singing_sample_url: string | null
          singing_styles: Json | null
          skills: string[] | null
          skills_other: string | null
          vat_status: string
          voice_sample_url: string | null
          youtube_link: string | null
        }
        Insert: {
          accents?: Json | null
          birth_year: number
          created_at?: string
          deleted_at?: string | null
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
          singing_level?: string | null
          singing_sample_url?: string | null
          singing_styles?: Json | null
          skills?: string[] | null
          skills_other?: string | null
          vat_status: string
          voice_sample_url?: string | null
          youtube_link?: string | null
        }
        Update: {
          accents?: Json | null
          birth_year?: number
          created_at?: string
          deleted_at?: string | null
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
          singing_level?: string | null
          singing_sample_url?: string | null
          singing_styles?: Json | null
          skills?: string[] | null
          skills_other?: string | null
          vat_status?: string
          voice_sample_url?: string | null
          youtube_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "actor_submissions_matched_actor_id_fkey"
            columns: ["matched_actor_id"]
            isOneToOne: false
            referencedRelation: "actor_project_summary"
            referencedColumns: ["actor_id"]
          },
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
          accents: Json | null
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
          is_draft: boolean | null
          is_singer: boolean | null
          languages: Json | null
          notes: string | null
          other_lang_text: string | null
          phone: string
          singing_level: string | null
          singing_sample_url: string | null
          singing_styles: Json | null
          singing_styles_other: Json | null
          skills: Json | null
          updated_at: string | null
          vat_status: string
          voice_sample_url: string | null
          youtube_link: string | null
        }
        Insert: {
          accents?: Json | null
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
          is_draft?: boolean | null
          is_singer?: boolean | null
          languages?: Json | null
          notes?: string | null
          other_lang_text?: string | null
          phone: string
          singing_level?: string | null
          singing_sample_url?: string | null
          singing_styles?: Json | null
          singing_styles_other?: Json | null
          skills?: Json | null
          updated_at?: string | null
          vat_status: string
          voice_sample_url?: string | null
          youtube_link?: string | null
        }
        Update: {
          accents?: Json | null
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
          is_draft?: boolean | null
          is_singer?: boolean | null
          languages?: Json | null
          notes?: string | null
          other_lang_text?: string | null
          phone?: string
          singing_level?: string | null
          singing_sample_url?: string | null
          singing_styles?: Json | null
          singing_styles_other?: Json | null
          skills?: Json | null
          updated_at?: string | null
          vat_status?: string
          voice_sample_url?: string | null
          youtube_link?: string | null
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
            referencedRelation: "actor_project_summary"
            referencedColumns: ["actor_id"]
          },
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
            referencedRelation: "actor_project_summary"
            referencedColumns: ["actor_id"]
          },
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
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
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
            referencedRelation: "actor_project_summary"
            referencedColumns: ["actor_id"]
          },
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
            foreignKeyName: "project_actors_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_actors_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "project_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_actors_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "role_casting_flat"
            referencedColumns: ["role_id"]
          },
        ]
      }
      project_roles: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          parent_role_id: string | null
          project_id: string
          replicas_count: number | null
          replicas_needed: number | null
          role_name: string
          role_name_normalized: string | null
          source: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          parent_role_id?: string | null
          project_id: string
          replicas_count?: number | null
          replicas_needed?: number | null
          role_name: string
          role_name_normalized?: string | null
          source?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          parent_role_id?: string | null
          project_id?: string
          replicas_count?: number | null
          replicas_needed?: number | null
          role_name?: string
          role_name_normalized?: string | null
          source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_roles_parent_role_id_fkey"
            columns: ["parent_role_id"]
            isOneToOne: false
            referencedRelation: "project_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_roles_parent_role_id_fkey"
            columns: ["parent_role_id"]
            isOneToOne: false
            referencedRelation: "role_casting_flat"
            referencedColumns: ["role_id"]
          },
          {
            foreignKeyName: "project_roles_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "casting_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_roles_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      project_scripts: {
        Row: {
          applied_at: string | null
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
          applied_at?: string | null
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
          applied_at?: string | null
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
          {
            foreignKeyName: "project_scripts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      role_castings: {
        Row: {
          actor_id: string | null
          created_at: string | null
          id: string
          notes: string | null
          project_id: string | null
          replicas_final: number | null
          replicas_planned: number | null
          role_id: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          actor_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          project_id?: string | null
          replicas_final?: number | null
          replicas_planned?: number | null
          role_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          actor_id?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          project_id?: string | null
          replicas_final?: number | null
          replicas_planned?: number | null
          role_id?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "role_castings_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "actor_project_summary"
            referencedColumns: ["actor_id"]
          },
          {
            foreignKeyName: "role_castings_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "actors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_castings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "casting_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_castings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_castings_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "project_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_castings_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "role_casting_flat"
            referencedColumns: ["role_id"]
          },
        ]
      }
      role_conflicts: {
        Row: {
          created_at: string | null
          evidence_json: Json | null
          id: string
          project_id: string | null
          role_id_a: string | null
          role_id_b: string | null
          scene_reference: string | null
          warning_type: string
        }
        Insert: {
          created_at?: string | null
          evidence_json?: Json | null
          id?: string
          project_id?: string | null
          role_id_a?: string | null
          role_id_b?: string | null
          scene_reference?: string | null
          warning_type: string
        }
        Update: {
          created_at?: string | null
          evidence_json?: Json | null
          id?: string
          project_id?: string | null
          role_id_a?: string | null
          role_id_b?: string | null
          scene_reference?: string | null
          warning_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_conflicts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "casting_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_conflicts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_conflicts_role_id_a_fkey"
            columns: ["role_id_a"]
            isOneToOne: false
            referencedRelation: "project_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_conflicts_role_id_a_fkey"
            columns: ["role_id_a"]
            isOneToOne: false
            referencedRelation: "role_casting_flat"
            referencedColumns: ["role_id"]
          },
          {
            foreignKeyName: "role_conflicts_role_id_b_fkey"
            columns: ["role_id_b"]
            isOneToOne: false
            referencedRelation: "project_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_conflicts_role_id_b_fkey"
            columns: ["role_id_b"]
            isOneToOne: false
            referencedRelation: "role_casting_flat"
            referencedColumns: ["role_id"]
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
          {
            foreignKeyName: "script_casting_warnings_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_summary"
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
            foreignKeyName: "script_extracted_roles_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_summary"
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
      script_imports: {
        Row: {
          applied_at: string | null
          apply_summary: Json | null
          created_at: string
          draft_json: Json | null
          error_message: string | null
          id: string
          model_used: string | null
          project_id: string
          prompt_version: string | null
          raw_text: string | null
          reviewed_by: string | null
          source_filename: string
          source_type: string
          status: string
          tokens_used: number | null
          updated_at: string
        }
        Insert: {
          applied_at?: string | null
          apply_summary?: Json | null
          created_at?: string
          draft_json?: Json | null
          error_message?: string | null
          id?: string
          model_used?: string | null
          project_id: string
          prompt_version?: string | null
          raw_text?: string | null
          reviewed_by?: string | null
          source_filename: string
          source_type: string
          status?: string
          tokens_used?: number | null
          updated_at?: string
        }
        Update: {
          applied_at?: string | null
          apply_summary?: Json | null
          created_at?: string
          draft_json?: Json | null
          error_message?: string | null
          id?: string
          model_used?: string | null
          project_id?: string
          prompt_version?: string | null
          raw_text?: string | null
          reviewed_by?: string | null
          source_filename?: string
          source_type?: string
          status?: string
          tokens_used?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "script_imports_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "casting_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "script_imports_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_summary"
            referencedColumns: ["id"]
          },
        ]
      }
      script_lines: {
        Row: {
          actor_id: string | null
          created_at: string | null
          id: string
          line_number: number | null
          notes: string | null
          project_id: string
          rec_status: string | null
          role_id: string | null
          role_match_status: string | null
          role_name: string
          script_id: string | null
          source_text: string | null
          timecode: string | null
          translation: string | null
        }
        Insert: {
          actor_id?: string | null
          created_at?: string | null
          id?: string
          line_number?: number | null
          notes?: string | null
          project_id: string
          rec_status?: string | null
          role_id?: string | null
          role_match_status?: string | null
          role_name: string
          script_id?: string | null
          source_text?: string | null
          timecode?: string | null
          translation?: string | null
        }
        Update: {
          actor_id?: string | null
          created_at?: string | null
          id?: string
          line_number?: number | null
          notes?: string | null
          project_id?: string
          rec_status?: string | null
          role_id?: string | null
          role_match_status?: string | null
          role_name?: string
          script_id?: string | null
          source_text?: string | null
          timecode?: string | null
          translation?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "script_lines_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "actor_project_summary"
            referencedColumns: ["actor_id"]
          },
          {
            foreignKeyName: "script_lines_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "actors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "script_lines_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "casting_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "script_lines_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "script_lines_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "project_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "script_lines_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "role_casting_flat"
            referencedColumns: ["role_id"]
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
      actor_project_summary: {
        Row: {
          actor_id: string | null
          casted_roles_count: number | null
          full_name: string | null
          gender: string | null
          image_url: string | null
          projects_count: number | null
          total_castings: number | null
          total_replicas: number | null
        }
        Relationships: []
      }
      project_summary: {
        Row: {
          actors_cast: number | null
          casted_count: number | null
          casting_director: string | null
          castings_count: number | null
          created_at: string | null
          director: string | null
          id: string | null
          main_roles_count: number | null
          name: string | null
          notes: string | null
          project_date: string | null
          recorded_lines: number | null
          roles_count: number | null
          scripts_count: number | null
          status: string | null
          total_lines: number | null
          unique_actors_count: number | null
          updated_at: string | null
        }
        Relationships: []
      }
      role_casting_flat: {
        Row: {
          actor_full_name: string | null
          actor_gender: string | null
          actor_id: string | null
          actor_image_url: string | null
          actor_voice_sample_url: string | null
          casting_id: string | null
          casting_notes: string | null
          casting_status: string | null
          description: string | null
          parent_role_id: string | null
          project_id: string | null
          replicas_count: number | null
          replicas_final: number | null
          replicas_needed: number | null
          replicas_planned: number | null
          role_created_at: string | null
          role_id: string | null
          role_name: string | null
          role_name_normalized: string | null
          source: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_roles_parent_role_id_fkey"
            columns: ["parent_role_id"]
            isOneToOne: false
            referencedRelation: "project_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_roles_parent_role_id_fkey"
            columns: ["parent_role_id"]
            isOneToOne: false
            referencedRelation: "role_casting_flat"
            referencedColumns: ["role_id"]
          },
          {
            foreignKeyName: "project_roles_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "casting_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_roles_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "project_summary"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_castings_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "actor_project_summary"
            referencedColumns: ["actor_id"]
          },
          {
            foreignKeyName: "role_castings_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "actors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
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
