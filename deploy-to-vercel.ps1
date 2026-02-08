# 雪狼錄音派對 - Vercel 部署腳本
# Snow Wolf Sound Studio - Vercel Deployment Script
# 2026-02-08

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  雪狼錄音派對 - Vercel 部署" -ForegroundColor Cyan
Write-Host "  Snow Wolf Sound Studio Deployment" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 檢查 Vercel CLI 是否已安裝
Write-Host "檢查 Vercel CLI..." -ForegroundColor Yellow
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "❌ Vercel CLI 未安裝" -ForegroundColor Red
    Write-Host ""
    Write-Host "請執行以下指令安裝 Vercel CLI:" -ForegroundColor Yellow
    Write-Host "npm install -g vercel" -ForegroundColor Green
    Write-Host ""
    exit 1
}

Write-Host "✅ Vercel CLI 已安裝" -ForegroundColor Green
Write-Host ""

# 確認是否要部署
Write-Host "準備部署到 Vercel..." -ForegroundColor Yellow
Write-Host ""
Write-Host "部署選項:" -ForegroundColor Cyan
Write-Host "1. 部署到開發環境 (Development)" -ForegroundColor White
Write-Host "2. 部署到正式環境 (Production)" -ForegroundColor White
Write-Host "3. 取消" -ForegroundColor White
Write-Host ""

$choice = Read-Host "請選擇 (1/2/3)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "開始部署到開發環境..." -ForegroundColor Yellow
        Write-Host ""
        vercel
    }
    "2" {
        Write-Host ""
        Write-Host "開始部署到正式環境..." -ForegroundColor Yellow
        Write-Host ""
        Write-Host "⚠️  請確認以下事項:" -ForegroundColor Yellow
        Write-Host "  1. 已在 Vercel Dashboard 設定環境變數" -ForegroundColor White
        Write-Host "  2. DATABASE_URL 已設定" -ForegroundColor White
        Write-Host "  3. ADMIN_LOGIN_EMAIL 和 ADMIN_LOGIN_PASSWORD 已設定" -ForegroundColor White
        Write-Host "  4. JWT_SECRET 已設定" -ForegroundColor White
        Write-Host ""
        
        $confirm = Read-Host "確認要部署到正式環境嗎? (y/n)"
        
        if ($confirm -eq "y" -or $confirm -eq "Y") {
            Write-Host ""
            Write-Host "部署中..." -ForegroundColor Green
            vercel --prod
        } else {
            Write-Host ""
            Write-Host "已取消部署" -ForegroundColor Yellow
            exit 0
        }
    }
    "3" {
        Write-Host ""
        Write-Host "已取消部署" -ForegroundColor Yellow
        exit 0
    }
    default {
        Write-Host ""
        Write-Host "❌ 無效的選項" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  部署完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "下一步:" -ForegroundColor Yellow
Write-Host "1. 前往 Vercel Dashboard 查看部署狀態" -ForegroundColor White
Write-Host "2. 設定環境變數（如果還沒設定）" -ForegroundColor White
Write-Host "3. 測試網站功能" -ForegroundColor White
Write-Host "4. 使用 /api/health 檢查系統狀態" -ForegroundColor White
Write-Host ""
Write-Host "需要幫助？參考 READY_TO_DEPLOY_2026-02-08.md" -ForegroundColor Cyan
Write-Host ""
