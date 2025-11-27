/**
 * API Configuration
 *
 * This file contains all API endpoint configurations.
 * When you receive real backend APIs, simply update the BASE_URL
 * and verify/adjust the endpoint paths if needed.
 */

// API Base URLs
export const API_CONFIG = {
  // Student Management Service (Port 8084)
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8084/api",

  // Finance Service (Port 8085) - for deductions and calculations
  FINANCE_URL:
    process.env.NEXT_PUBLIC_FINANCE_API_URL || "http://localhost:8085/api",

  // API Gateway (Port 8080) - use this in production
  GATEWAY_URL:
    process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8080",

  // User Service (Port 8082) - for authentication
  USER_URL: process.env.NEXT_PUBLIC_USER_API_URL || "http://localhost:8082/api",

  // Banking Service (Port 8083) - for payments
  BANKING_URL:
    process.env.NEXT_PUBLIC_BANKING_API_URL || "http://localhost:8083/api",

  // Set to false to call backend directly (recommended for development)
  USE_PROXY: false,
  PROXY_BASE_URL: "/api",

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
  // Student Management Endpoints (Student Service - Port 8084)
  STUDENTS: {
    // GET /students - Get all students with pagination and filters
    LIST: "/students",

    // GET /students/{id} - Get single student by database ID
    DETAIL: (id: string | number) => `/students/${id}`,

    // GET /students/student-id/{studentId} - Get by student ID
    BY_STUDENT_ID: (studentId: string) => `/students/student-id/${studentId}`,

    // POST /students - Create new student
    CREATE: "/students",

    // PUT /students/{id} - Update student
    UPDATE: (id: string | number) => `/students/${id}`,

    // DELETE /students/{id} - Delete student
    DELETE: (id: string | number) => `/students/${id}`,
  },

  // Program Management Endpoints
  PROGRAMS: {
    // GET /programs - Get all programs
    LIST: "/programs",

    // GET /programs/:id - Get single program
    DETAIL: (id: string | number) => `/programs/${id}`,

    // POST /programs - Create new program
    CREATE: "/programs",

    // PUT /programs/:id - Update program
    UPDATE: (id: string | number) => `/programs/${id}`,

    // DELETE /programs/:id - Delete program
    DELETE: (id: string | number) => `/programs/${id}`,
  },

  // College Management Endpoints
  COLLEGES: {
    // GET /colleges - Get all colleges
    LIST: "/colleges",

    // GET /colleges/:id - Get single college
    DETAIL: (id: string | number) => `/colleges/${id}`,

    // POST /colleges - Create new college
    CREATE: "/colleges",

    // PUT /colleges/:id - Update college
    UPDATE: (id: string | number) => `/colleges/${id}`,

    // DELETE /colleges/:id - Delete college
    DELETE: (id: string | number) => `/colleges/${id}`,
  },

  // Stipend Management Endpoints (Student Service - Port 8084)
  STIPENDS: {
    // GET /stipend/eligibility/{studentId} - Check stipend eligibility
    CHECK_ELIGIBILITY: (studentId: string | number) =>
      `/stipend/eligibility/${studentId}`,

    // GET /stipend/allocations - Get all allocations
    ALLOCATIONS: "/stipend/allocations",

    // POST /stipend/allocations - Create new allocation
    ALLOCATE: "/stipend/allocations",

    // PUT /stipend/allocations/{id} - Update allocation
    UPDATE_ALLOCATION: (id: string | number) => `/stipend/allocations/${id}`,

    // DELETE /stipend/allocations/{id} - Delete allocation
    DELETE_ALLOCATION: (id: string | number) => `/stipend/allocations/${id}`,

    // GET /stipend/history - Get payment history
    HISTORY: "/stipend/history",

    // POST /stipend/calculate - Calculate stipend with deductions
    CALCULATE: "/stipend/calculate",
  },

  // Finance Service Endpoints (Finance Service - Port 8085)
  FINANCE: {
    // Stipend Management
    CREATE_STIPEND: "/stipends",
    CALCULATE_STIPEND: "/stipends/calculate",
    GET_STIPEND: (stipendId: string | number) => `/stipends/${stipendId}`,
    STUDENT_STIPENDS: (studentId: string | number) =>
      `/students/${studentId}/stipends`,

    // Deduction Rules
    CREATE_DEDUCTION_RULE: "/deduction-rules",
    GET_DEDUCTION_RULES: "/deduction-rules",
    UPDATE_DEDUCTION_RULE: (id: string | number) => `/deduction-rules/${id}`,
    DELETE_DEDUCTION_RULE: (id: string | number) => `/deduction-rules/${id}`,

    // Reports
    DISBURSEMENT_REPORT: "/reports/disbursement",
    DEDUCTIONS_REPORT: "/reports/deductions",
    TRANSACTIONS_REPORT: "/reports/transactions",
  },

  // Report Endpoints
  REPORTS: {
    // GET /reports/students/summary - Student summary report
    STUDENT_SUMMARY: "/reports/students/summary",

    // GET /reports/stipends/statistics - Stipend statistics report
    STIPEND_STATS: "/reports/stipends/statistics",

    // GET /reports/:type/pdf - Export report as PDF
    EXPORT_PDF: (type: string) => `/reports/${type}/pdf`,

    // GET /reports/:type/csv - Export report as CSV
    EXPORT_CSV: (type: string) => `/reports/${type}/csv`,
  },

  // Authentication (if needed)
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REFRESH: "/auth/refresh",
    ME: "/auth/me",
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
