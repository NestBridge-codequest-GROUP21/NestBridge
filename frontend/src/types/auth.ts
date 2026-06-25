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

export interface AuthSession {
  token: string;
  user: AuthUser;
  keepSignedIn: boolean;
}
