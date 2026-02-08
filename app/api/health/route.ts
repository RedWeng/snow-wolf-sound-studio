/**
 * System Health Check API
 * 
 * Monitor database connection, pool stats, and system status
 */

import { NextResponse } from 'next/server';
import { getPool, getPoolStats } from '@/lib/neon/client';

export async function GET() {
  const startTime = Date.now();
  
  try {
    const pool = getPool();
    
    // Test database connection
    const dbStart = Date.now();
    const result = await pool.query('SELECT NOW() as current_time, version() as pg_version');
    const dbDuration = Date.now() - dbStart;
    
    // Get pool statistics
    const poolStats = getPoolStats();
    
    // Calculate health metrics
    const totalDuration = Date.now() - startTime;
    const isHealthy = dbDuration < 1000 && totalDuration < 2000;
    
    return NextResponse.json({
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      database: {
        connected: true,
        responseTime: dbDuration,
        currentTime: result.rows[0].current_time,
        version: result.rows[0].pg_version,
      },
      connectionPool: poolStats ? {
        total: poolStats.totalCount,
        idle: poolStats.idleCount,
        waiting: poolStats.waitingCount,
        active: poolStats.totalCount - poolStats.idleCount,
        utilization: poolStats.totalCount > 0 
          ? Math.round(((poolStats.totalCount - poolStats.idleCount) / poolStats.totalCount) * 100)
          : 0,
      } : null,
      performance: {
        totalResponseTime: totalDuration,
        databaseQueryTime: dbDuration,
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        platform: process.platform,
        nodeVersion: process.version,
      },
    });
    
  } catch (error) {
    console.error('[Health Check] Failed:', error);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      database: {
        connected: false,
      },
    }, { status: 503 });
  }
}
