/**
 * Sessions Database Access Layer
 * 
 * 提供課程資料的 CRUD 操作
 */

import { supabase } from '../supabase/client';
import type { Database } from '../supabase/types';
import type { Session } from '../types/database';

type DbSession = Database['public']['Tables']['sessions']['Row'];
type DbSessionInsert = Database['public']['Tables']['sessions']['Insert'];
type DbSessionRole = Database['public']['Tables']['session_roles']['Row'];
type DbAddonRegistration = Database['public']['Tables']['session_addon_registrations']['Row'];

/**
 * 將資料庫格式轉換為應用程式格式
 */
function dbSessionToSession(dbSession: DbSession, roles?: DbSessionRole[], addonRegs?: DbAddonRegistration[]): Session {
  // 轉換 addon_registrations 格式
  const addon_registrations: Record<string, number> = {};
  if (addonRegs) {
    addonRegs.forEach(reg => {
      addon_registrations[reg.addon_id] = reg.count;
    });
  }

  // 轉換 roles 格式
  const sessionRoles = roles?.map(role => ({
    id: role.role_id,
    name_zh: role.name_zh,
    name_en: role.name_en,
    image_url: role.image_url || '',
    capacity: role.capacity,
    description_zh: role.description_zh || '',
    description_en: role.description_en || '',
  }));

  return {
    id: dbSession.id,
    title_zh: dbSession.title_zh,
    title_en: dbSession.title_en,
    theme_zh: dbSession.theme_zh,
    theme_en: dbSession.theme_en,
    story_zh: dbSession.story_zh || '',
    story_en: dbSession.story_en || '',
    description_zh: dbSession.description_zh || '',
    description_en: dbSession.description_en || '',
    venue_zh: dbSession.venue_zh,
    venue_en: dbSession.venue_en,
    date: dbSession.date,
    day_of_week: dbSession.day_of_week,
    time: dbSession.time,
    duration_minutes: dbSession.duration_minutes,
    capacity: dbSession.capacity,
    hidden_buffer: dbSession.hidden_buffer,
    price: dbSession.price,
    age_min: dbSession.age_min,
    age_max: dbSession.age_max,
    image_url: dbSession.image_url || '',
    video_url: dbSession.video_url || '',
    status: dbSession.status,
    current_registrations: dbSession.current_registrations,
    addon_registrations,
    tags: dbSession.tags || [],
    roles: sessionRoles,
    created_at: dbSession.created_at,
    updated_at: dbSession.updated_at,
  };
}

/**
 * 取得所有課程
 */
export async function getAllSessions(options?: {
  status?: 'active' | 'completed' | 'cancelled' | 'all';
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
}) {
  let query = supabase
    .from('sessions')
    .select(`
      *,
      session_roles(*),
      session_addon_registrations(*)
    `)
    .order('date', { ascending: true });

  // 篩選狀態
  if (options?.status && options.status !== 'all') {
    query = query.eq('status', options.status);
  }

  // 搜尋
  if (options?.search) {
    query = query.or(`title_zh.ilike.%${options.search}%,title_en.ilike.%${options.search}%,theme_zh.ilike.%${options.search}%,theme_en.ilike.%${options.search}%`);
  }

  // 日期範圍
  if (options?.dateFrom) {
    query = query.gte('date', options.dateFrom);
  }
  if (options?.dateTo) {
    query = query.lte('date', options.dateTo);
  }

  // 分頁
  const page = options?.page || 1;
  const limit = options?.limit || 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching sessions:', error);
    throw new Error(`Failed to fetch sessions: ${error.message}`);
  }

  const sessions = data?.map((session: any) => 
    dbSessionToSession(session, session.session_roles, session.session_addon_registrations)
  ) || [];

  return {
    sessions,
    total: count || 0,
    page,
    limit,
  };
}

/**
 * 取得單一課程
 */
export async function getSessionById(id: string) {
  const { data, error } = await supabase
    .from('sessions')
    .select(`
      *,
      session_roles(*),
      session_addon_registrations(*)
    `)
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching session:', error);
    throw new Error(`Failed to fetch session: ${error.message}`);
  }

  if (!data) {
    throw new Error('Session not found');
  }

  return dbSessionToSession(data as any, (data as any).session_roles, (data as any).session_addon_registrations);
}

/**
 * 新增課程
 */
export async function createSession(sessionData: Omit<Session, 'id' | 'created_at' | 'updated_at'>) {
  const { roles, addon_registrations, ...sessionFields } = sessionData;

  // 準備插入資料，確保必填欄位存在
  const insertData: DbSessionInsert = {
    title_zh: sessionFields.title_zh,
    title_en: sessionFields.title_en,
    theme_zh: sessionFields.theme_zh,
    theme_en: sessionFields.theme_en,
    venue_zh: sessionFields.venue_zh || '',
    venue_en: sessionFields.venue_en || '',
    date: sessionFields.date,
    day_of_week: sessionFields.day_of_week || '',
    time: sessionFields.time,
    duration_minutes: sessionFields.duration_minutes,
    capacity: sessionFields.capacity,
    hidden_buffer: sessionFields.hidden_buffer,
    price: sessionFields.price,
    story_zh: sessionFields.story_zh || null,
    story_en: sessionFields.story_en || null,
    description_zh: sessionFields.description_zh || null,
    description_en: sessionFields.description_en || null,
    age_min: sessionFields.age_min || null,
    age_max: sessionFields.age_max || null,
    image_url: sessionFields.image_url || null,
    video_url: sessionFields.video_url || null,
    status: sessionFields.status || 'active',
    current_registrations: sessionFields.current_registrations || 0,
    tags: sessionFields.tags || [],
  };

  // 插入課程
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .insert(insertData as any)
    .select()
    .single();

  if (sessionError) {
    console.error('Error creating session:', sessionError);
    throw new Error(`Failed to create session: ${sessionError.message}`);
  }

  if (!session) {
    throw new Error('Failed to create session: No data returned');
  }

  // 插入角色
  if (roles && roles.length > 0) {
    const rolesData = roles.map(role => ({
      session_id: (session as DbSession).id,
      role_id: role.id,
      name_zh: role.name_zh,
      name_en: role.name_en,
      image_url: role.image_url,
      capacity: role.capacity,
      description_zh: role.description_zh,
      description_en: role.description_en,
    }));

    const { error: rolesError } = await supabase
      .from('session_roles')
      .insert(rolesData as any);

    if (rolesError) {
      console.error('Error creating session roles:', rolesError);
      // 回滾：刪除已建立的課程
      await supabase.from('sessions').delete().eq('id', (session as DbSession).id);
      throw new Error(`Failed to create session roles: ${rolesError.message}`);
    }
  }

  // 插入加購項目報名數
  if (addon_registrations && Object.keys(addon_registrations).length > 0) {
    const addonsData = Object.entries(addon_registrations).map(([addon_id, count]) => ({
      session_id: (session as DbSession).id,
      addon_id,
      count,
    }));

    const { error: addonsError } = await supabase
      .from('session_addon_registrations')
      .insert(addonsData as any);

    if (addonsError) {
      console.error('Error creating addon registrations:', addonsError);
      // 不回滾，因為這不是關鍵資料
    }
  }

  return await getSessionById((session as DbSession).id);
}

/**
 * 更新課程
 */
export async function updateSession(id: string, sessionData: Partial<Omit<Session, 'id' | 'created_at' | 'updated_at'>>) {
  const { roles, addon_registrations, ...sessionFields } = sessionData;

  // 更新課程
  const { error: sessionError } = await supabase
    .from('sessions')
    .update(sessionFields as any)
    .eq('id', id);

  if (sessionError) {
    console.error('Error updating session:', sessionError);
    throw new Error(`Failed to update session: ${sessionError.message}`);
  }

  // 更新角色（先刪除舊的，再插入新的）
  if (roles !== undefined) {
    // 刪除舊角色
    await supabase
      .from('session_roles')
      .delete()
      .eq('session_id', id);

    // 插入新角色
    if (roles.length > 0) {
      const rolesData = roles.map(role => ({
        session_id: id,
        role_id: role.id,
        name_zh: role.name_zh,
        name_en: role.name_en,
        image_url: role.image_url,
        capacity: role.capacity,
        description_zh: role.description_zh,
        description_en: role.description_en,
      }));

      const { error: rolesError } = await supabase
        .from('session_roles')
        .insert(rolesData as any);

      if (rolesError) {
        console.error('Error updating session roles:', rolesError);
        throw new Error(`Failed to update session roles: ${rolesError.message}`);
      }
    }
  }

  // 更新加購項目報名數
  if (addon_registrations !== undefined) {
    // 刪除舊的
    await supabase
      .from('session_addon_registrations')
      .delete()
      .eq('session_id', id);

    // 插入新的
    if (Object.keys(addon_registrations).length > 0) {
      const addonsData = Object.entries(addon_registrations).map(([addon_id, count]) => ({
        session_id: id,
        addon_id,
        count,
      }));

      const { error: addonsError } = await supabase
        .from('session_addon_registrations')
        .insert(addonsData as any);

      if (addonsError) {
        console.error('Error updating addon registrations:', addonsError);
      }
    }
  }

  return await getSessionById(id);
}

/**
 * 刪除課程
 */
export async function deleteSession(id: string) {
  // 檢查是否有報名記錄
  const session = await getSessionById(id);
  if (session.current_registrations && session.current_registrations > 0) {
    throw new Error('Cannot delete session with existing registrations');
  }

  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting session:', error);
    throw new Error(`Failed to delete session: ${error.message}`);
  }

  return { success: true };
}

/**
 * 複製課程
 */
export async function duplicateSession(id: string, options?: {
  date?: string;
  time?: string;
  title_suffix?: string;
}) {
  const originalSession = await getSessionById(id);

  // 建立新課程資料
  const newSessionData: Omit<Session, 'id' | 'created_at' | 'updated_at'> = {
    ...originalSession,
    date: options?.date || originalSession.date,
    time: options?.time || originalSession.time,
    title_zh: options?.title_suffix 
      ? `${originalSession.title_zh} ${options.title_suffix}`
      : originalSession.title_zh,
    title_en: options?.title_suffix 
      ? `${originalSession.title_en} ${options.title_suffix}`
      : originalSession.title_en,
    current_registrations: 0, // 重置報名人數
    addon_registrations: {}, // 重置加購項目
  };

  return await createSession(newSessionData);
}
