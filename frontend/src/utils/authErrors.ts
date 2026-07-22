/** Shared helpers for auth screen error routing and copy. */

export function isUnverifiedEmailError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes('not yet been verified') ||
    lower.includes('verify your email') ||
    lower.includes('verification link') ||
    lower.includes('started signup') ||
    lower.includes('finish signup') ||
    lower.includes('check your inbox to verify')
  );
}

export function isExistingAccountError(message: string): boolean {
  const lower = message.toLowerCase();
  return lower.includes('already exists') || lower.includes('already have an account');
}

export function isEmailDeliveryError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes('could not send') ||
    lower.includes('email delivery') ||
    lower.includes('verification email could not') ||
    lower.includes('mail provider')
  );
}

export const ACCOUNT_CREATED_VERIFY_COPY =
  'Your account has been created successfully. Please check your email to verify your account before signing in.';

export const EMAIL_DELIVERY_FAILED_COPY =
  'Your account was created, but we could not send the verification email. Use Resend below, or change your email and try again. Contact support if this keeps happening.';

export const UNVERIFIED_LOGIN_COPY =
  'Your email has not yet been verified. Please verify your email before signing in.';
