import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import { auth } from "./firebase";

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error("Error getting Firebase token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - try to refresh
      try {
        if (auth.currentUser) {
          const newToken = await auth.currentUser.getIdToken(true);
          // Retry the original request with new token
          if (error.config) {
            error.config.headers.Authorization = `Bearer ${newToken}`;
            return api.request(error.config);
          }
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Redirect to login or handle as needed
        if (
          typeof window !== "undefined" &&
          !window.location.pathname.includes("/login")
        ) {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

// Token validation function using existing protected endpoint
export const validateToken = async (
  token?: string
): Promise<{ isValid: boolean; user?: any }> => {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/profile`,
      { headers }
    );

    return {
      isValid: true,
      user: response.data,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        return { isValid: false };
      }
      if (error.response?.status === 404) {
        console.warn("User profile not found in backend");
        return { isValid: false };
      }
    }

    console.error("Token validation error:", error);
    return { isValid: false };
  }
};

// Protected API methods
export const protectedApi = {
  // Get user profile
  getProfile: () => api.get("/profile"),

  // Update user profile
  updateProfile: (data: any) => api.put("/profile", data),

  // Dashboard endpoints
  getDashboard: () => api.get("/dashboard"),
  getStudentDashboard: () => api.get("/student/dashboard"),
  getAdminDashboard: () => api.get("/admin/dashboard"),
  getFinanceDashboard: () => api.get("/finance/dashboard"),

  // Admin endpoints
  getAllUsers: () => api.get("/api/users"),
  getUserById: (id: string) => api.get(`/api/users/${id}`),
  updateUser: (id: string, data: any) => api.put(`/api/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/api/users/${id}`),

  // Banking endpoints
  getAllBanks: () => api.get("/api/banks"),
  createBank: (data: any) => api.post("/api/banks", data),
  updateBank: (id: string, data: any) => api.put(`/api/banks/${id}`, data),
  deleteBank: (id: string) => api.delete(`/api/banks/${id}`),

  // Student bank details
  getAllStudentBankDetails: () => api.get("/api/student-bank-details"),
  getStudentBankDetails: () => api.get("/api/student-bank-details"),
  getMyBankDetails: () => api.get("/api/student-bank-details/me"),
  updateStudentBankDetails: (id: string, data: any) =>
    api.put(`/api/student-bank-details/${id}`, data),
  updateMyBankDetails: (data: any) =>
    api.put("/api/student-bank-details/me", data),
};

export default api;
