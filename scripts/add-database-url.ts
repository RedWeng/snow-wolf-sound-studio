/**
 * 快速新增 DATABASE_URL 到 .env.local
 * 
 * 使用方式：
 * npm run add-db-url "postgresql://user:pass@ep-xxx.neon.tech/db?sslmode=require"
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 顏色輸出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message: string) {
  log(`✅ ${message}`, 'green');
}

function logError(message: string) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message: string) {
  log(`ℹ️  ${message}`, 'blue');
}

function logWarning(message: string) {
  log(`⚠️  ${message}`, 'yellow');
}

async function main() {
  const connectionString = process.argv[2];

  if (!connectionString) {
    logError('請提供連線字串！');
    logInfo('\n使用方式：');
    log('npm run add-db-url "postgresql://user:pass@ep-xxx.neon.tech/db?sslmode=require"\n');
    process.exit(1);
  }

  // 驗證連線字串格式
  if (!connectionString.startsWith('postgresql://') && !connectionString.startsWith('postgres://')) {
    logError('連線字串格式不正確！應該以 postgresql:// 或 postgres:// 開頭');
    process.exit(1);
  }

  const envPath = path.join(__dirname, '..', '.env.local');
  let existingEnv = '';
  let hasDatabaseUrl = false;

  // 讀取現有的 .env.local
  if (fs.existsSync(envPath)) {
    existingEnv = fs.readFileSync(envPath, 'utf-8');
    hasDatabaseUrl = existingEnv.includes('DATABASE_URL=');
  }

  if (hasDatabaseUrl) {
    logWarning('.env.local 已有 DATABASE_URL，將會覆蓋');
  }

  try {
    let newEnvContent = '';

    if (fs.existsSync(envPath)) {
      // 移除舊的 DATABASE_URL 相關行
      const lines = existingEnv.split('\n');
      const filteredLines = lines.filter(line => 
        !line.startsWith('DATABASE_URL=') && 
        !line.includes('# Neon Database Connection')
      );
      newEnvContent = filteredLines.join('\n');
      
      // 確保結尾有換行
      if (newEnvContent && !newEnvContent.endsWith('\n')) {
        newEnvContent += '\n';
      }
    }

    // 加入新的 DATABASE_URL
    newEnvContent += `\n# Neon Database Connection\nDATABASE_URL=${connectionString}\n`;

    fs.writeFileSync(envPath, newEnvContent, 'utf-8');
    
    logSuccess('DATABASE_URL 已新增到 .env.local！');
    logInfo(`檔案位置：${envPath}`);
    
    log('\n下一步：', 'bright');
    log('1. 執行設定：npm run setup:neon');
    log('2. 啟動開發：npm run dev\n');

  } catch (error) {
    logError('寫入 .env.local 失敗');
    logError(error instanceof Error ? error.message : '未知錯誤');
    process.exit(1);
  }
}

main().catch(error => {
  logError('發生錯誤');
  logError(error instanceof Error ? error.message : '未知錯誤');
  process.exit(1);
});
