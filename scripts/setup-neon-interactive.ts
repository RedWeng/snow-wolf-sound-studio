/**
 * Neon 互動式設定腳本
 * 
 * 會詢問連線字串並自動寫入 .env.local
 * 
 * 執行方式：npm run setup:neon:interactive
 */

import * as readline from 'readline';
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
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
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

// 建立 readline 介面
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function main() {
  log('\n🚀 Neon 互動式設定', 'bright');
  log('此腳本會幫你設定 DATABASE_URL 環境變數\n', 'magenta');

  // 檢查是否已有 DATABASE_URL
  const envPath = path.join(__dirname, '..', '.env.local');
  let existingEnv = '';
  let hasDatabaseUrl = false;

  if (fs.existsSync(envPath)) {
    existingEnv = fs.readFileSync(envPath, 'utf-8');
    hasDatabaseUrl = existingEnv.includes('DATABASE_URL=');
  }

  if (hasDatabaseUrl) {
    logWarning('檢測到 .env.local 已有 DATABASE_URL');
    const overwrite = await question('是否要覆蓋？(y/n): ');
    
    if (overwrite.toLowerCase() !== 'y') {
      log('\n取消設定', 'yellow');
      rl.close();
      return;
    }
  }

  // 顯示說明
  log('\n📋 請完成以下步驟：', 'cyan');
  log('1. 前往 https://neon.tech/');
  log('2. 建立專案（如果還沒建立）');
  log('3. 複製連線字串（類似：postgresql://user:pass@ep-xxx.region.aws.neon.tech/db?sslmode=require）\n');

  // 詢問連線字串
  const connectionString = await question('請貼上你的 Neon 連線字串: ');

  if (!connectionString) {
    logError('連線字串不能為空！');
    rl.close();
    process.exit(1);
  }

  // 驗證連線字串格式
  if (!connectionString.startsWith('postgresql://') && !connectionString.startsWith('postgres://')) {
    logError('連線字串格式不正確！應該以 postgresql:// 或 postgres:// 開頭');
    rl.close();
    process.exit(1);
  }

  if (!connectionString.includes('neon.tech')) {
    logWarning('這似乎不是 Neon 的連線字串，但我們還是會繼續...');
  }

  // 更新或建立 .env.local
  try {
    let newEnvContent = '';

    if (fs.existsSync(envPath)) {
      // 移除舊的 DATABASE_URL
      const lines = existingEnv.split('\n');
      const filteredLines = lines.filter(line => !line.startsWith('DATABASE_URL='));
      newEnvContent = filteredLines.join('\n');
      
      // 確保結尾有換行
      if (newEnvContent && !newEnvContent.endsWith('\n')) {
        newEnvContent += '\n';
      }
    }

    // 加入新的 DATABASE_URL
    newEnvContent += `\n# Neon Database Connection\nDATABASE_URL=${connectionString}\n`;

    fs.writeFileSync(envPath, newEnvContent, 'utf-8');
    logSuccess('.env.local 已更新！');
    logInfo(`檔案位置：${envPath}`);

  } catch (error) {
    logError('寫入 .env.local 失敗');
    logError(error instanceof Error ? error.message : '未知錯誤');
    rl.close();
    process.exit(1);
  }

  // 詢問是否要繼續執行設定
  log('\n');
  const continueSetup = await question('是否要繼續執行資料庫設定？(建立資料表和遷移資料) (y/n): ');

  rl.close();

  if (continueSetup.toLowerCase() === 'y') {
    log('\n開始執行資料庫設定...\n', 'cyan');
    
    // 動態載入並執行 setup-neon.ts
    try {
      const { execSync } = await import('child_process');
      execSync('npm run setup:neon', { stdio: 'inherit' });
    } catch (error) {
      logError('執行設定腳本失敗');
      logInfo('你可以稍後手動執行：npm run setup:neon');
      process.exit(1);
    }
  } else {
    log('\n✅ 環境變數已設定完成！', 'green');
    logInfo('\n下一步：');
    log('  1. 執行設定：npm run setup:neon');
    log('  2. 啟動開發：npm run dev\n');
  }
}

main().catch(error => {
  logError('\n設定過程發生錯誤');
  logError(error instanceof Error ? error.message : '未知錯誤');
  rl.close();
  process.exit(1);
});
