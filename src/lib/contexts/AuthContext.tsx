"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { UserRole } from "@/lib/enums/roles";
import { api } from "@/lib/privateAxios";

interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isEmailVerified: boolean;
  lastLogin?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{ success: boolean; message: string }>;
  verifyOTP: (
    email: string,
    otp: string,
    type: string,
  ) => Promise<{
    success: boolean;
    message: string;
    token?: string;
    user?: User;
  }>;
  forgotPassword: (
    email: string,
  ) => Promise<{ success: boolean; message: string }>;
  resetPassword: (
    email: string,
    otp: string,
    newPassword: string,
  ) => Promise<{ success: boolean; message: string }>;
  changePassword: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = localStorage.getItem("admin_token");
        if (storedToken) {
          setToken(storedToken);
          await fetchUserProfile(storedToken);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        localStorage.removeItem("admin_token");
        setToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const fetchUserProfile = async (authToken: string) => {
    try {
      // Set the token in localStorage so privateAxios can use it
      localStorage.setItem("admin_token", authToken);

      const response = await api.get<{
        success: boolean;
        data: { user: User };
        message?: string;
      }>("/api/auth/me");
      const data = response.data;

      if (data.success) {
        setUser(data.data.user);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error("Fetch user profile error:", error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        return {
          success: false,
          message: err.message || "Invalid credentials",
        };
      }

      const data = await response.json();
      if (data?.token && data?.user) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("admin_token", data.token);
        return { success: true, message: "Login successful" };
      }

      return { success: false, message: "Unexpected response from server" };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, message: "Login failed. Please try again." };
    }
  };

  const verifyOTP = async (email: string, otp: string, type: string) => {
    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, type }),
      });

      const data = await response.json();

      if (data.success && data.data?.token) {
        const { token: authToken, user: userData } = data.data;
        setToken(authToken);
        setUser(userData);
        localStorage.setItem("admin_token", authToken);
      }

      return data;
    } catch (error) {
      console.error("OTP verification error:", error);
      return {
        success: false,
        message: "OTP verification failed. Please try again.",
      };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Forgot password error:", error);
      return {
        success: false,
        message: "Failed to send reset email. Please try again.",
      };
    }
  };

  const resetPassword = async (
    email: string,
    otp: string,
    newPassword: string,
  ) => {
    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Reset password error:", error);
      return {
        success: false,
        message: "Password reset failed. Please try again.",
      };
    }
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    try {
      const response = await api.post<{ success: boolean; message: string }>(
        "/api/auth/change-password",
        {
          currentPassword,
          newPassword,
        },
      );

      const data = response.data;
      return data;
    } catch (error) {
      console.error("Change password error:", error);
      return {
        success: false,
        message: "Password change failed. Please try again.",
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("admin_token");
  };

  const refreshUser = async () => {
    if (token) {
      try {
        await fetchUserProfile(token);
      } catch (error) {
        console.error("Refresh user error:", error);
        logout();
      }
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    verifyOTP,
    forgotPassword,
    resetPassword,
    changePassword,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
