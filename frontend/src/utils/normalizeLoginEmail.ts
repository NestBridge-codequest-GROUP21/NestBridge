/**
 * Normalize emails typed on sign-in / forgot-password.
 * Expands known staff shorthand (e.g. "bsbhackman" → full Gmail).
 */
export function normalizeLoginEmail(raw: string): string {
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed) {
    return trimmed;
  }
  if (trimmed.includes('@')) {
    return trimmed;
  }

  const aliases: Record<string, string> = {
    bsbhackman: 'bsbhackman@gmail.com',
    abdulsamedtaslima: 'abdulsamedtaslima@gmail.com',
    angelonwe54: 'angelonwe54@gmail.com',
    admin: 'admin@nestbridge.app',
  };

  return aliases[trimmed] ?? trimmed;
}

export function isCompleteEmail(value: string): boolean {
  const email = value.trim();
  return email.includes('@') && email.indexOf('@') < email.length - 1;
}
