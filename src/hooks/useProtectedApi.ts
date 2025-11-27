import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { protectedApi, validateToken } from "@/lib/apiService";
import { AxiosError } from "axios";

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface RegistrationData {
  uid: string;
  email: string;
  displayName: string;
  role: string;
}

export const useProtectedApi = <T = any>() => {
  const { user, token, logout } = useAuth();
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  // Input validation function
  const validateRegistrationData = useCallback(
    (data: RegistrationData): boolean => {
      // Validate required fields
      if (!data.uid || !data.email || !data.displayName || !data.role) {
        return false;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        return false;
      }

      // Validate display name (no special characters that could be malicious)
      const nameRegex = /^[a-zA-Z\s'-]{2,50}$/;
      if (!nameRegex.test(data.displayName)) {
        return false;
      }

      // Validate role (only allow specific roles for security)
      const allowedRoles = ["student", "finance_officer"];
      if (!allowedRoles.includes(data.role)) {
        return false;
      }

      // Validate UID format (Firebase UID format)
      const uidRegex = /^[a-zA-Z0-9]{28}$/;
      if (!uidRegex.test(data.uid)) {
        return false;
      }

      return true;
    },
    []
  );

  const handleApiCall = useCallback(
    async (apiCall: () => Promise<any>) => {
      if (!user || !token) {
        setState((prev) => ({ ...prev, error: "Not authenticated" }));
        return;
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        // Validate token before making API call
        const { isValid } = await validateToken(token);

        if (!isValid) {
          await logout();
          setState((prev) => ({
            ...prev,
            loading: false,
            error: "Session expired",
          }));
          return;
        }

        const response = await apiCall();
        setState({
          data: response.data,
          loading: false,
          error: null,
        });

        return response.data;
      } catch (error) {
        let errorMessage = "An error occurred";

        if (error instanceof AxiosError) {
          if (
            error.response?.status === 401 ||
            error.response?.status === 403
          ) {
            errorMessage = "Access denied";
            await logout();
          } else if (error.response?.status === 404) {
            errorMessage = "Resource not found";
          } else if (error.response?.status === 409) {
            errorMessage = "User already exists";
          } else if (error.response && error.response.status >= 500) {
            errorMessage = "Server error. Please try again later.";
          } else {
            errorMessage =
              error.response?.data?.message || error.message || errorMessage;
          }
        }

        setState({
          data: null,
          loading: false,
          error: errorMessage,
        });
      }
    },
    [user, token, logout]
  );

  // Secure registration function
  const registerUser = useCallback(
    async (registrationData: RegistrationData) => {
      // Validate input data
      if (!validateRegistrationData(registrationData)) {
        setState((prev) => ({ ...prev, error: "Invalid registration data" }));
        throw new Error("Invalid registration data");
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              uid: registrationData.uid,
              email: registrationData.email.toLowerCase().trim(),
              displayName: registrationData.displayName.trim(),
              role: registrationData.role,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              `Registration failed with status: ${response.status}`
          );
        }

        const result = await response.json();
        setState({
          data: result,
          loading: false,
          error: null,
        });

        return result;
      } catch (error) {
        let errorMessage = "Registration failed";

        if (error instanceof Error) {
          errorMessage = error.message;
        }

        setState({
          data: null,
          loading: false,
          error: errorMessage,
        });

        throw error;
      }
    },
    [token, validateRegistrationData]
  );

  return {
    ...state,
    callApi: handleApiCall,
    registerUser, // New registration method
    // Convenience methods for common API calls
    getProfile: () => handleApiCall(() => protectedApi.getProfile()),
    updateProfile: (data: any) =>
      handleApiCall(() => protectedApi.updateProfile(data)),
    getDashboard: () => handleApiCall(() => protectedApi.getDashboard()),
    getStudentDashboard: () =>
      handleApiCall(() => protectedApi.getStudentDashboard()),
    getAdminDashboard: () =>
      handleApiCall(() => protectedApi.getAdminDashboard()),
    getFinanceDashboard: () =>
      handleApiCall(() => protectedApi.getFinanceDashboard()),
    getAllUsers: () => handleApiCall(() => protectedApi.getAllUsers()),
    getUserById: (id: string) =>
      handleApiCall(() => protectedApi.getUserById(id)),
    updateUser: (id: string, data: any) =>
      handleApiCall(() => protectedApi.updateUser(id, data)),
    deleteUser: (id: string) =>
      handleApiCall(() => protectedApi.deleteUser(id)),
    getAllBanks: () => handleApiCall(() => protectedApi.getAllBanks()),
    createBank: (data: any) =>
      handleApiCall(() => protectedApi.createBank(data)),
    updateBank: (id: string, data: any) =>
      handleApiCall(() => protectedApi.updateBank(id, data)),
    deleteBank: (id: string) =>
      handleApiCall(() => protectedApi.deleteBank(id)),
    getAllStudentBankDetails: () =>
      handleApiCall(() => protectedApi.getAllStudentBankDetails()),
    getStudentBankDetails: () =>
      handleApiCall(() => protectedApi.getStudentBankDetails()),
    getMyBankDetails: () =>
      handleApiCall(() => protectedApi.getMyBankDetails()),
    updateStudentBankDetails: (id: string, data: any) =>
      handleApiCall(() => protectedApi.updateStudentBankDetails(id, data)),
    updateMyBankDetails: (data: any) =>
      handleApiCall(() => protectedApi.updateMyBankDetails(data)),
  };
};
