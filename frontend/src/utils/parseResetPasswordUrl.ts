export function parseResetPasswordToken(url: string): string | null {
  try {
    if (!url || typeof url !== 'string') {
      return null;
    }
    const normalized = url.trim();
    if (
      !normalized.includes('reset-password') &&
      !normalized.includes('reset_password')
    ) {
      return null;
    }

    // nestbridge://reset-password?token=… or https://…/reset-password?token=…
    const queryIndex = normalized.indexOf('?');
    if (queryIndex !== -1) {
      const params = new URLSearchParams(normalized.slice(queryIndex + 1));
      const token = params.get('token');
      if (token && token.trim()) {
        return token.trim();
      }
    }

    // Rare path form: nestbridge://reset-password/TOKEN
    const pathMatch = normalized.match(/reset-password[/:]([^?&#]+)/i);
    if (pathMatch?.[1]) {
      return decodeURIComponent(pathMatch[1]).trim() || null;
    }

    return null;
  } catch {
    return null;
  }
}
