/**
 * Email Service using Resend
 */

import { Resend } from 'resend';
import {
  RegistrationConfirmationEmail,
  PaymentPendingNotification,
  RegistrationSuccessEmail,
  type OrderDetails,
} from './templates';

// Initialize Resend (you'll need to add API key to .env)
// Use a placeholder key during build if not provided
const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_key_for_build');

const ADMIN_EMAIL = 'molodyschool@gmail.com';
// Resend free tier: use onboarding@resend.dev for testing, or verify your domain
const FROM_EMAIL = 'Snow Wolf <onboarding@resend.dev>';

/**
 * Send registration confirmation email to parent
 */
export async function sendRegistrationConfirmation(order: OrderDetails) {
  try {
    const template = RegistrationConfirmationEmail(order);
    
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: order.parentEmail,
      subject: template.subject,
      html: template.html,
    });

    if (error) {
      console.error('Failed to send registration confirmation:', error);
      return { success: false, error };
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Registration confirmation sent:', data);
    }
    return { success: true, data };
  } catch (error) {
    console.error('Error sending registration confirmation:', error);
    return { success: false, error };
  }
}

/**
 * Send payment pending notification to admin
 */
export async function sendPaymentPendingNotification(
  order: OrderDetails,
  paymentProof?: string
) {
  try {
    const template = PaymentPendingNotification(order, paymentProof);
    
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: template.subject,
      html: template.html,
    });

    if (error) {
      console.error('Failed to send payment pending notification:', error);
      return { success: false, error };
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Payment pending notification sent:', data);
    }
    return { success: true, data };
  } catch (error) {
    console.error('Error sending payment pending notification:', error);
    return { success: false, error };
  }
}

/**
 * Send registration success email to parent
 */
export async function sendRegistrationSuccess(order: OrderDetails) {
  try {
    const template = RegistrationSuccessEmail(order);
    
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: order.parentEmail,
      subject: template.subject,
      html: template.html,
    });

    if (error) {
      console.error('Failed to send registration success:', error);
      return { success: false, error };
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('✅ Registration success sent:', data);
    }
    return { success: true, data };
  } catch (error) {
    console.error('Error sending registration success:', error);
    return { success: false, error };
  }
}

/**
 * Send all emails for a new registration
 */
export async function handleNewRegistration(order: OrderDetails) {
  // 1. Send confirmation to parent
  await sendRegistrationConfirmation(order);
  
  // 2. Send notification to admin
  await sendPaymentPendingNotification(order);
  
  return { success: true };
}

/**
 * Handle payment proof submission
 */
export async function handlePaymentProofSubmission(
  order: OrderDetails,
  paymentProof: string
) {
  // Send notification to admin with payment proof
  await sendPaymentPendingNotification(order, paymentProof);
  
  return { success: true };
}

/**
 * Handle payment confirmation by admin
 */
export async function handlePaymentConfirmation(order: OrderDetails) {
  // Send success email to parent
  await sendRegistrationSuccess(order);
  
  return { success: true };
}
