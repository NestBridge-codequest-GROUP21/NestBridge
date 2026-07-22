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
    blessing: 'bsbhackman@gmail.com',
    abigailadusei17: 'abigailadusei17@gmail.com',
    abigail: 'abigailadusei17@gmail.com',
    angelonwe54: 'angelonwe54@gmail.com',
    angel: 'angelonwe54@gmail.com',
    sirinaabbas2: 'sirinaabbas2@gmail.com',
    sirina: 'sirinaabbas2@gmail.com',
    abdulsamedtaslima: 'abdulsamedtaslima@gmail.com',
    taslima: 'abdulsamedtaslima@gmail.com',
    taslimah: 'abdulsamedtaslima@gmail.com',
    tassy: 'abdulsamedtaslima@gmail.com',
    admin: 'admin@nestbridge.app',
  };

  return aliases[trimmed] ?? trimmed;
}

export function isCompleteEmail(value: string): boolean {
  const email = value.trim();
  return email.includes('@') && email.indexOf('@') < email.length - 1;
}
