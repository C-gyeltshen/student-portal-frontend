/**
 * Student Service
 * 
 * This service provides all student-related API calls.
 * It acts as an abstraction layer between the frontend and backend APIs.
 * 
 * IMPORTANT: When you receive real backend APIs:
 * 1. Update API_CONFIG.BASE_URL in src/config/api.config.ts
 * 2. Set API_CONFIG.USE_PROXY to false if calling backend directly
 * 3. Verify endpoint paths match your backend (they should based on the guide)
 * 4. Update types if the backend response structure differs
 */

import { apiClient, ApiResponse } from '@/lib/api-client';
import { API_ENDPOINTS } from '@/config/api.config';
import type {
  Student,
  StudentListResponse,
  StudentFilters,
  CreateStudentRequest,
  UpdateStudentRequest,
  StipendEligibilityResponse,
} from '@/types/student.types';

/**
 * Student Service
 */
export const studentService = {
  /**
   * Get all students with pagination and filters
   * 
   * Backend endpoint: GET /api/students
   * Query params: page, limit, search, college_id, program_id, status
   * 
   * @example
   * const response = await studentService.getStudents({ 
   *   page: 1, 
   *   limit: 10, 
   *   search: 'John',
   *   program_id: 5
   * });
   */
  getStudents: async (filters?: StudentFilters): Promise<ApiResponse<StudentListResponse>> => {
    return apiClient.get<StudentListResponse>(API_ENDPOINTS.STUDENTS.LIST, filters);
  },

  /**
   * Get a single student by ID
   * 
   * Backend endpoint: GET /api/students/:id
   * 
   * @example
   * const response = await studentService.getStudent(123);
   */
  getStudent: async (id: string | number): Promise<ApiResponse<Student>> => {
    return apiClient.get<Student>(API_ENDPOINTS.STUDENTS.DETAIL(id));
  },

  /**
   * Create a new student
   * 
   * Backend endpoint: POST /api/students
   * 
   * @example
   * const newStudent = {
   *   user_id: 1,
   *   student_id: "11901234",
   *   first_name: "Tshering",
   *   last_name: "Dorji",
   *   email: "tshering@student.edu.bt",
   *   program_id: 5,
   *   college_id: 2
   * };
   * const response = await studentService.createStudent(newStudent);
   */
  createStudent: async (data: CreateStudentRequest): Promise<ApiResponse<Student>> => {
    return apiClient.post<Student>(API_ENDPOINTS.STUDENTS.CREATE, data);
  },

  /**
   * Update an existing student
   * 
   * Backend endpoint: PUT /api/students/:id
   * 
   * @example
   * const updates = { gpa: 3.8, status: 'active' };
   * const response = await studentService.updateStudent(123, updates);
   */
  updateStudent: async (
    id: string | number,
    data: UpdateStudentRequest
  ): Promise<ApiResponse<Student>> => {
    return apiClient.put<Student>(API_ENDPOINTS.STUDENTS.UPDATE(id), data);
  },

  /**
   * Delete a student
   * 
   * Backend endpoint: DELETE /api/students/:id
   * 
   * @example
   * const response = await studentService.deleteStudent(123);
   */
  deleteStudent: async (id: string | number): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(API_ENDPOINTS.STUDENTS.DELETE(id));
  },

  /**
   * Search students by query
   * 
   * Backend endpoint: GET /api/students/search?q=query
   * 
   * @example
   * const response = await studentService.searchStudents('Tshering');
   */
  searchStudents: async (query: string): Promise<ApiResponse<Student[]>> => {
    return apiClient.get<Student[]>(API_ENDPOINTS.STUDENTS.SEARCH, { q: query });
  },

  /**
   * Get students by program ID
   * 
   * Backend endpoint: GET /api/students/program/:programId
   * 
   * @example
   * const response = await studentService.getStudentsByProgram(5);
   */
  getStudentsByProgram: async (programId: string | number): Promise<ApiResponse<Student[]>> => {
    return apiClient.get<Student[]>(API_ENDPOINTS.STUDENTS.BY_PROGRAM(programId));
  },

  /**
   * Get students by college ID
   * 
   * Backend endpoint: GET /api/students/college/:collegeId
   * 
   * @example
   * const response = await studentService.getStudentsByCollege(2);
   */
  getStudentsByCollege: async (collegeId: string | number): Promise<ApiResponse<Student[]>> => {
    return apiClient.get<Student[]>(API_ENDPOINTS.STUDENTS.BY_COLLEGE(collegeId));
  },

  /**
   * Check stipend eligibility for a student
   * 
   * Backend endpoint: GET /api/stipends/check-eligibility/:studentId
   * 
   * @example
   * const response = await studentService.checkStipendEligibility(123);
   */
  checkStipendEligibility: async (
    studentId: string | number
  ): Promise<ApiResponse<StipendEligibilityResponse>> => {
    return apiClient.get<StipendEligibilityResponse>(
      API_ENDPOINTS.STIPENDS.CHECK_ELIGIBILITY(studentId)
    );
  },
};

export default studentService;
