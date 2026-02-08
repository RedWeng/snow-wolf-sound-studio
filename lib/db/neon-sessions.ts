/**
 * Sessions Database Access Layer - Neon Version
 * 
 * 使用標準 PostgreSQL 查詢（適用於 Neon）
 */

import { pool } from '../neon/client';
import type { Session } from '../types/database';

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
  const page = options?.page || 1;
  const limit = options?.limit || 20;
  const offset = (page - 1) * limit;

  let whereConditions: string[] = [];
  let params: any[] = [];
  let paramIndex = 1;

  // 篩選狀態
  if (options?.status && options.status !== 'all') {
    whereConditions.push(`s.status = $${paramIndex}`);
    params.push(options.status);
    paramIndex++;
  }

  // 搜尋
  if (options?.search) {
    whereConditions.push(`(s.title_zh ILIKE $${paramIndex} OR s.title_en ILIKE $${paramIndex} OR s.theme_zh ILIKE $${paramIndex} OR s.theme_en ILIKE $${paramIndex})`);
    params.push(`%${options.search}%`);
    paramIndex++;
  }

  // 日期範圍
  if (options?.dateFrom) {
    whereConditions.push(`s.date >= $${paramIndex}`);
    params.push(options.dateFrom);
    paramIndex++;
  }
  if (options?.dateTo) {
    whereConditions.push(`s.date <= $${paramIndex}`);
    params.push(options.dateTo);
    paramIndex++;
  }

  const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

  // 查詢課程
  const sessionsQuery = `
    SELECT s.*,
           json_agg(DISTINCT jsonb_build_object(
             'id', sr.role_id,
             'name_zh', sr.name_zh,
             'name_en', sr.name_en,
             'image_url', sr.image_url,
             'capacity', sr.capacity,
             'description_zh', sr.description_zh,
             'description_en', sr.description_en
           )) FILTER (WHERE sr.id IS NOT NULL) as roles,
           json_object_agg(sar.addon_id, sar.count) FILTER (WHERE sar.id IS NOT NULL) as addon_registrations
    FROM sessions s
    LEFT JOIN session_roles sr ON s.id = sr.session_id
    LEFT JOIN session_addon_registrations sar ON s.id = sar.session_id
    ${whereClause}
    GROUP BY s.id
    ORDER BY s.date ASC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

  params.push(limit, offset);

  // 查詢總數
  const countQuery = `
    SELECT COUNT(*) as total
    FROM sessions s
    ${whereClause}
  `;

  const countParams = params.slice(0, paramIndex - 1);

  const [sessionsResult, countResult] = await Promise.all([
    pool.query(sessionsQuery, params),
    pool.query(countQuery, countParams),
  ]);

  const sessions = sessionsResult.rows.map(row => ({
    ...row,
    roles: row.roles || [],
    addon_registrations: row.addon_registrations || {},
    tags: row.tags || [],
  }));

  return {
    sessions,
    total: parseInt(countResult.rows[0].total),
    page,
    limit,
  };
}

/**
 * 取得單一課程
 */
export async function getSessionById(id: string) {
  const query = `
    SELECT s.*,
           json_agg(DISTINCT jsonb_build_object(
             'id', sr.role_id,
             'name_zh', sr.name_zh,
             'name_en', sr.name_en,
             'image_url', sr.image_url,
             'capacity', sr.capacity,
             'description_zh', sr.description_zh,
             'description_en', sr.description_en
           )) FILTER (WHERE sr.id IS NOT NULL) as roles,
           json_object_agg(sar.addon_id, sar.count) FILTER (WHERE sar.id IS NOT NULL) as addon_registrations
    FROM sessions s
    LEFT JOIN session_roles sr ON s.id = sr.session_id
    LEFT JOIN session_addon_registrations sar ON s.id = sar.session_id
    WHERE s.id = $1
    GROUP BY s.id
  `;

  const result = await pool.query(query, [id]);

  if (result.rows.length === 0) {
    throw new Error('Session not found');
  }

  const session = result.rows[0];
  return {
    ...session,
    roles: session.roles || [],
    addon_registrations: session.addon_registrations || {},
    tags: session.tags || [],
  };
}

/**
 * 新增課程
 */
export async function createSession(sessionData: Omit<Session, 'id' | 'created_at' | 'updated_at'>) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { roles, addon_registrations, ...sessionFields } = sessionData;

    // 插入課程
    const insertSessionQuery = `
      INSERT INTO sessions (
        title_zh, title_en, theme_zh, theme_en, story_zh, story_en,
        description_zh, description_en, venue_zh, venue_en, date, day_of_week,
        time, duration_minutes, capacity, hidden_buffer, price, age_min, age_max,
        image_url, video_url, status, current_registrations, tags
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16,
        $17, $18, $19, $20, $21, $22, $23, $24
      ) RETURNING id
    `;

    const sessionValues = [
      sessionFields.title_zh,
      sessionFields.title_en,
      sessionFields.theme_zh,
      sessionFields.theme_en,
      sessionFields.story_zh || '',
      sessionFields.story_en || '',
      sessionFields.description_zh || '',
      sessionFields.description_en || '',
      sessionFields.venue_zh,
      sessionFields.venue_en,
      sessionFields.date,
      sessionFields.day_of_week,
      sessionFields.time,
      sessionFields.duration_minutes,
      sessionFields.capacity,
      sessionFields.hidden_buffer || 0,
      sessionFields.price,
      sessionFields.age_min,
      sessionFields.age_max,
      sessionFields.image_url || '',
      sessionFields.video_url || '',
      sessionFields.status,
      sessionFields.current_registrations || 0,
      sessionFields.tags || [],
    ];

    const sessionResult = await client.query(insertSessionQuery, sessionValues);
    const sessionId = sessionResult.rows[0].id;

    // 插入角色
    if (roles && roles.length > 0) {
      const insertRolesQuery = `
        INSERT INTO session_roles (
          session_id, role_id, name_zh, name_en, image_url, capacity,
          description_zh, description_en
        ) VALUES ${roles.map((_, i) => {
          const base = i * 8;
          return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}, $${base + 8})`;
        }).join(', ')}
      `;

      const rolesValues = roles.flatMap(role => [
        sessionId,
        role.id,
        role.name_zh,
        role.name_en,
        role.image_url || '',
        role.capacity,
        role.description_zh || '',
        role.description_en || '',
      ]);

      await client.query(insertRolesQuery, rolesValues);
    }

    // 插入加購項目
    if (addon_registrations && Object.keys(addon_registrations).length > 0) {
      const addons = Object.entries(addon_registrations);
      const insertAddonsQuery = `
        INSERT INTO session_addon_registrations (session_id, addon_id, count)
        VALUES ${addons.map((_, i) => `($1, $${i * 2 + 2}, $${i * 2 + 3})`).join(', ')}
      `;

      const addonsValues = [sessionId, ...addons.flatMap(([addon_id, count]) => [addon_id, count])];
      await client.query(insertAddonsQuery, addonsValues);
    }

    await client.query('COMMIT');

    return await getSessionById(sessionId);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating session:', error);
    throw new Error(`Failed to create session: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    client.release();
  }
}

/**
 * 更新課程
 */
export async function updateSession(id: string, sessionData: Partial<Omit<Session, 'id' | 'created_at' | 'updated_at'>>) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { roles, addon_registrations, ...sessionFields } = sessionData;

    // 更新課程
    if (Object.keys(sessionFields).length > 0) {
      const setClause = Object.keys(sessionFields)
        .map((key, i) => `${key} = $${i + 2}`)
        .join(', ');

      const updateQuery = `
        UPDATE sessions
        SET ${setClause}, updated_at = NOW()
        WHERE id = $1
      `;

      const values = [id, ...Object.values(sessionFields)];
      await client.query(updateQuery, values);
    }

    // 更新角色
    if (roles !== undefined) {
      await client.query('DELETE FROM session_roles WHERE session_id = $1', [id]);

      if (roles.length > 0) {
        const insertRolesQuery = `
          INSERT INTO session_roles (
            session_id, role_id, name_zh, name_en, image_url, capacity,
            description_zh, description_en
          ) VALUES ${roles.map((_, i) => {
            const base = i * 8;
            return `($${base + 1}, $${base + 2}, $${base + 3}, $${base + 4}, $${base + 5}, $${base + 6}, $${base + 7}, $${base + 8})`;
          }).join(', ')}
        `;

        const rolesValues = roles.flatMap(role => [
          id,
          role.id,
          role.name_zh,
          role.name_en,
          role.image_url || '',
          role.capacity,
          role.description_zh || '',
          role.description_en || '',
        ]);

        await client.query(insertRolesQuery, rolesValues);
      }
    }

    // 更新加購項目
    if (addon_registrations !== undefined) {
      await client.query('DELETE FROM session_addon_registrations WHERE session_id = $1', [id]);

      if (Object.keys(addon_registrations).length > 0) {
        const addons = Object.entries(addon_registrations);
        const insertAddonsQuery = `
          INSERT INTO session_addon_registrations (session_id, addon_id, count)
          VALUES ${addons.map((_, i) => `($1, $${i * 2 + 2}, $${i * 2 + 3})`).join(', ')}
        `;

        const addonsValues = [id, ...addons.flatMap(([addon_id, count]) => [addon_id, count])];
        await client.query(insertAddonsQuery, addonsValues);
      }
    }

    await client.query('COMMIT');

    return await getSessionById(id);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating session:', error);
    throw new Error(`Failed to update session: ${error instanceof Error ? error.message : 'Unknown error'}`);
  } finally {
    client.release();
  }
}

/**
 * 刪除課程
 */
export async function deleteSession(id: string) {
  const session = await getSessionById(id);

  if (session.current_registrations && session.current_registrations > 0) {
    throw new Error('Cannot delete session with existing registrations');
  }

  await pool.query('DELETE FROM sessions WHERE id = $1', [id]);

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
    current_registrations: 0,
    addon_registrations: {},
  };

  return await createSession(newSessionData);
}
