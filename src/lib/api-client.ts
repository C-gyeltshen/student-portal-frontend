/**
 * API Client
 * 
 * Centralized API client with error handling and request/response interceptors.
 * This makes it easy to:
 * - Add authentication headers
 * - Handle errors consistently
 * - Transform requests/responses
 * - Switch between mock and real APIs
 */

import { API_CONFIG, getApiUrl } from '@/config/api.config';

/**
 * API Response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

/**
 * API Error
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Request options
 */
interface RequestOptions extends RequestInit {
  params?: Record<string, any>;
  timeout?: number;
}

/**
 * Build URL with query parameters
 */
const buildUrlWithParams = (url: string, params?: Record<string, any>): string => {
  if (!params || Object.keys(params).length === 0) {
    return url;
  }

  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${url}?${queryString}` : url;
};

/**
 * Get authentication token from storage
 * Update this based on your auth implementation
 */
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // Check localStorage for token
  const token = localStorage.getItem('authToken') || localStorage.getItem('auth_token');
  return token;
};

/**
 * Main API client class
 */
class ApiClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor() {
    this.baseURL = API_CONFIG.USE_PROXY ? API_CONFIG.PROXY_BASE_URL : API_CONFIG.BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Add request interceptor (add auth headers, etc.)
   */
  private async interceptRequest(options: RequestOptions): Promise<RequestInit> {
    const headers = new Headers(options.headers || this.defaultHeaders);

    // Add authentication token if available
    const token = getAuthToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return {
      ...options,
      headers,
    };
  }

  /**
   * Handle API response
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    let data: any;
    if (isJson) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      // Handle different error responses
      const errorMessage = data?.message || data?.error || `HTTP ${response.status}: ${response.statusText}`;
      
      throw new ApiError(
        errorMessage,
        response.status,
        data
      );
    }

    // Return standardized response
    return {
      success: true,
      data: data.data || data,
      message: data.message,
      meta: data.meta,
    };
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): never {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error.name === 'AbortError') {
      throw new ApiError('Request timeout', 408);
    }

    if (!navigator.onLine) {
      throw new ApiError('No internet connection', 0);
    }

    throw new ApiError(
      error.message || 'An unexpected error occurred',
      error.statusCode || 500
    );
  }

  /**
   * Generic request method
   */
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = buildUrlWithParams(getApiUrl(endpoint), options.params);
      
      // Setup timeout
      const controller = new AbortController();
      const timeout = options.timeout || API_CONFIG.TIMEOUT;
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      // Intercept request
      const requestOptions = await this.interceptRequest({
        ...options,
        signal: controller.signal,
      });

      // Make request
      const response = await fetch(url, requestOptions);
      clearTimeout(timeoutId);

      // Handle response
      return await this.handleResponse<T>(response);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, any>, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
      params,
    });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  async put<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(endpoint: string, data?: any, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }

  /**
   * Download file (for PDFs, CSVs, etc.)
   */
  async download(endpoint: string, params?: Record<string, any>, filename?: string): Promise<void> {
    try {
      const url = buildUrlWithParams(getApiUrl(endpoint), params);
      const token = getAuthToken();
      
      const headers: HeadersInit = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        throw new ApiError(`Download failed: ${response.statusText}`, response.status);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      this.handleError(error);
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export for use in services
export default apiClient;
