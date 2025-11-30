/**
 * API Configuration
 * 
 * This file contains all API endpoint configurations.
 * When you receive real backend APIs, simply update the BASE_URL
 * and verify/adjust the endpoint paths if needed.
 */

// API Base URLs
export const API_CONFIG = {
  // Update this when you get the real backend URL
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8084/api',
  
  // Alternative: Use Next.js API routes as proxy (current setup)
  USE_PROXY: true,
  PROXY_BASE_URL: '/api',
  
  // Timeout configuration
  TIMEOUT: 30000, // 30 seconds
};

/**
 * API Endpoints
 * 
 * Organized by feature/resource
 * These paths match the backend API structure from the guide
 */
export const API_ENDPOINTS = {
  // Student Management Endpoints
  STUDENTS: {
    // GET /students - Get all students with pagination and filters
    // Query params: page, limit, search, college_id, program_id, status
    LIST: '/students',
    
    // GET /students/:id - Get single student by ID
    DETAIL: (id: string | number) => `/students/${id}`,
    
    // POST /students - Create new student
    CREATE: '/students',
    
    // PUT /students/:id - Update student
    UPDATE: (id: string | number) => `/students/${id}`,
    
    // DELETE /students/:id - Delete student
    DELETE: (id: string | number) => `/students/${id}`,
    
    // GET /students/search?q=query - Search students
    SEARCH: '/students/search',
    
    // GET /students/program/:programId - Get students by program
    BY_PROGRAM: (programId: string | number) => `/students/program/${programId}`,
    
    // GET /students/college/:collegeId - Get students by college
    BY_COLLEGE: (collegeId: string | number) => `/students/college/${collegeId}`,
  },
  
  // Program Management Endpoints
  PROGRAMS: {
    // GET /programs - Get all programs
    LIST: '/programs',
    
    // GET /programs/:id - Get single program
    DETAIL: (id: string | number) => `/programs/${id}`,
    
    // POST /programs - Create new program
    CREATE: '/programs',
    
    // PUT /programs/:id - Update program
    UPDATE: (id: string | number) => `/programs/${id}`,
    
    // DELETE /programs/:id - Delete program
    DELETE: (id: string | number) => `/programs/${id}`,
  },
  
  // College Management Endpoints
  COLLEGES: {
    // GET /colleges - Get all colleges
    LIST: '/colleges',
    
    // GET /colleges/:id - Get single college
    DETAIL: (id: string | number) => `/colleges/${id}`,
    
    // POST /colleges - Create new college
    CREATE: '/colleges',
    
    // PUT /colleges/:id - Update college
    UPDATE: (id: string | number) => `/colleges/${id}`,
    
    // DELETE /colleges/:id - Delete college
    DELETE: (id: string | number) => `/colleges/${id}`,
  },
  
  // Stipend Management Endpoints
  STIPENDS: {
    // GET /stipends/check-eligibility/:studentId - Check stipend eligibility
    CHECK_ELIGIBILITY: (studentId: string | number) => `/stipends/check-eligibility/${studentId}`,
    
    // GET /stipends/allocations - Get all allocations with filters
    // Query params: student_id, status, academic_year, semester
    ALLOCATIONS: '/stipends/allocations',
    
    // POST /stipends/allocate - Create new allocation
    ALLOCATE: '/stipends/allocate',
    
    // PUT /stipends/allocations/:id - Update allocation
    UPDATE_ALLOCATION: (id: string | number) => `/stipends/allocations/${id}`,
    
    // DELETE /stipends/allocations/:id - Delete allocation
    DELETE_ALLOCATION: (id: string | number) => `/stipends/allocations/${id}`,
    
    // POST /stipends/payments - Record a payment
    RECORD_PAYMENT: '/stipends/payments',
    
    // GET /stipends/history/:studentId - Get payment history for student
    PAYMENT_HISTORY: (studentId: string | number) => `/stipends/history/${studentId}`,
    
    // GET /stipends/statistics - Get stipend statistics
    STATISTICS: '/stipends/statistics',
  },
  
  // Report Endpoints
  REPORTS: {
    // GET /reports/students/summary - Student summary report
    STUDENT_SUMMARY: '/reports/students/summary',
    
    // GET /reports/stipends/statistics - Stipend statistics report
    STIPEND_STATS: '/reports/stipends/statistics',
    
    // GET /reports/:type/pdf - Export report as PDF
    EXPORT_PDF: (type: string) => `/reports/${type}/pdf`,
    
    // GET /reports/:type/csv - Export report as CSV
    EXPORT_CSV: (type: string) => `/reports/${type}/csv`,
  },
  
  // Authentication (if needed)
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
};

/**
 * Get the full API URL based on configuration
 */
export const getApiUrl = (endpoint: string): string => {
  if (API_CONFIG.USE_PROXY) {
    return `${API_CONFIG.PROXY_BASE_URL}${endpoint}`;
  }
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

export default API_ENDPOINTS;
