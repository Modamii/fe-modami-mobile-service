// ─── Auth API response shapes ─────────────────────────────────────────────────

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

/** Envelope A — dùng cho login, register, refresh */
export interface AuthEnvelope<T> {
  success: boolean;
  data: T;
  error?: {
    code: string;
    message: string;
    detail?: string;
    errors?: { field: string; message: string }[];
  } | null;
  meta?: {
    request_id?: string;
    timestamp?: number;
  };
}

/** Claims từ GET /auth/auth/me (Keycloak JWT) */
export interface KeycloakClaims {
  sub: string;
  email: string;
  email_verified: boolean;
  preferred_username: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  realm_access?: { roles: string[] };
}

export interface RegisterData {
  user_id: string;
}
