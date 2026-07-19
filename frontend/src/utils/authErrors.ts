/** Shared helpers for auth screen error routing and copy. */

export function isUnverifiedEmailError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
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
