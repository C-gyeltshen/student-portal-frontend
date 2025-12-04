/**
 * Type Definitions for Student Management
 * 
 * These types match the backend API structure from the implementation guide.
 * Update these if the backend API structure changes.
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum StudentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  GRADUATED = 'graduated',
  SUSPENDED = 'suspended',
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}

export enum StipendStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  SUSPENDED = 'suspended',
  COMPLETED = 'completed',
}

export enum StipendFrequency {
  MONTHLY = 'monthly',
  SEMESTER = 'semester',
  ANNUAL = 'annual',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum PaymentMethod {
  BANK_TRANSFER = 'bank_transfer',
  CASH = 'cash',
  CHECK = 'check',
}

// ============================================================================
// CORE ENTITIES
// ============================================================================

/**
 * Student entity matching backend API
 */
export interface Student {
  id: number;
  user_id: number;
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  date_of_birth?: string;
  gender?: Gender;
  cid?: string;
  permanent_address?: string;
  current_address?: string;
  program_id?: number;
  college_id?: number;
  year_of_study?: number;
  semester?: number;
  enrollment_date?: string;
  status: StudentStatus;
  gpa?: number;
  guardian_name?: string;
  guardian_phone?: string;
  guardian_relation?: string;
  created_at: string;
  updated_at: string;
  
  // Relationships (populated when included)
  program?: Program;
  college?: College;
  user?: User;
}

/**
 * Program entity
 */
export interface Program {
  id: number;
  program_code: string;
  program_name: string;
  college_id: number;
  description?: string;
  duration_years?: number;
  total_semesters?: number;
  has_stipend: boolean;
  stipend_amount?: number;
  stipend_frequency?: StipendFrequency;
  requirements?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  
  // Relationships
  college?: College;
}

/**
 * College entity
 */
export interface College {
  id: number;
  college_code: string;
  college_name: string;
  location: string;
  description?: string;
  contact_email?: string;
  contact_phone?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

/**
 * User entity (from User Service)
 */
export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
}

/**
 * Stipend Allocation entity
 */
export interface StipendAllocation {
  id: number;
  student_id: number;
  academic_year: string;
  semester: number;
  amount: number;
  frequency: StipendFrequency;
  start_date: string;
  end_date: string;
  status: StipendStatus;
  notes?: string;
  created_at: string;
  updated_at: string;
  
  // Relationships
  student?: Student;
}

/**
 * Stipend Payment entity
 */
export interface StipendPayment {
  id: number;
  allocation_id: number;
  payment_date: string;
  amount_paid: number;
  payment_method: PaymentMethod;
  transaction_reference?: string;
  payment_status: PaymentStatus;
  notes?: string;
  created_at: string;
  
  // Relationships
  allocation?: StipendAllocation;
}

// ============================================================================
// REQUEST/RESPONSE TYPES
// ============================================================================

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page?: number;
  limit?: number;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Student list filters
 */
export interface StudentFilters extends PaginationParams {
  search?: string;
  college_id?: number;
  program_id?: number;
  status?: StudentStatus;
  year_of_study?: number;
}

/**
 * Student list response
 */
export interface StudentListResponse {
  data: Student[];
  meta: PaginationMeta;
}

/**
 * Create student request
 */
export interface CreateStudentRequest {
  user_id: number;
  student_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  date_of_birth?: string;
  gender?: Gender;
  cid?: string;
  permanent_address?: string;
  current_address?: string;
  program_id?: number;
  college_id?: number;
  year_of_study?: number;
  semester?: number;
  enrollment_date?: string;
  status?: StudentStatus;
  gpa?: number;
  guardian_name?: string;
  guardian_phone?: string;
  guardian_relation?: string;
}

/**
 * Update student request
 */
export interface UpdateStudentRequest extends Partial<CreateStudentRequest> {}

/**
 * Stipend eligibility check response
 */
export interface StipendEligibilityResponse {
  eligible: boolean;
  reason: string;
  program?: Program;
  stipend_amount?: number;
  stipend_frequency?: StipendFrequency;
}

/**
 * Stipend allocation filters
 */
export interface StipendAllocationFilters extends PaginationParams {
  student_id?: number;
  status?: StipendStatus;
  academic_year?: string;
  semester?: number;
}

/**
 * Create stipend allocation request
 */
export interface CreateStipendAllocationRequest {
  student_id: number;
  academic_year: string;
  semester: number;
  amount: number;
  frequency: StipendFrequency;
  start_date: string;
  end_date: string;
  status?: StipendStatus;
  notes?: string;
}

/**
 * Record payment request
 */
export interface RecordPaymentRequest {
  allocation_id: number;
  payment_date: string;
  amount_paid: number;
  payment_method: PaymentMethod;
  transaction_reference?: string;
  payment_status?: PaymentStatus;
  notes?: string;
}

/**
 * Stipend statistics response
 */
export interface StipendStatisticsResponse {
  total_allocations: number;
  total_amount_allocated: number;
  total_amount_disbursed: number;
  pending_allocations: number;
  active_allocations: number;
  students_receiving_stipend: number;
}

/**
 * Report filters
 */
export interface ReportFilters {
  college_id?: number;
  program_id?: number;
  status?: StudentStatus;
  academic_year?: string;
  semester?: number;
  start_date?: string;
  end_date?: string;
}

// ============================================================================
// FRONTEND-SPECIFIC TYPES (for dashboard display)
// ============================================================================

/**
 * Transaction (for frontend display)
 */
export interface Transaction {
  id: string;
  amount: number;
  date: string;
  time: string;
  reference: string;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed';
  description: string;
}

/**
 * Deduction (for frontend display)
 */
export interface Deduction {
  id: string;
  type: string;
  amount: number;
  description: string;
  date: string;
}

/**
 * Student profile (simplified for dashboard)
 */
export interface StudentProfile {
  id: string;
  name: string;
  studentNumber: string;
  program: string;
  college: string;
  status: 'active' | 'inactive';
  email: string;
  phone: string;
  address: string;
  enrollmentDate: string;
  yearLevel: string;
  gpa: number;
}

/**
 * Student with stipend info (for dashboard)
 */
export interface StudentWithStipend {
  id: string;
  name: string;
  studentId: string;
  program: string;
  college: string;
  status: 'active' | 'inactive';
  stipendReceived: boolean;
  stipendReason: string;
  stipendAmount: number;
  totalDeductions: number;
  netStipend: number;
  deductions: Deduction[];
  transactions: Transaction[];
  profile: StudentProfile;
}

/**
 * Dashboard statistics
 */
export interface DashboardStats {
  totalStudents: number;
  stipendReceived: number;
  stipendNotReceived: number;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Form state
 */
export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  isValid: boolean;
}

/**
 * API error
 */
export interface ApiErrorResponse {
  message: string;
  statusCode: number;
  details?: any;
}
