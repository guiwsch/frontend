export interface DecodedToken {
  exp: number;
  user_id: number;
  username: string;
  email?: string;
  [key: string]: any;
}

export interface LoginResponse {
  success: boolean;
  error?: string;
}

export interface AuthContextType {
  user: DecodedToken | null;
  login: (username: string, password: string) => Promise<LoginResponse>;
  logout: () => void;
  refreshToken: () => Promise<string>;
  isAuthenticated: () => boolean;
  loading: boolean;
}
