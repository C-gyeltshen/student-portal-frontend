/**
 * College Service
 * 
 * This service provides all college-related API calls.
 */

import { apiClient, ApiResponse } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/config/api.config';
import type { College } from '@/types/student.types';

/**
 * Create college request
 */
export interface CreateCollegeRequest {
  college_code: string;
  college_name: string;
  location: string;
  description?: string;
  contact_email?: string;
  contact_phone?: string;
  status?: 'active' | 'inactive';
}

/**
 * College Service
 */
export const collegeService = {
  /**
   * Get all colleges
   * 
   * Backend endpoint: GET /api/colleges
   */
  getColleges: async (): Promise<ApiResponse<College[]>> => {
    return apiClient.get<College[]>(API_ENDPOINTS.COLLEGES.LIST);
  },

  /**
   * Get a single college by ID
   * 
   * Backend endpoint: GET /api/colleges/:id
   */
  getCollege: async (id: string | number): Promise<ApiResponse<College>> => {
    return apiClient.get<College>(API_ENDPOINTS.COLLEGES.DETAIL(id));
  },

  /**
   * Create a new college
   * 
   * Backend endpoint: POST /api/colleges
   */
  createCollege: async (data: CreateCollegeRequest): Promise<ApiResponse<College>> => {
    return apiClient.post<College>(API_ENDPOINTS.COLLEGES.CREATE, data);
  },

  /**
   * Update an existing college
   * 
   * Backend endpoint: PUT /api/colleges/:id
   */
  updateCollege: async (
    id: string | number,
    data: Partial<CreateCollegeRequest>
  ): Promise<ApiResponse<College>> => {
    return apiClient.put<College>(API_ENDPOINTS.COLLEGES.UPDATE(id), data);
  },

  /**
   * Delete a college
   * 
   * Backend endpoint: DELETE /api/colleges/:id
   */
  deleteCollege: async (id: string | number): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(API_ENDPOINTS.COLLEGES.DELETE(id));
  },
};

export default collegeService;
