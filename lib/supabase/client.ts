/**
 * Supabase Client - Browser
 * 
 * 用於瀏覽器端的 Supabase 客戶端
 */

import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// 建立 Supabase 客戶端（如果沒有設定環境變數，會建立一個 placeholder 客戶端）
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
