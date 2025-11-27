// lib/api.ts
import axios, { AxiosInstance, AxiosResponse } from "axios";

class ApiClient {
  private client: AxiosInstance;
  private tokenProvider: (() => Promise<string | null>) | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    this.setupInterceptors();
  }

  // Set the token provider function (will be called by AuthContext)
  setTokenProvider(provider: () => Promise<string | null>) {
    this.tokenProvider = provider;
  }

  private setupInterceptors() {
    // Request interceptor to add Authorization header
    this.client.interceptors.request.use(
      async (config) => {
        if (this.tokenProvider) {
          const token = await this.tokenProvider();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle auth errors
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          console.error("Authentication failed - redirecting to login");

          // If we're not already on login page, redirect
          if (
            typeof window !== "undefined" &&
            !window.location.pathname.includes("/login")
          ) {
            window.location.href = "/login";
          }
        } else if (error.response?.status === 403) {
          // Forbidden - insufficient permissions
          console.error("Insufficient permissions");

          if (
            typeof window !== "undefined" &&
            !window.location.pathname.includes("/unauthorized")
          ) {
            window.location.href = "/unauthorized";
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Public methods for making API calls
  async get<T = any>(url: string, config?: any): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: any
  ): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: any
  ): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  async delete<T = any>(url: string, config?: any): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: any
  ): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config);
  }
}

// Export a single instance
export const apiClient = new ApiClient();

// API endpoint functions
export const authAPI = {
  // Profile endpoints - using existing protected endpoints instead of dedicated auth endpoints
  getProfile: () => apiClient.get("/profile"),
  updateProfile: (data: any) => apiClient.put("/profile", data),
};

export const dashboardAPI = {
  // Common dashboard
  getDashboard: () => apiClient.get("/dashboard"),
  getHealth: () => apiClient.get("/health"),

  // Student dashboard
  getStudentDashboard: () => apiClient.get("/student/dashboard"),
};

export const adminAPI = {
  // Admin dashboard
  getAdminDashboard: () => apiClient.get("/admin/dashboard"),

  // User management
  getAllUsers: () => apiClient.get("/api/users"),
  getUserById: (id: string) => apiClient.get(`/api/users/${id}`),
  updateUser: (id: string, data: any) =>
    apiClient.put(`/api/users/${id}`, data),
  deleteUser: (id: string) => apiClient.delete(`/api/users/${id}`),

  // Banking operations management
  getAllBanks: () => apiClient.get("/api/banks"),
  createBank: (data: any) => apiClient.post("/api/banks", data),
  updateBank: (id: string, data: any) =>
    apiClient.put(`/api/banks/${id}`, data),
  deleteBank: (id: string) => apiClient.delete(`/api/banks/${id}`),

  // All student banking details
  getAllStudentBankDetails: () => apiClient.get("/api/student-bank-details"),
  updateStudentBankDetails: (id: string, data: any) =>
    apiClient.put(`/api/student-bank-details/${id}`, data),
};

export const financeAPI = {
  // Finance dashboard
  getFinanceDashboard: () => apiClient.get("/finance/dashboard"),

  // Banking operations (finance scope)
  getBanks: () => apiClient.get("/api/banks"),

  // Student banking details management
  getStudentBankDetails: () => apiClient.get("/api/student-bank-details"),
  updateStudentBankDetails: (id: string, data: any) =>
    apiClient.put(`/api/student-bank-details/${id}`, data),
};

export const studentAPI = {
  // Student dashboard
  getStudentDashboard: () => apiClient.get("/student/dashboard"),

  // Own banking details only
  getMyBankDetails: () => apiClient.get("/api/student-bank-details/me"),
  updateMyBankDetails: (data: any) =>
    apiClient.put("/api/student-bank-details/me", data),
};
