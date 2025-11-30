/**
 * Stipend Service
 * 
 * This service provides all stipend-related API calls.
 * 
 * IMPORTANT: When you receive real backend APIs:
 * 1. Update API_CONFIG.BASE_URL in src/config/api.config.ts
 * 2. Verify endpoint paths match your backend
 * 3. Update types if needed
 */

import { apiClient, ApiResponse } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  StipendAllocation,
  StipendAllocationFilters,
  CreateStipendAllocationRequest,
  StipendPayment,
  RecordPaymentRequest,
  StipendEligibilityResponse,
  StipendStatisticsResponse,
} from '@/types/student.types';

/**
 * Stipend Service
 */
export const stipendService = {
  /**
   * Check stipend eligibility for a student
   * 
   * Backend endpoint: GET /api/stipends/check-eligibility/:studentId
   */
  checkEligibility: async (
    studentId: string | number
  ): Promise<ApiResponse<StipendEligibilityResponse>> => {
    return apiClient.get<StipendEligibilityResponse>(
      API_ENDPOINTS.STIPENDS.CHECK_ELIGIBILITY(studentId)
    );
  },

  /**
   * Get all stipend allocations with filters
   * 
   * Backend endpoint: GET /api/stipends/allocations
   * Query params: student_id, status, academic_year, semester, page, limit
   */
  getAllocations: async (
    filters?: StipendAllocationFilters
  ): Promise<ApiResponse<StipendAllocation[]>> => {
    return apiClient.get<StipendAllocation[]>(API_ENDPOINTS.STIPENDS.ALLOCATIONS, filters);
  },

  /**
   * Create a new stipend allocation
   * 
   * Backend endpoint: POST /api/stipends/allocate
   */
  createAllocation: async (
    data: CreateStipendAllocationRequest
  ): Promise<ApiResponse<StipendAllocation>> => {
    return apiClient.post<StipendAllocation>(API_ENDPOINTS.STIPENDS.ALLOCATE, data);
  },

  /**
   * Update a stipend allocation
   * 
   * Backend endpoint: PUT /api/stipends/allocations/:id
   */
  updateAllocation: async (
    id: string | number,
    data: Partial<CreateStipendAllocationRequest>
  ): Promise<ApiResponse<StipendAllocation>> => {
    return apiClient.put<StipendAllocation>(
      API_ENDPOINTS.STIPENDS.UPDATE_ALLOCATION(id),
      data
    );
  },

  /**
   * Delete a stipend allocation
   * 
   * Backend endpoint: DELETE /api/stipends/allocations/:id
   */
  deleteAllocation: async (id: string | number): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(API_ENDPOINTS.STIPENDS.DELETE_ALLOCATION(id));
  },

  /**
   * Record a stipend payment
   * 
   * Backend endpoint: POST /api/stipends/payments
   */
  recordPayment: async (data: RecordPaymentRequest): Promise<ApiResponse<StipendPayment>> => {
    return apiClient.post<StipendPayment>(API_ENDPOINTS.STIPENDS.RECORD_PAYMENT, data);
  },

  /**
   * Get payment history for a student
   * 
   * Backend endpoint: GET /api/stipends/history/:studentId
   */
  getPaymentHistory: async (
    studentId: string | number
  ): Promise<ApiResponse<StipendPayment[]>> => {
    return apiClient.get<StipendPayment[]>(API_ENDPOINTS.STIPENDS.PAYMENT_HISTORY(studentId));
  },

  /**
   * Get stipend statistics
   * 
   * Backend endpoint: GET /api/stipends/statistics
   */
  getStatistics: async (): Promise<ApiResponse<StipendStatisticsResponse>> => {
    return apiClient.get<StipendStatisticsResponse>(API_ENDPOINTS.STIPENDS.STATISTICS);
  },
};

export default stipendService;
