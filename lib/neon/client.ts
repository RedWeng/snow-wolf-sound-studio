/**
 * Neon Database Client
 * 
 * Production-ready connection pool optimized for 500+ concurrent users
 * with automatic retry logic and connection monitoring
 */

import { Pool, PoolClient } from 'pg';

let _pool: Pool | null = null;

// Connection pool configuration for high concurrency
const POOL_CONFIG = {
  max: 30, // Maximum number of clients (increased for high traffic)
  min: 5, // Minimum number of clients to keep alive
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 5000, // Timeout for acquiring a connection
  maxUses: 7500, // Close and replace a client after 7500 uses
  allowExitOnIdle: false, // Keep the pool alive
  statement_timeout: 30000, // 30 second query timeout
  query_timeout: 30000, // 30 second query timeout
};

export function getPool(): Pool {
  if (!_pool) {
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      throw new Error('Missing DATABASE_URL environment variable for Neon');
    }

    _pool = new Pool({
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false, // Neon requires SSL
      },
      ...POOL_CONFIG,
    });

    // Connection event handlers for monitoring
    _pool.on('connect', (client) => {
      console.log('[Neon Pool] New client connected');
      // Set default timezone
      client.query('SET timezone = "Asia/Taipei"').catch(err => {
        console.error('[Neon Pool] Failed to set timezone:', err);
      });
    });

    _pool.on('acquire', () => {
      console.log('[Neon Pool] Client acquired from pool');
    });

    _pool.on('remove', () => {
      console.log('[Neon Pool] Client removed from pool');
    });

    _pool.on('error', (err, client) => {
      console.error('[Neon Pool] Unexpected error on idle client:', err);
      // Don't exit process in production
      if (process.env.NODE_ENV !== 'production') {
        console.error('[Neon Pool] Client error in development mode');
      }
    });

    console.log('[Neon Pool] Connection pool initialized with config:', {
      max: POOL_CONFIG.max,
      min: POOL_CONFIG.min,
      idleTimeoutMillis: POOL_CONFIG.idleTimeoutMillis,
      connectionTimeoutMillis: POOL_CONFIG.connectionTimeoutMillis,
    });
  }

  return _pool;
}

// 向後相容
export const pool = new Proxy({} as Pool, {
  get(target, prop) {
    return getPool()[prop as keyof Pool];
  }
});

/**
 * 執行 SQL 查詢（帶自動重試機制）
 */
export async function query(text: string, params?: any[], retries = 3) {
  const start = Date.now();
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      
      if (duration > 1000) {
        console.warn(`[Neon Query] Slow query detected (${duration}ms):`, text.substring(0, 100));
      }
      
      console.log('[Neon Query] Executed', { 
        duration, 
        rows: res.rowCount,
        attempt: attempt > 1 ? attempt : undefined 
      });
      
      return res;
    } catch (error) {
      lastError = error as Error;
      console.error(`[Neon Query] Attempt ${attempt}/${retries} failed:`, error);
      
      // Don't retry on certain errors
      if (
        error instanceof Error &&
        (error.message.includes('duplicate key') ||
         error.message.includes('foreign key') ||
         error.message.includes('check constraint') ||
         error.message.includes('syntax error'))
      ) {
        throw error;
      }

      // Wait before retrying (exponential backoff)
      if (attempt < retries) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError || new Error('Query failed after retries');
}

/**
 * 執行交易（帶自動回滾）
 */
export async function executeTransaction<T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    console.log('[Neon Transaction] Transaction committed successfully');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[Neon Transaction] Transaction rolled back:', error);
    throw error;
  } finally {
    client.release();
  }
}

/**
 * 取得連線池統計資訊
 */
export function getPoolStats() {
  if (!_pool) {
    return null;
  }

  return {
    totalCount: _pool.totalCount,
    idleCount: _pool.idleCount,
    waitingCount: _pool.waitingCount,
  };
}

/**
 * 優雅關閉連線池
 */
export async function closePool() {
  if (_pool) {
    await _pool.end();
    _pool = null;
    console.log('[Neon Pool] Connection pool closed gracefully');
  }
}
