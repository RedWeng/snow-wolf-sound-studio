/**
 * Supabase Database Types
 * 
 * 自動生成的資料庫型別定義
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      sessions: {
        Row: {
          id: string
          title_zh: string
          title_en: string
          theme_zh: string
          theme_en: string
          story_zh: string | null
          story_en: string | null
          description_zh: string | null
          description_en: string | null
          venue_zh: string
          venue_en: string
          date: string
          day_of_week: string
          time: string
          duration_minutes: number
          capacity: number
          hidden_buffer: number
          price: number
          age_min: number | null
          age_max: number | null
          image_url: string | null
          video_url: string | null
          status: 'active' | 'completed' | 'cancelled'
          current_registrations: number
          tags: string[] | null
          created_at: string
          updated_at: string
          created_by: string | null
          updated_by: string | null
        }
        Insert: {
          id?: string
          title_zh: string
          title_en: string
          theme_zh: string
          theme_en: string
          story_zh?: string | null
          story_en?: string | null
          description_zh?: string | null
          description_en?: string | null
          venue_zh: string
          venue_en: string
          date: string
          day_of_week: string
          time: string
          duration_minutes: number
          capacity: number
          hidden_buffer?: number
          price: number
          age_min?: number | null
          age_max?: number | null
          image_url?: string | null
          video_url?: string | null
          status?: 'active' | 'completed' | 'cancelled'
          current_registrations?: number
          tags?: string[] | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
        Update: {
          id?: string
          title_zh?: string
          title_en?: string
          theme_zh?: string
          theme_en?: string
          story_zh?: string | null
          story_en?: string | null
          description_zh?: string | null
          description_en?: string | null
          venue_zh?: string
          venue_en?: string
          date?: string
          day_of_week?: string
          time?: string
          duration_minutes?: number
          capacity?: number
          hidden_buffer?: number
          price?: number
          age_min?: number | null
          age_max?: number | null
          image_url?: string | null
          video_url?: string | null
          status?: 'active' | 'completed' | 'cancelled'
          current_registrations?: number
          tags?: string[] | null
          created_at?: string
          updated_at?: string
          created_by?: string | null
          updated_by?: string | null
        }
      }
      session_roles: {
        Row: {
          id: string
          session_id: string
          role_id: string
          name_zh: string
          name_en: string
          image_url: string | null
          capacity: number
          description_zh: string | null
          description_en: string | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          role_id: string
          name_zh: string
          name_en: string
          image_url?: string | null
          capacity: number
          description_zh?: string | null
          description_en?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          role_id?: string
          name_zh?: string
          name_en?: string
          image_url?: string | null
          capacity?: number
          description_zh?: string | null
          description_en?: string | null
          created_at?: string
        }
      }
      session_addon_registrations: {
        Row: {
          id: string
          session_id: string
          addon_id: string
          count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          session_id: string
          addon_id: string
          count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          session_id?: string
          addon_id?: string
          count?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
