/**
 * 前端 API 請求 Hook
 * 為 500 人同時上線準備 - 2026-02-08
 * 
 * 功能：
 * 1. useAPIRequest hook - 統一的 API 請求介面
 * 2. 自動重試機制（3 次）
 * 3. Loading 狀態管理
 * 4. 錯誤狀態管理
 * 5. 指數退避重試策略
 */

'use client';

import { useState, useCallback, useRef } from 'react';

/**
 * API 錯誤介面
 */
export interface APIError {
  message: string;
  code?: string;
  details?: unknown;
}

/**
 * API 請求選項
 */
export interface APIRequestOptions extends RequestInit {
  /** 重試次數，預設 3 次 */
  retries?: number;
  /** 重試延遲（毫秒），預設使用指數退避 */
  retryDelay?: number;
  /** 是否使用指數退避，預設 true */
  exponentialBackoff?: boolean;
  /** 請求超時時間（毫秒），預設 30000 (30秒) */
  timeout?: number;
  /** 是否在錯誤時自動顯示提示，預設 false */
  showErrorToast?: boolean;
}

/**
 * API 請求結果
 */
export interface APIRequestResult<T> {
  /** 執行 API 請求 */
  request: (url: string, options?: APIRequestOptions) => Promise<T>;
  /** 載入狀態 */
  loading: boolean;
  /** 錯誤訊息 */
  error: string | null;
  /** 錯誤代碼 */
  errorCode: string | null;
  /** 重置錯誤狀態 */
  clearError: () => void;
  /** 取消請求 */
  cancel: () => void;
}

/**
 * 延遲函數
 */
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * 計算指數退避延遲
 * @param attempt - 當前嘗試次數（從 0 開始）
 * @param baseDelay - 基礎延遲時間（毫秒）
 * @returns 延遲時間（毫秒）
 */
function calculateBackoffDelay(attempt: number, baseDelay: number = 1000): number {
  // 指數退避：baseDelay * 2^attempt + 隨機抖動
  const exponentialDelay = baseDelay * Math.pow(2, attempt);
  const jitter = Math.random() * 1000; // 0-1000ms 的隨機抖動
  return Math.min(exponentialDelay + jitter, 10000); // 最大 10 秒
}

/**
 * 判斷錯誤是否可重試
 */
function isRetriableError(error: unknown, statusCode?: number): boolean {
  // 網路錯誤可重試
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return true;
  }

  // 5xx 伺服器錯誤可重試
  if (statusCode && statusCode >= 500 && statusCode < 600) {
    return true;
  }

  // 429 Too Many Requests 可重試
  if (statusCode === 429) {
    return true;
  }

  // 408 Request Timeout 可重試
  if (statusCode === 408) {
    return true;
  }

  // 503 Service Unavailable 可重試
  if (statusCode === 503) {
    return true;
  }

  return false;
}

/**
 * 前端 API 請求 Hook
 * 
 * @example
 * ```tsx
 * const { request, loading, error } = useAPIRequest<Session[]>();
 * 
 * const fetchSessions = async () => {
 *   try {
 *     const sessions = await request('/api/sessions', {
 *       method: 'GET',
 *       retries: 3,
 *     });
 *     console.log(sessions);
 *   } catch (err) {
 *     console.error('Failed to fetch sessions:', err);
 *   }
 * };
 * ```
 */
export function useAPIRequest<T = any>(): APIRequestResult<T> {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * 清除錯誤狀態
   */
  const clearError = useCallback(() => {
    setError(null);
    setErrorCode(null);
  }, []);

  /**
   * 取消請求
   */
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  /**
   * 執行 API 請求
   */
  const request = useCallback(
    async (url: string, options: APIRequestOptions = {}): Promise<T> => {
      const {
        retries = 3,
        retryDelay = 1000,
        exponentialBackoff = true,
        timeout = 30000,
        showErrorToast = false,
        ...fetchOptions
      } = options;

      // 重置狀態
      setLoading(true);
      setError(null);
      setErrorCode(null);

      // 建立新的 AbortController
      abortControllerRef.current = new AbortController();
      const { signal } = abortControllerRef.current;

      // 設定超時
      const timeoutId = setTimeout(() => {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
      }, timeout);

      let lastError: Error | null = null;
      let lastStatusCode: number | undefined;

      // 重試邏輯
      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          // 發送請求
          const response = await fetch(url, {
            ...fetchOptions,
            signal,
            headers: {
              'Content-Type': 'application/json',
              ...fetchOptions.headers,
            },
          });

          lastStatusCode = response.status;

          // 檢查回應狀態
          if (!response.ok) {
            // 嘗試解析錯誤訊息
            let errorData: APIError | null = null;
            try {
              errorData = await response.json();
            } catch {
              // 無法解析 JSON，使用預設錯誤訊息
            }

            const errorMessage = errorData?.message || `請求失敗 (${response.status})`;
            const errorCodeValue = errorData?.code || 'REQUEST_FAILED';

            // 判斷是否可重試
            if (attempt < retries && isRetriableError(null, response.status)) {
              // 計算延遲時間
              const delayTime = exponentialBackoff
                ? calculateBackoffDelay(attempt, retryDelay)
                : retryDelay;

              console.warn(
                `API request failed (attempt ${attempt + 1}/${retries + 1}), retrying in ${delayTime}ms...`,
                { url, status: response.status, error: errorMessage }
              );

              await delay(delayTime);
              continue;
            }

            // 不可重試或已達最大重試次數
            throw new Error(errorMessage);
          }

          // 成功回應
          clearTimeout(timeoutId);
          const data = await response.json();
          setLoading(false);
          return data as T;

        } catch (err) {
          lastError = err instanceof Error ? err : new Error('Unknown error');

          // 如果是取消請求，直接拋出錯誤
          if (signal.aborted) {
            clearTimeout(timeoutId);
            setLoading(false);
            throw new Error('請求已取消');
          }

          // 判斷是否可重試
          if (attempt < retries && isRetriableError(err, lastStatusCode)) {
            // 計算延遲時間
            const delayTime = exponentialBackoff
              ? calculateBackoffDelay(attempt, retryDelay)
              : retryDelay;

            console.warn(
              `API request failed (attempt ${attempt + 1}/${retries + 1}), retrying in ${delayTime}ms...`,
              { url, error: lastError.message }
            );

            await delay(delayTime);
            continue;
          }

          // 不可重試或已達最大重試次數
          break;
        }
      }

      // 所有重試都失敗
      clearTimeout(timeoutId);
      setLoading(false);

      const errorMessage = lastError?.message || '網路錯誤，請檢查網路連線';
      const errorCodeValue = 'NETWORK_ERROR';

      setError(errorMessage);
      setErrorCode(errorCodeValue);

      // 可選：顯示錯誤提示
      if (showErrorToast && typeof window !== 'undefined') {
        // 這裡可以整合 toast 通知庫
        console.error('API Error:', errorMessage);
      }

      throw lastError || new Error(errorMessage);
    },
    []
  );

  return {
    request,
    loading,
    error,
    errorCode,
    clearError,
    cancel,
  };
}

/**
 * 便捷的 GET 請求 Hook
 */
export function useAPIGet<T = any>() {
  const { request, ...rest } = useAPIRequest<T>();

  const get = useCallback(
    (url: string, options?: Omit<APIRequestOptions, 'method' | 'body'>) => {
      return request(url, { ...options, method: 'GET' });
    },
    [request]
  );

  return { get, ...rest };
}

/**
 * 便捷的 POST 請求 Hook
 */
export function useAPIPost<T = any>() {
  const { request, ...rest } = useAPIRequest<T>();

  const post = useCallback(
    (url: string, data?: any, options?: Omit<APIRequestOptions, 'method'>) => {
      return request(url, {
        ...options,
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined,
      });
    },
    [request]
  );

  return { post, ...rest };
}

/**
 * 便捷的 PUT 請求 Hook
 */
export function useAPIPut<T = any>() {
  const { request, ...rest } = useAPIRequest<T>();

  const put = useCallback(
    (url: string, data?: any, options?: Omit<APIRequestOptions, 'method'>) => {
      return request(url, {
        ...options,
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined,
      });
    },
    [request]
  );

  return { put, ...rest };
}

/**
 * 便捷的 DELETE 請求 Hook
 */
export function useAPIDelete<T = any>() {
  const { request, ...rest } = useAPIRequest<T>();

  const del = useCallback(
    (url: string, options?: Omit<APIRequestOptions, 'method' | 'body'>) => {
      return request(url, { ...options, method: 'DELETE' });
    },
    [request]
  );

  return { delete: del, ...rest };
}
