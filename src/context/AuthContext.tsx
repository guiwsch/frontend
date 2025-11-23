import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import api from "../services/api";
import { DecodedToken, LoginResponse, AuthContextType, RegisterData, RegisterResponse, UserProfile } from "../types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
      } catch (error) {
        console.error("Erro ao decodificar token:", error);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
      }
    }
    setLoading(false);
  }, []);

  const register = async (data: RegisterData): Promise<RegisterResponse> => {
    try {
      await api.post("/api/register/", data);
      return { success: true };
    } catch (error: any) {
      console.error("Erro no registro:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Erro ao registrar usuário",
      };
    }
  };

  const login = async (
    username: string,
    password: string
  ): Promise<LoginResponse> => {
    try {
      const response = await api.post<{ access: string; refresh: string }>(
        "/api/token/",
        {
          username,
          password,
        }
      );

      const { access, refresh } = response.data;
      const decoded = jwtDecode<DecodedToken>(access);

      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      api.defaults.headers.common["Authorization"] = `Bearer ${access}`;

      setUser(decoded);
      return { success: true };
    } catch (error: any) {
      console.error("Erro no login:", error);
      return {
        success: false,
        error: error.response?.data?.detail || "Erro ao fazer login",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const refreshToken = async (): Promise<string> => {
    try {
      const refresh = localStorage.getItem("refresh_token");
      if (!refresh) {
        throw new Error("Nenhum refresh token encontrado");
      }

      const response = await api.post<{ access: string }>(
        "/api/token/refresh/",
        {
          refresh,
        }
      );

      const { access } = response.data;
      const decoded = jwtDecode<DecodedToken>(access);

      localStorage.setItem("access_token", access);
      api.defaults.headers.common["Authorization"] = `Bearer ${access}`;

      setUser(decoded);
      return access;
    } catch (error) {
      console.error("Erro ao renovar token:", error);
      logout();
      throw error;
    }
  };

  const isAuthenticated = (): boolean => {
    return !!user;
  };

  const fetchUserProfile = async (): Promise<void> => {
    try {
      const response = await api.get<UserProfile>('/api/user/');
      setUserProfile(response.data);
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário:', error);
      throw error;
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>): Promise<boolean> => {
    try {
      const response = await api.put<UserProfile>('/api/user/', data);
      setUserProfile(response.data);
      return true;
    } catch (error) {
      console.error('Erro ao atualizar perfil do usuário:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    login,
    register,
    logout,
    refreshToken,
    isAuthenticated,
    loading,
    fetchUserProfile,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
