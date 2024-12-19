import axiosInstance from "@/lib/axios";
import { ENDPOINTS } from "@/config/api";

interface SignupData {
  email: string;
  fullName: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface User {
  id: string;
  email: string;
  userName: string;
}

interface LoginResponse {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export const authService = {
  async signup(data: SignupData) {
    const response = await axiosInstance.post(ENDPOINTS.AUTH.SIGNUP, data);

    if (response.data.success !== true) {
      throw new Error(response.data.message || "Registration failed");
    }

    return response.data;
  },

  async login(data: LoginData): Promise<LoginResponse> {
    try {
      const response = await axiosInstance.post(ENDPOINTS.AUTH.LOGIN, data);
      const { user, tokens } = response.data;

      // Save tokens
      this.setTokens(tokens);
      // Save user info
      this.setUser(user);

      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    }
  },

  logout() {
    this.clearAuthData();
  },

  // Helper methods for managing tokens
  setTokens(tokens: { accessToken: string; refreshToken: string }) {
    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
  },

  getTokens() {
    return {
      accessToken: localStorage.getItem("accessToken"),
      refreshToken: localStorage.getItem("refreshToken"),
    };
  },

  // Helper methods for managing user data
  setUser(user: User) {
    try {
      localStorage.setItem("user", JSON.stringify(user));
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  },

  getUser(): User | null {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Error parsing user data:", error);
      return null;
    }
  },

  // Clear all authentication data
  clearAuthData() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getTokens().accessToken && !!this.getUser();
  },

  // Update user data
  updateUser(userData: Partial<User>) {
    const currentUser = this.getUser();
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      this.setUser(updatedUser);
      return updatedUser;
    }
    return null;
  },
};
