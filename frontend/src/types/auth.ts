export interface AuthUser {
  userId: string;
  email: string;
  displayName: string;
  /** Server-gated ops access; only true for NestBridge staff accounts. */
  isStaff?: boolean;
}

export interface StoredCredential {
  userId: string;
  email: string;
  displayName: string;
  password: string;
}

export interface RegisterResult {
  email: string;
  displayName: string;
  requiresEmailVerification: boolean;
  /** Account saved but outbound verification email failed. */
  emailDeliveryFailed?: boolean;
  /** Server success message when available. */
  message?: string;
}

export interface AuthSession {
  token: string;
  refreshToken?: string;
  user: AuthUser;
  keepSignedIn: boolean;
}
