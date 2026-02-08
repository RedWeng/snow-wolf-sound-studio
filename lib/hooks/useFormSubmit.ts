/**
 * 表單防重複提交 Hook
 * 為 500 人同時上線準備 - 2026-02-08
 * 
 * 功能：
 * 1. useFormSubmit hook - 表單提交管理
 * 2. 防止重複提交
 * 3. Loading 狀態
 * 4. 錯誤處理
 * 5. 成功回調
 */

'use client';

import { useState, useCallback, useRef } from 'react';

/**
 * 表單提交選項
 */
export interface FormSubmitOptions<TData = any, TResult = any> {
  /** 提交處理函數 */
  onSubmit: (data: TData) => Promise<TResult>;
  /** 成功回調 */
  onSuccess?: (result: TResult, data: TData) => void | Promise<void>;
  /** 錯誤回調 */
  onError?: (error: Error, data: TData) => void | Promise<void>;
  /** 最終回調（無論成功或失敗都會執行） */
  onFinally?: (data: TData) => void | Promise<void>;
  /** 提交前驗證 */
  validate?: (data: TData) => boolean | Promise<boolean>;
  /** 驗證失敗訊息 */
  validationErrorMessage?: string;
  /** 防抖延遲（毫秒），預設 300ms */
  debounceDelay?: number;
  /** 是否在提交後重置表單，預設 false */
  resetOnSuccess?: boolean;
}

/**
 * 表單提交結果
 */
export interface FormSubmitResult<TData = any, TResult = any> {
  /** 提交函數 */
  handleSubmit: (data: TData) => Promise<void>;
  /** 提交中狀態 */
  isSubmitting: boolean;
  /** 是否已提交成功 */
  isSuccess: boolean;
  /** 錯誤訊息 */
  error: string | null;
  /** 提交結果 */
  result: TResult | null;
  /** 重置狀態 */
  reset: () => void;
  /** 清除錯誤 */
  clearError: () => void;
}

/**
 * 表單防重複提交 Hook
 * 
 * @example
 * ```tsx
 * const { handleSubmit, isSubmitting, error } = useFormSubmit({
 *   onSubmit: async (data) => {
 *     const response = await fetch('/api/orders', {
 *       method: 'POST',
 *       body: JSON.stringify(data),
 *     });
 *     return response.json();
 *   },
 *   onSuccess: (result) => {
 *     console.log('Order created:', result);
 *     router.push(`/orders/${result.orderNumber}`);
 *   },
 *   onError: (error) => {
 *     console.error('Failed to create order:', error);
 *   },
 * });
 * 
 * return (
 *   <form onSubmit={(e) => {
 *     e.preventDefault();
 *     handleSubmit(formData);
 *   }}>
 *     <button type="submit" disabled={isSubmitting}>
 *       {isSubmitting ? '提交中...' : '提交'}
 *     </button>
 *     {error && <p className="error">{error}</p>}
 *   </form>
 * );
 * ```
 */
export function useFormSubmit<TData = any, TResult = any>(
  options: FormSubmitOptions<TData, TResult>
): FormSubmitResult<TData, TResult> {
  const {
    onSubmit,
    onSuccess,
    onError,
    onFinally,
    validate,
    validationErrorMessage = '表單驗證失敗，請檢查輸入',
    debounceDelay = 300,
    resetOnSuccess = false,
  } = options;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TResult | null>(null);

  // 使用 ref 追蹤最後提交時間，實現防抖
  const lastSubmitTimeRef = useRef<number>(0);
  // 使用 ref 追蹤是否正在提交，防止重複提交
  const isSubmittingRef = useRef<boolean>(false);

  /**
   * 重置狀態
   */
  const reset = useCallback(() => {
    setIsSubmitting(false);
    setIsSuccess(false);
    setError(null);
    setResult(null);
    isSubmittingRef.current = false;
  }, []);

  /**
   * 清除錯誤
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * 處理表單提交
   */
  const handleSubmit = useCallback(
    async (data: TData): Promise<void> => {
      // 防止重複提交
      if (isSubmittingRef.current) {
        console.warn('Form is already submitting, ignoring duplicate submission');
        return;
      }

      // 防抖檢查
      const now = Date.now();
      if (now - lastSubmitTimeRef.current < debounceDelay) {
        console.warn('Form submission debounced');
        return;
      }
      lastSubmitTimeRef.current = now;

      // 設定提交中狀態
      isSubmittingRef.current = true;
      setIsSubmitting(true);
      setError(null);
      setIsSuccess(false);

      try {
        // 執行驗證（如果有）
        if (validate) {
          const isValid = await validate(data);
          if (!isValid) {
            throw new Error(validationErrorMessage);
          }
        }

        // 執行提交
        const submitResult = await onSubmit(data);
        setResult(submitResult);
        setIsSuccess(true);

        // 執行成功回調
        if (onSuccess) {
          await onSuccess(submitResult, data);
        }

        // 如果設定了重置選項，重置表單
        if (resetOnSuccess) {
          // 延遲重置，讓使用者看到成功狀態
          setTimeout(() => {
            reset();
          }, 1000);
        }

      } catch (err) {
        // 處理錯誤
        const errorMessage = err instanceof Error ? err.message : '提交失敗，請稍後再試';
        setError(errorMessage);
        setIsSuccess(false);

        // 執行錯誤回調
        if (onError) {
          await onError(
            err instanceof Error ? err : new Error(errorMessage),
            data
          );
        }

        // 重新拋出錯誤，讓呼叫者可以處理
        throw err;

      } finally {
        // 執行最終回調
        if (onFinally) {
          await onFinally(data);
        }

        // 重置提交狀態
        setIsSubmitting(false);
        isSubmittingRef.current = false;
      }
    },
    [
      onSubmit,
      onSuccess,
      onError,
      onFinally,
      validate,
      validationErrorMessage,
      debounceDelay,
      resetOnSuccess,
      reset,
    ]
  );

  return {
    handleSubmit,
    isSubmitting,
    isSuccess,
    error,
    result,
    reset,
    clearError,
  };
}

/**
 * 表單欄位狀態管理 Hook
 * 配合 useFormSubmit 使用，管理表單欄位狀態
 */
export interface FormFieldOptions<T> {
  /** 初始值 */
  initialValue: T;
  /** 驗證函數 */
  validate?: (value: T) => string | null;
  /** 是否必填 */
  required?: boolean;
  /** 必填錯誤訊息 */
  requiredMessage?: string;
}

export interface FormFieldResult<T> {
  /** 欄位值 */
  value: T;
  /** 設定值 */
  setValue: (value: T) => void;
  /** 錯誤訊息 */
  error: string | null;
  /** 是否已觸碰 */
  touched: boolean;
  /** 標記為已觸碰 */
  setTouched: () => void;
  /** 驗證欄位 */
  validate: () => boolean;
  /** 重置欄位 */
  reset: () => void;
}

export function useFormField<T>(
  options: FormFieldOptions<T>
): FormFieldResult<T> {
  const {
    initialValue,
    validate: validateFn,
    required = false,
    requiredMessage = '此欄位為必填',
  } = options;

  const [value, setValue] = useState<T>(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  /**
   * 驗證欄位
   */
  const validate = useCallback((): boolean => {
    // 檢查必填
    if (required && (value === '' || value === null || value === undefined)) {
      setError(requiredMessage);
      return false;
    }

    // 執行自訂驗證
    if (validateFn) {
      const validationError = validateFn(value);
      if (validationError) {
        setError(validationError);
        return false;
      }
    }

    setError(null);
    return true;
  }, [value, required, requiredMessage, validateFn]);

  /**
   * 重置欄位
   */
  const reset = useCallback(() => {
    setValue(initialValue);
    setError(null);
    setTouched(false);
  }, [initialValue]);

  /**
   * 標記為已觸碰
   */
  const markTouched = useCallback(() => {
    setTouched(true);
  }, []);

  return {
    value,
    setValue,
    error,
    touched,
    setTouched: markTouched,
    validate,
    reset,
  };
}

/**
 * 多欄位表單管理 Hook
 * 管理整個表單的狀態和驗證
 */
export interface FormOptions<T extends Record<string, any>> {
  /** 初始值 */
  initialValues: T;
  /** 驗證函數 */
  validate?: (values: T) => Record<keyof T, string> | null;
  /** 提交處理函數 */
  onSubmit: (values: T) => Promise<any>;
  /** 成功回調 */
  onSuccess?: (result: any, values: T) => void | Promise<void>;
  /** 錯誤回調 */
  onError?: (error: Error, values: T) => void | Promise<void>;
}

export interface FormResult<T extends Record<string, any>> {
  /** 表單值 */
  values: T;
  /** 設定欄位值 */
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void;
  /** 欄位錯誤 */
  errors: Partial<Record<keyof T, string>>;
  /** 已觸碰的欄位 */
  touched: Partial<Record<keyof T, boolean>>;
  /** 標記欄位為已觸碰 */
  setFieldTouched: (field: keyof T) => void;
  /** 處理提交 */
  handleSubmit: (e?: React.FormEvent) => Promise<void>;
  /** 提交中狀態 */
  isSubmitting: boolean;
  /** 是否已提交成功 */
  isSuccess: boolean;
  /** 提交錯誤 */
  submitError: string | null;
  /** 重置表單 */
  reset: () => void;
}

export function useForm<T extends Record<string, any>>(
  options: FormOptions<T>
): FormResult<T> {
  const { initialValues, validate: validateFn, onSubmit, onSuccess, onError } = options;

  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const { handleSubmit: submitForm, isSubmitting, isSuccess, error: submitError, reset: resetSubmit } = useFormSubmit({
    onSubmit: async (data: T) => {
      // 驗證表單
      if (validateFn) {
        const validationErrors = validateFn(data);
        if (validationErrors) {
          setErrors(validationErrors);
          throw new Error('表單驗證失敗');
        }
      }
      return onSubmit(data);
    },
    onSuccess,
    onError,
  });

  /**
   * 設定欄位值
   */
  const setFieldValue = useCallback(<K extends keyof T>(field: K, value: T[K]) => {
    setValues(prev => ({ ...prev, [field]: value }));
    // 清除該欄位的錯誤
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  }, []);

  /**
   * 標記欄位為已觸碰
   */
  const setFieldTouched = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  /**
   * 處理表單提交
   */
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
      }

      // 標記所有欄位為已觸碰
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({ ...acc, [key]: true }),
        {} as Record<keyof T, boolean>
      );
      setTouched(allTouched);

      // 提交表單
      await submitForm(values);
    },
    [values, submitForm]
  );

  /**
   * 重置表單
   */
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    resetSubmit();
  }, [initialValues, resetSubmit]);

  return {
    values,
    setFieldValue,
    errors,
    touched,
    setFieldTouched,
    handleSubmit,
    isSubmitting,
    isSuccess,
    submitError,
    reset,
  };
}
