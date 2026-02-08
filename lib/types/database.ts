// Database type definitions for Snow Wolf Event Registration System

export interface CharacterRole {
  id: string;                    // Unique identifier (e.g., "aileen", "litt")
  name_zh: string;               // Chinese name (e.g., "艾琳")
  name_en: string;               // English name (e.g., "Aileen")
  image_url: string;             // Path to character image (e.g., "/full/aileen-full.png")
  capacity: number;              // Maximum slots for this role (default: 4, range: 1-15)
  description_zh?: string;       // Optional character description in Chinese
  description_en?: string;       // Optional character description in English
}

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  language_preference: 'zh' | 'en';
  role: 'parent' | 'owner' | 'assistant' | 'teacher';
  created_at: string;
  updated_at: string;
}

export interface Child {
  id: string;
  parent_id: string;
  name: string;
  age: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: string;
  title_zh: string;
  title_en: string;
  theme_zh: string;
  theme_en: string;
  story_zh?: string;
  story_en?: string;
  description_zh: string | null;
  description_en: string | null;
  venue_zh?: string;             // Venue location in Chinese
  venue_en?: string;             // Venue location in English
  date: string;
  day_of_week?: string; // e.g., "日", "一", "二", etc.
  time: string;
  duration_minutes: number;
  capacity: number;
  hidden_buffer: number;
  price: number;
  age_min: number | null;
  age_max: number | null;
  image_url: string | null;
  video_url?: string | null;
  status: 'active' | 'cancelled' | 'completed';
  roles?: CharacterRole[];       // Optional array of available character roles (1-15 roles)
  current_registrations?: number; // Current number of registrations (for unlock rewards)
  addon_registrations?: Record<string, number>; // Track addon usage per session (addonId -> count)
  tags?: string[];               // Optional tags for the session (e.g., "#原著故事重現", "#金鐘最佳音效師")
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  parent_id: string;
  status:
    | 'pending_payment'
    | 'payment_submitted'
    | 'confirmed'
    | 'cancelled_timeout'
    | 'cancelled_manual';
  total_amount: number;
  discount_amount: number;
  final_amount: number;
  group_code: string | null;
  payment_method: 'bank_transfer' | 'line_pay' | null;
  payment_proof_url: string | null;
  payment_deadline: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  session_id: string;
  child_id: string;
  price: number;
  discount_amount: number;       // Discount applied to this item
  role_id?: string | null;       // Optional role assignment (references CharacterRole.id)
  is_addon?: boolean;            // True if this is an addon purchase
  created_at: string;
}

export interface Addon {
  id: string;
  name_zh: string;
  name_en: string;
  description_zh: string;
  description_en: string;
  price: number;
  duration_minutes: number;
  max_per_session: number;       // Maximum addons per session (e.g., 4)
}

export interface WaitlistEntry {
  id: string;
  session_id: string;
  parent_id: string;
  child_id: string;
  status: 'waiting' | 'offered' | 'claimed' | 'expired';
  offered_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface AdminAction {
  id: string;
  admin_id: string;
  action_type: string;
  target_type: string;
  target_id: string;
  reason: string | null;
  metadata: Record<string, any> | null;
  created_at: string;
}
