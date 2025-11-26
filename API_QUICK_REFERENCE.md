# API Quick Reference

Quick reference for all available API endpoints and how to use them.

## 🔑 Authentication

All API requests require authentication header (except login):
```
Authorization: Bearer <your-jwt-token>
```

## 📊 Student APIs

### Get All Students
```typescript
const response = await studentService.getStudents({
  page: 1,
  limit: 10,
  search: 'john',          // Optional: search by name, ID, or email
  college_id: 2,           // Optional: filter by college
  program_id: 5,           // Optional: filter by program
  status: 'active'         // Optional: active, inactive, graduated, suspended
});
```
**Backend:** `GET /api/students?page=1&limit=10&search=john&college_id=2`

### Get Single Student
```typescript
const response = await studentService.getStudent(123);
```
**Backend:** `GET /api/students/123`

### Create Student
```typescript
const response = await studentService.createStudent({
  user_id: 1,                           // Required
  student_id: "11901234",               // Required
  first_name: "Tshering",               // Required
  last_name: "Dorji",                   // Required
  email: "tshering@student.edu.bt",     // Required
  phone_number: "+97517123456",         // Optional
  program_id: 5,                        // Optional
  college_id: 2,                        // Optional
  year_of_study: 2,                     // Optional
  status: 'active'                      // Optional
});
```
**Backend:** `POST /api/students`

### Update Student
```typescript
const response = await studentService.updateStudent(123, {
  gpa: 3.8,
  year_of_study: 3,
  status: 'active'
});
```
**Backend:** `PUT /api/students/123`

### Delete Student
```typescript
const response = await studentService.deleteStudent(123);
```
**Backend:** `DELETE /api/students/123`

### Search Students
```typescript
const response = await studentService.searchStudents('Tshering');
```
**Backend:** `GET /api/students/search?q=Tshering`

### Get Students by Program
```typescript
const response = await studentService.getStudentsByProgram(5);
```
**Backend:** `GET /api/students/program/5`

### Get Students by College
```typescript
const response = await studentService.getStudentsByCollege(2);
```
**Backend:** `GET /api/students/college/2`

---

## 💰 Stipend APIs

### Check Stipend Eligibility
```typescript
const response = await stipendService.checkEligibility(123);
// Returns: { eligible, reason, program, stipend_amount, stipend_frequency }
```
**Backend:** `GET /api/stipends/check-eligibility/123`

### Get Stipend Allocations
```typescript
const response = await stipendService.getAllocations({
  student_id: 123,         // Optional
  status: 'active',        // Optional: pending, active, suspended, completed
  academic_year: '2024',   // Optional
  semester: 1,             // Optional
  page: 1,
  limit: 10
});
```
**Backend:** `GET /api/stipends/allocations?student_id=123&status=active`

### Create Stipend Allocation
```typescript
const response = await stipendService.createAllocation({
  student_id: 123,
  academic_year: '2024',
  semester: 1,
  amount: 15000,
  frequency: 'monthly',      // monthly, semester, annual
  start_date: '2024-01-01',
  end_date: '2024-06-30',
  status: 'active',          // Optional
  notes: 'Regular stipend'   // Optional
});
```
**Backend:** `POST /api/stipends/allocate`

### Update Stipend Allocation
```typescript
const response = await stipendService.updateAllocation(456, {
  status: 'suspended',
  notes: 'Academic probation'
});
```
**Backend:** `PUT /api/stipends/allocations/456`

### Delete Stipend Allocation
```typescript
const response = await stipendService.deleteAllocation(456);
```
**Backend:** `DELETE /api/stipends/allocations/456`

### Record Payment
```typescript
const response = await stipendService.recordPayment({
  allocation_id: 456,
  payment_date: '2024-02-01',
  amount_paid: 15000,
  payment_method: 'bank_transfer',  // bank_transfer, cash, check
  transaction_reference: 'TXN123456',
  payment_status: 'completed',      // pending, completed, failed
  notes: 'February payment'
});
```
**Backend:** `POST /api/stipends/payments`

### Get Payment History
```typescript
const response = await stipendService.getPaymentHistory(123);
```
**Backend:** `GET /api/stipends/history/123`

### Get Stipend Statistics
```typescript
const response = await stipendService.getStatistics();
// Returns: total_allocations, total_amount_allocated, total_amount_disbursed, etc.
```
**Backend:** `GET /api/stipends/statistics`

---

## 🎓 Program APIs

### Get All Programs
```typescript
const response = await programService.getPrograms();
```
**Backend:** `GET /api/programs`

### Get Single Program
```typescript
const response = await programService.getProgram(5);
```
**Backend:** `GET /api/programs/5`

### Create Program
```typescript
const response = await programService.createProgram({
  program_code: "CS101",
  program_name: "Computer Science",
  college_id: 2,
  description: "Bachelor of Computer Science",
  duration_years: 4,
  total_semesters: 8,
  has_stipend: true,
  stipend_amount: 15000,
  stipend_frequency: 'monthly',
  status: 'active'
});
```
**Backend:** `POST /api/programs`

### Update Program
```typescript
const response = await programService.updateProgram(5, {
  stipend_amount: 18000,
  status: 'active'
});
```
**Backend:** `PUT /api/programs/5`

### Delete Program
```typescript
const response = await programService.deleteProgram(5);
```
**Backend:** `DELETE /api/programs/5`

---

## 🏫 College APIs

### Get All Colleges
```typescript
const response = await collegeService.getColleges();
```
**Backend:** `GET /api/colleges`

### Get Single College
```typescript
const response = await collegeService.getCollege(2);
```
**Backend:** `GET /api/colleges/2`

### Create College
```typescript
const response = await collegeService.createCollege({
  college_code: "CNR",
  college_name: "College of Natural Resources",
  location: "Lobesa, Punakha",
  description: "College of Natural Resources",
  contact_email: "cnr@rub.edu.bt",
  contact_phone: "+97502366535",
  status: 'active'
});
```
**Backend:** `POST /api/colleges`

### Update College
```typescript
const response = await collegeService.updateCollege(2, {
  contact_email: "new.email@rub.edu.bt"
});
```
**Backend:** `PUT /api/colleges/2`

### Delete College
```typescript
const response = await collegeService.deleteCollege(2);
```
**Backend:** `DELETE /api/colleges/2`

---

## 📋 Response Format

All API responses follow this format:

```typescript
{
  success: boolean,
  data?: any,           // The actual response data
  error?: string,       // Error message if failed
  message?: string,     // Success message
  meta?: {             // For paginated responses
    page: number,
    limit: number,
    total: number,
    totalPages: number
  }
}
```

### Success Response Example
```typescript
{
  "success": true,
  "data": {
    "id": 123,
    "first_name": "Tshering",
    "last_name": "Dorji",
    "email": "tshering@student.edu.bt"
  },
  "message": "Student created successfully"
}
```

### Error Response Example
```typescript
{
  "success": false,
  "error": "Student not found",
  "message": "The requested student does not exist"
}
```

### Paginated Response Example
```typescript
{
  "success": true,
  "data": [
    { /* student 1 */ },
    { /* student 2 */ }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

---

## 🔧 Configuration

### Switch to Real Backend

Edit `src/config/api.config.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8084/api',  // Your backend URL
  USE_PROXY: false,                       // Set to false for real backend
  TIMEOUT: 30000,
};
```

### Environment Variables

Create `.env.local`:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8084/api
```

---

## 🚨 Error Handling

### Check Response Success
```typescript
const response = await studentService.getStudents();

if (response.success) {
  // Success - use response.data
  console.log(response.data);
} else {
  // Error - use response.error
  console.error(response.error);
}
```

### Try-Catch for Network Errors
```typescript
try {
  const response = await studentService.getStudents();
  // Handle response
} catch (error) {
  console.error('Network error:', error);
}
```

### Handle Specific Error Codes
```typescript
import { ApiError } from '@/lib/api-client';

try {
  const response = await studentService.getStudent(123);
} catch (error) {
  if (error instanceof ApiError) {
    switch (error.statusCode) {
      case 401: // Unauthorized
        // Redirect to login
        break;
      case 404: // Not found
        // Show not found message
        break;
      case 500: // Server error
        // Show error message
        break;
    }
  }
}
```

---

## 📚 Import Statements

```typescript
// Import services
import { studentService } from '@/services/student.service';
import { stipendService } from '@/services/stipend.service';
import { programService } from '@/services/program.service';
import { collegeService } from '@/services/college.service';

// Import types
import type {
  Student,
  StudentFilters,
  CreateStudentRequest,
  StipendAllocation,
  Program,
  College
} from '@/types/student.types';

// Import API client (if needed)
import { apiClient, ApiError } from '@/lib/api-client';
```

---

## ✅ Testing Checklist

When integrating real APIs:

- [ ] Update `API_CONFIG.BASE_URL` in `src/config/api.config.ts`
- [ ] Set `USE_PROXY: false`
- [ ] Verify all endpoints return expected data structure
- [ ] Test authentication flow
- [ ] Test error handling (401, 404, 500)
- [ ] Test pagination
- [ ] Test filters and search
- [ ] Test create/update/delete operations
- [ ] Verify types match backend responses

---

**Last Updated**: November 27, 2025
