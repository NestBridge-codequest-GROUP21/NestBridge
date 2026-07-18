export function parseResetPasswordToken(url: string): string | null {
  if (!url.includes('reset-password')) {
    return null;
  }
  const queryIndex = url.indexOf('?');
  if (queryIndex === -1) {
    return null;
  }
  const params = new URLSearchParams(url.slice(queryIndex + 1));
  const token = params.get('token');
  return token && token.trim() ? token.trim() : null;
}
