/**
 * 統一錯誤處理機制
 * 為 500 人同時上線準備 - 2026-02-08
 * 
 * 功能：
 * 1. APIError 類別 - 自訂錯誤類型
 * 2. handleAPIError 函數 - 統一錯誤處理
 * 3. 統一的錯誤回應格式
 * 4. 資料庫錯誤處理
 * 5. 驗證錯誤處理
 */

/**
 * API 錯誤類別
 * 用於建立結構化的 API 錯誤
 */
export class APIError extends Error {
  public statusCode: number;
  public code?: string;
  public details?: unknown;

  constructor(
    statusCode: number,
    message: string,
    code?: string,
    details?: unknown
  ) {
    super(message);
    this.name = 'APIError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    // 維持正確的堆疊追蹤
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, APIError);
    }
  }
}

/**
 * 錯誤回應介面
 */
export interface ErrorResponse {
  error: {
    message: string;
    code?: string;
    details?: unknown;
  };
}

/**
 * 常見錯誤代碼
 */
export const ErrorCodes = {
  // 驗證錯誤 (400)
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  
  // 認證錯誤 (401)
  UNAUTHORIZED: 'UNAUTHORIZED',
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  
  // 權限錯誤 (403)
  FORBIDDEN: 'FORBIDDEN',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  
  // 資源錯誤 (404)
  NOT_FOUND: 'NOT_FOUND',
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  
  // 衝突錯誤 (409)
  CONFLICT: 'CONFLICT',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  CAPACITY_EXCEEDED: 'CAPACITY_EXCEEDED',
  
  // 業務邏輯錯誤 (422)
  BUSINESS_LOGIC_ERROR: 'BUSINESS_LOGIC_ERROR',
  SESSION_FULL: 'SESSION_FULL',
  REGISTRATION_CLOSED: 'REGISTRATION_CLOSED',
  INVALID_PAYMENT_METHOD: 'INVALID_PAYMENT_METHOD',
  
  // 伺服器錯誤 (500)
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
} as const;

/**
 * 資料庫錯誤處理
 * 將資料庫特定錯誤轉換為使用者友善的訊息
 */
function handleDatabaseError(error: Error): APIError {
  const message = error.message.toLowerCase();

  // PostgreSQL 唯一約束違反
  if (message.includes('duplicate key') || message.includes('unique constraint')) {
    return new APIError(
      409,
      '資料已存在，請檢查是否重複提交',
      ErrorCodes.DUPLICATE_ENTRY,
      { originalError: error.message }
    );
  }

  // PostgreSQL 外鍵約束違反
  if (message.includes('foreign key constraint')) {
    return new APIError(
      400,
      '關聯資料不存在，請確認資料正確性',
      ErrorCodes.VALIDATION_ERROR,
      { originalError: error.message }
    );
  }

  // PostgreSQL 非空約束違反
  if (message.includes('not null constraint') || message.includes('null value')) {
    return new APIError(
      400,
      '缺少必要欄位，請填寫完整資料',
      ErrorCodes.MISSING_REQUIRED_FIELD,
      { originalError: error.message }
    );
  }

  // 連線錯誤
  if (message.includes('connection') || message.includes('timeout')) {
    return new APIError(
      503,
      '資料庫連線失敗，請稍後再試',
      ErrorCodes.DATABASE_ERROR,
      { originalError: error.message }
    );
  }

  // 預設資料庫錯誤
  return new APIError(
    500,
    '資料庫操作失敗，請稍後再試',
    ErrorCodes.DATABASE_ERROR,
    { originalError: error.message }
  );
}

/**
 * 驗證錯誤處理
 * 處理輸入驗證相關錯誤
 */
export function createValidationError(
  message: string,
  details?: unknown
): APIError {
  return new APIError(
    400,
    message,
    ErrorCodes.VALIDATION_ERROR,
    details
  );
}

/**
 * 認證錯誤處理
 */
export function createAuthError(
  message: string = '請先登入',
  code: string = ErrorCodes.UNAUTHORIZED
): APIError {
  return new APIError(401, message, code);
}

/**
 * 資源不存在錯誤
 */
export function createNotFoundError(
  resource: string = '資源'
): APIError {
  return new APIError(
    404,
    `${resource}不存在`,
    ErrorCodes.NOT_FOUND
  );
}

/**
 * 業務邏輯錯誤
 */
export function createBusinessError(
  message: string,
  code: string = ErrorCodes.BUSINESS_LOGIC_ERROR
): APIError {
  return new APIError(422, message, code);
}

/**
 * 統一錯誤處理函數
 * 將各種錯誤轉換為標準的 Response 物件
 * 
 * @param error - 任何類型的錯誤
 * @returns Response 物件，包含錯誤訊息和適當的狀態碼
 */
export function handleAPIError(error: unknown): Response {
  // 記錄錯誤（生產環境應使用專業的日誌服務）
  console.error('API Error:', error);

  // 如果是我們自訂的 APIError
  if (error instanceof APIError) {
    const errorResponse: ErrorResponse = {
      error: {
        message: error.message,
        code: error.code,
        details: process.env.NODE_ENV === 'development' ? error.details : undefined,
      },
    };

    return Response.json(errorResponse, { 
      status: error.statusCode,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // 如果是標準 Error 物件
  if (error instanceof Error) {
    // 檢查是否為資料庫錯誤
    const dbError = handleDatabaseError(error);
    
    const errorResponse: ErrorResponse = {
      error: {
        message: dbError.message,
        code: dbError.code,
        details: process.env.NODE_ENV === 'development' ? dbError.details : undefined,
      },
    };

    return Response.json(errorResponse, { 
      status: dbError.statusCode,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // 未知錯誤類型
  const errorResponse: ErrorResponse = {
    error: {
      message: '系統錯誤，請稍後再試',
      code: ErrorCodes.INTERNAL_ERROR,
      details: process.env.NODE_ENV === 'development' ? { error } : undefined,
    },
  };

  return Response.json(errorResponse, { 
    status: 500,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

/**
 * 非同步錯誤處理包裝器
 * 用於包裝 API 路由處理函數，自動捕獲並處理錯誤
 * 
 * @example
 * export const POST = withErrorHandler(async (request) => {
 *   // 你的邏輯
 *   return Response.json({ success: true });
 * });
 */
export function withErrorHandler(
  handler: (request: Request, context?: any) => Promise<Response>
) {
  return async (request: Request, context?: any): Promise<Response> => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleAPIError(error);
    }
  };
}

/**
 * 驗證請求方法
 * 確保 API 端點只接受指定的 HTTP 方法
 */
export function validateMethod(
  request: Request,
  allowedMethods: string[]
): void {
  if (!allowedMethods.includes(request.method)) {
    throw new APIError(
      405,
      `不支援的請求方法: ${request.method}`,
      'METHOD_NOT_ALLOWED'
    );
  }
}

/**
 * 驗證必要欄位
 * 檢查物件是否包含所有必要欄位
 */
export function validateRequiredFields<T extends Record<string, any>>(
  data: T,
  requiredFields: (keyof T)[]
): void {
  const missingFields = requiredFields.filter(
    field => data[field] === undefined || data[field] === null || data[field] === ''
  );

  if (missingFields.length > 0) {
    throw createValidationError(
      `缺少必要欄位: ${missingFields.join(', ')}`,
      { missingFields }
    );
  }
}

/**
 * 安全的 JSON 解析
 * 解析請求 body，並處理解析錯誤
 */
export async function safeJSONParse<T = any>(request: Request): Promise<T> {
  try {
    const body = await request.json();
    return body as T;
  } catch (error) {
    throw createValidationError(
      '無效的 JSON 格式',
      { originalError: error instanceof Error ? error.message : 'Unknown error' }
    );
  }
}
