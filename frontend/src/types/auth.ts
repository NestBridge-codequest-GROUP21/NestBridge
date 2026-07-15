export interface AuthUser {
  userId: string;
  email: string;
  displayName: string;
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
}

export interface AuthSession {
  token: string;
  refreshToken?: string;
  user: AuthUser;
  keepSignedIn: boolean;
}
