/**
 * Program Service
 * 
 * This service provides all program-related API calls.
 */

import { apiClient, ApiResponse } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/config/api.config';
import type { Program } from '@/types/student.types';

/**
 * Create program request
 */
export interface CreateProgramRequest {
  program_code: string;
  program_name: string;
  college_id: number;
  description?: string;
  duration_years?: number;
  total_semesters?: number;
  has_stipend: boolean;
  stipend_amount?: number;
  stipend_frequency?: 'monthly' | 'semester' | 'annual';
  requirements?: string;
  status?: 'active' | 'inactive';
}

/**
 * Program Service
 */
export const programService = {
  /**
   * Get all programs
   * 
   * Backend endpoint: GET /api/programs
   */
  getPrograms: async (): Promise<ApiResponse<Program[]>> => {
    return apiClient.get<Program[]>(API_ENDPOINTS.PROGRAMS.LIST);
  },

  /**
   * Get a single program by ID
   * 
   * Backend endpoint: GET /api/programs/:id
   */
  getProgram: async (id: string | number): Promise<ApiResponse<Program>> => {
    return apiClient.get<Program>(API_ENDPOINTS.PROGRAMS.DETAIL(id));
  },

  /**
   * Create a new program
   * 
   * Backend endpoint: POST /api/programs
   */
  createProgram: async (data: CreateProgramRequest): Promise<ApiResponse<Program>> => {
    return apiClient.post<Program>(API_ENDPOINTS.PROGRAMS.CREATE, data);
  },

  /**
   * Update an existing program
   * 
   * Backend endpoint: PUT /api/programs/:id
   */
  updateProgram: async (
    id: string | number,
    data: Partial<CreateProgramRequest>
  ): Promise<ApiResponse<Program>> => {
    return apiClient.put<Program>(API_ENDPOINTS.PROGRAMS.UPDATE(id), data);
  },

  /**
   * Delete a program
   * 
   * Backend endpoint: DELETE /api/programs/:id
   */
  deleteProgram: async (id: string | number): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(API_ENDPOINTS.PROGRAMS.DELETE(id));
  },
};

export default programService;
