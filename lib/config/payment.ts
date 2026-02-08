/**
 * Payment Configuration
 * Bank account and payment method information
 */

export interface BankAccount {
  bank_name_zh: string;
  bank_name_en: string;
  account_number: string;
  account_name_zh: string;
  account_name_en: string;
  branch_zh?: string;
  branch_en?: string;
  bank_code?: string;
}

/**
 * Primary bank account for transfers
 */
export const primaryBankAccount: BankAccount = {
  bank_name_zh: '中國信託商業銀行',
  bank_name_en: 'CTBC Bank',
  account_number: '822598600002664',
  account_name_zh: '翁鵲旻',
  account_name_en: 'Weng Que-Min',
  bank_code: '822',
};

/**
 * Payment deadline configuration
 */
export const paymentConfig = {
  // Payment deadline in hours after order creation
  deadlineHours: 72, // 3 days
  
  // Reminder email timing (hours before deadline)
  reminderHours: 24, // 1 day before deadline
};

/**
 * Get formatted bank account info for display
 */
export function getFormattedBankInfo(language: 'zh' | 'en' = 'zh') {
  const account = primaryBankAccount;
  
  if (language === 'zh') {
    return {
      bankName: account.bank_name_zh,
      accountNumber: formatAccountNumber(account.account_number),
      accountName: account.account_name_zh,
      bankCode: account.bank_code,
    };
  }
  
  return {
    bankName: account.bank_name_en,
    accountNumber: formatAccountNumber(account.account_number),
    accountName: account.account_name_en,
    bankCode: account.bank_code,
  };
}

/**
 * Format account number with spaces for readability
 * Example: 822598600002664 -> 822-5986-0000-2664
 */
function formatAccountNumber(accountNumber: string): string {
  // Remove any existing formatting
  const cleaned = accountNumber.replace(/\D/g, '');
  
  // Format as XXX-XXXX-XXXX-XXXX for CTBC
  if (cleaned.length === 15) {
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 7)}-${cleaned.slice(7, 11)}-${cleaned.slice(11)}`;
  }
  
  // Return original if format doesn't match
  return accountNumber;
}

/**
 * Calculate payment deadline from order creation time
 */
export function calculatePaymentDeadline(orderCreatedAt: Date): Date {
  const deadline = new Date(orderCreatedAt);
  deadline.setHours(deadline.getHours() + paymentConfig.deadlineHours);
  return deadline;
}

/**
 * Check if payment is overdue
 */
export function isPaymentOverdue(deadline: Date): boolean {
  return new Date() > deadline;
}
