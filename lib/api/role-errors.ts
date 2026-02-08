/**
 * Centralized error messages for role validation
 * Requirements: 10.3
 */

/**
 * Role validation error types
 */
export enum RoleErrorType {
  INVALID_ROLE_ID = 'INVALID_ROLE_ID',
  ROLE_CAPACITY_EXCEEDED = 'ROLE_CAPACITY_EXCEEDED',
  MISSING_ROLE_SELECTION = 'MISSING_ROLE_SELECTION',
  ROLE_ASSIGNMENT_MISMATCH = 'ROLE_ASSIGNMENT_MISMATCH',
  SESSION_NOT_FOUND = 'SESSION_NOT_FOUND',
  NO_ROLES_REQUIRED = 'NO_ROLES_REQUIRED',
}

/**
 * Role error messages in Chinese and English
 */
export const RoleErrorMessages = {
  [RoleErrorType.INVALID_ROLE_ID]: {
    zh: (roleId: string) => `無效的角色：${roleId} 不適用於此場次`,
    en: (roleId: string) => `Invalid role: ${roleId} is not available for this session`,
  },
  [RoleErrorType.ROLE_CAPACITY_EXCEEDED]: {
    zh: (roleName: string) => `角色 ${roleName} 已額滿，請選擇其他角色`,
    en: (roleName: string) => `Role ${roleName} is fully booked. Please select a different character.`,
  },
  [RoleErrorType.MISSING_ROLE_SELECTION]: {
    zh: () => '請為此場次選擇角色',
    en: () => 'Please select a character role for this session',
  },
  [RoleErrorType.ROLE_ASSIGNMENT_MISMATCH]: {
    zh: () => '角色分配與場次配置不符',
    en: () => 'Role assignment is invalid for this session',
  },
  [RoleErrorType.SESSION_NOT_FOUND]: {
    zh: (sessionId: string) => `找不到場次 ${sessionId}`,
    en: (sessionId: string) => `Session with ID ${sessionId} not found`,
  },
  [RoleErrorType.NO_ROLES_REQUIRED]: {
    zh: (sessionTitle: string) => `場次 ${sessionTitle} 不需要選擇角色`,
    en: (sessionTitle: string) => `Session ${sessionTitle} does not require role selection`,
  },
};

/**
 * Get error message in specified language
 * @param errorType Error type
 * @param language Language preference ('zh' or 'en')
 * @param params Optional parameters for error message
 * @returns Localized error message
 */
export function getRoleErrorMessage(
  errorType: RoleErrorType,
  language: 'zh' | 'en' = 'en',
  ...params: string[]
): string {
  const messageFunc = RoleErrorMessages[errorType][language] as (...args: string[]) => string;
  return messageFunc(...params);
}

/**
 * HTTP status codes for role validation errors
 */
export const RoleErrorStatusCodes = {
  [RoleErrorType.INVALID_ROLE_ID]: 400, // Bad Request
  [RoleErrorType.ROLE_CAPACITY_EXCEEDED]: 409, // Conflict
  [RoleErrorType.MISSING_ROLE_SELECTION]: 400, // Bad Request
  [RoleErrorType.ROLE_ASSIGNMENT_MISMATCH]: 400, // Bad Request
  [RoleErrorType.SESSION_NOT_FOUND]: 404, // Not Found
  [RoleErrorType.NO_ROLES_REQUIRED]: 400, // Bad Request
};

/**
 * Role validation error class
 */
export class RoleValidationError extends Error {
  public readonly type: RoleErrorType;
  public readonly statusCode: number;
  public readonly messageZh: string;
  public readonly messageEn: string;

  constructor(errorType: RoleErrorType, ...params: string[]) {
    const messageEn = getRoleErrorMessage(errorType, 'en', ...params);
    super(messageEn);

    this.name = 'RoleValidationError';
    this.type = errorType;
    this.statusCode = RoleErrorStatusCodes[errorType];
    this.messageEn = messageEn;
    this.messageZh = getRoleErrorMessage(errorType, 'zh', ...params);

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, RoleValidationError);
    }
  }

  /**
   * Get error message in specified language
   * @param language Language preference ('zh' or 'en')
   * @returns Localized error message
   */
  getMessage(language: 'zh' | 'en' = 'en'): string {
    return language === 'zh' ? this.messageZh : this.messageEn;
  }

  /**
   * Convert error to JSON format
   * @param language Language preference ('zh' or 'en')
   * @returns Error object in JSON format
   */
  toJSON(language: 'zh' | 'en' = 'en') {
    return {
      error: this.type,
      message: this.getMessage(language),
      statusCode: this.statusCode,
    };
  }
}
