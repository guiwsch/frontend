export interface DecodedToken {
  exp: number;
  user_id: number;
  username: string;
  email?: string;
  [key: string]: any;
}

export interface UserProfile {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface LoginResponse {
  success: boolean;
  error?: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  error?: string;
}

export interface AuthContextType {
  user: DecodedToken | null;
  userProfile: UserProfile | null;
  login: (username: string, password: string) => Promise<LoginResponse>;
  register: (data: RegisterData) => Promise<RegisterResponse>;
  logout: () => void;
  refreshToken: () => Promise<string>;
  isAuthenticated: () => boolean;
  loading: boolean;
  fetchUserProfile: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<boolean>;
}
