# API Integration Guide

This guide explains how the student-dashboard frontend is structured to work with backend APIs and how to integrate real APIs when they become available.

## 📁 Project Structure

```
src/
├── config/
│   └── api.config.ts         # API endpoint configurations
├── lib/
│   └── api-client.ts         # Centralized API client with interceptors
├── services/
│   ├── student.service.ts    # Student API calls
│   ├── stipend.service.ts    # Stipend API calls
│   ├── program.service.ts    # Program API calls
│   └── college.service.ts    # College API calls
├── types/
│   └── student.types.ts      # TypeScript type definitions
└── app/
    ├── api/                  # Next.js API routes (mock/proxy)
    └── student-dashboard/    # Frontend dashboard component
```

## 🎯 Design Principles

The API layer is designed to be:
- **Flexible**: Easy to switch between mock and real APIs
- **Type-safe**: Full TypeScript support
- **Maintainable**: Clear separation of concerns
- **Documented**: Every endpoint and type is documented

## 🔧 Current Setup

Currently, the frontend uses **Next.js API routes** as a proxy/mock layer:

```
Frontend Component → Service Layer → API Client → Next.js API Routes → (Future: Real Backend)
```

## 🚀 Integrating Real Backend APIs

When you receive the real backend APIs, follow these steps:

### Step 1: Update API Configuration

Edit `src/config/api.config.ts`:

```typescript
export const API_CONFIG = {
  // Update this to your backend URL
  BASE_URL: 'https://your-backend-api.com/api', // or http://localhost:8084/api for local
  
  // Set to false to call backend directly
  USE_PROXY: false,
  
  TIMEOUT: 30000,
};
```

### Step 2: Verify Endpoint Paths

The endpoints in `src/config/api.config.ts` are based on the backend implementation guide:

```typescript
export const API_ENDPOINTS = {
  STUDENTS: {
    LIST: '/students',                    // GET /api/students
    DETAIL: (id) => `/students/${id}`,    // GET /api/students/:id
    CREATE: '/students',                  // POST /api/students
    UPDATE: (id) => `/students/${id}`,    // PUT /api/students/:id
    DELETE: (id) => `/students/${id}`,    // DELETE /api/students/:id
    // ... more endpoints
  },
  // ... other resources
};
```

**Verify these match your actual backend endpoints!** Update them if needed.

### Step 3: Add Authentication (if required)

Edit `src/lib/api-client.ts` to customize the `getAuthToken()` function:

```typescript
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // Update this based on your auth implementation
  const token = localStorage.getItem('authToken');
  return token;
};
```

The API client automatically adds the token to all requests:
```
Authorization: Bearer <token>
```

### Step 4: Test with Real APIs

Use the services directly:

```typescript
import { studentService } from '@/services/student.service';

// Get all students
const response = await studentService.getStudents({
  page: 1,
  limit: 10,
  search: 'John'
});

if (response.success) {
  console.log(response.data);
} else {
  console.error(response.error);
}
```

### Step 5: Update Types (if needed)

If your backend response structure differs from the guide, update `src/types/student.types.ts`.

For example, if your backend returns `full_name` instead of separate `first_name` and `last_name`:

```typescript
export interface Student {
  // ... other fields
  full_name: string;  // Instead of first_name and last_name
  // ...
}
```

## 📚 API Endpoints Reference

### Student Endpoints

| Method | Endpoint | Description | Service Method |
|--------|----------|-------------|----------------|
| GET | `/api/students` | Get all students (with filters) | `studentService.getStudents()` |
| GET | `/api/students/:id` | Get single student | `studentService.getStudent(id)` |
| POST | `/api/students` | Create student | `studentService.createStudent(data)` |
| PUT | `/api/students/:id` | Update student | `studentService.updateStudent(id, data)` |
| DELETE | `/api/students/:id` | Delete student | `studentService.deleteStudent(id)` |
| GET | `/api/students/search?q=query` | Search students | `studentService.searchStudents(query)` |
| GET | `/api/students/program/:id` | Get by program | `studentService.getStudentsByProgram(id)` |
| GET | `/api/students/college/:id` | Get by college | `studentService.getStudentsByCollege(id)` |

### Stipend Endpoints

| Method | Endpoint | Description | Service Method |
|--------|----------|-------------|----------------|
| GET | `/api/stipends/check-eligibility/:id` | Check eligibility | `stipendService.checkEligibility(id)` |
| GET | `/api/stipends/allocations` | Get allocations | `stipendService.getAllocations()` |
| POST | `/api/stipends/allocate` | Create allocation | `stipendService.createAllocation(data)` |
| PUT | `/api/stipends/allocations/:id` | Update allocation | `stipendService.updateAllocation(id, data)` |
| DELETE | `/api/stipends/allocations/:id` | Delete allocation | `stipendService.deleteAllocation(id)` |
| POST | `/api/stipends/payments` | Record payment | `stipendService.recordPayment(data)` |
| GET | `/api/stipends/history/:id` | Payment history | `stipendService.getPaymentHistory(id)` |
| GET | `/api/stipends/statistics` | Get statistics | `stipendService.getStatistics()` |

### Program Endpoints

| Method | Endpoint | Description | Service Method |
|--------|----------|-------------|----------------|
| GET | `/api/programs` | Get all programs | `programService.getPrograms()` |
| GET | `/api/programs/:id` | Get single program | `programService.getProgram(id)` |
| POST | `/api/programs` | Create program | `programService.createProgram(data)` |
| PUT | `/api/programs/:id` | Update program | `programService.updateProgram(id, data)` |
| DELETE | `/api/programs/:id` | Delete program | `programService.deleteProgram(id)` |

### College Endpoints

| Method | Endpoint | Description | Service Method |
|--------|----------|-------------|----------------|
| GET | `/api/colleges` | Get all colleges | `collegeService.getColleges()` |
| GET | `/api/colleges/:id` | Get single college | `collegeService.getCollege(id)` |
| POST | `/api/colleges` | Create college | `collegeService.createCollege(data)` |
| PUT | `/api/colleges/:id` | Update college | `collegeService.updateCollege(id, data)` |
| DELETE | `/api/colleges/:id` | Delete college | `collegeService.deleteCollege(id)` |

## 💡 Usage Examples

### Example 1: Fetch and Display Students

```typescript
'use client';

import { useEffect, useState } from 'react';
import { studentService } from '@/services/student.service';
import type { Student } from '@/types/student.types';

export default function StudentList() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await studentService.getStudents({
        page: 1,
        limit: 20,
        status: 'active'
      });

      if (response.success && response.data) {
        setStudents(response.data.data);
      } else {
        setError(response.error || 'Failed to fetch students');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {students.map(student => (
        <div key={student.id}>
          {student.first_name} {student.last_name}
        </div>
      ))}
    </div>
  );
}
```

### Example 2: Create a New Student

```typescript
import { studentService } from '@/services/student.service';
import type { CreateStudentRequest } from '@/types/student.types';

const handleSubmit = async (formData: CreateStudentRequest) => {
  try {
    const response = await studentService.createStudent(formData);
    
    if (response.success) {
      console.log('Student created:', response.data);
      // Show success message
      // Redirect or refresh list
    } else {
      console.error('Error:', response.error);
      // Show error message
    }
  } catch (error) {
    console.error('Failed to create student:', error);
  }
};
```

### Example 3: Check Stipend Eligibility

```typescript
import { studentService } from '@/services/student.service';

const checkEligibility = async (studentId: number) => {
  try {
    const response = await studentService.checkStipendEligibility(studentId);
    
    if (response.success && response.data) {
      const { eligible, reason, stipend_amount } = response.data;
      
      if (eligible) {
        console.log(`Eligible for Nu. ${stipend_amount}`);
      } else {
        console.log(`Not eligible: ${reason}`);
      }
    }
  } catch (error) {
    console.error('Error checking eligibility:', error);
  }
};
```

## 🔍 Error Handling

The API client provides consistent error handling:

```typescript
import { studentService } from '@/services/student.service';
import { ApiError } from '@/lib/api-client';

try {
  const response = await studentService.getStudents();
  
  if (response.success) {
    // Handle success
  } else {
    // Handle API error
    console.error(response.error);
  }
} catch (error) {
  if (error instanceof ApiError) {
    // Handle specific API errors
    switch (error.statusCode) {
      case 401:
        // Unauthorized - redirect to login
        break;
      case 404:
        // Not found
        break;
      case 500:
        // Server error
        break;
      default:
        console.error(error.message);
    }
  }
}
```

## 🔒 Authentication Flow

When you implement authentication:

1. Store the JWT token after login:
```typescript
localStorage.setItem('authToken', token);
```

2. The API client automatically includes it in all requests:
```typescript
Authorization: Bearer <token>
```

3. On 401 errors, the interceptor can redirect to login:
```typescript
// In src/lib/api-client.ts
if (error.response?.status === 401) {
  localStorage.removeItem('authToken');
  window.location.href = '/login';
}
```

## 🧪 Testing with Mock Data

During development, you can keep using Next.js API routes:

1. Keep `USE_PROXY: true` in config
2. Implement your mock logic in `src/app/api/` routes
3. Services will continue to work without changes

## 📝 Type Safety

All API calls are fully typed:

```typescript
// TypeScript will validate your requests
const response = await studentService.createStudent({
  user_id: 1,
  student_id: "11901234",
  first_name: "Tshering",
  last_name: "Dorji",
  email: "tshering@student.edu.bt",
  // TypeScript will error if required fields are missing
});

// TypeScript will provide autocomplete for response
if (response.success && response.data) {
  const student = response.data;
  console.log(student.first_name); // ✅ Autocomplete works
  console.log(student.invalid);     // ❌ TypeScript error
}
```

## 🎨 Frontend Components

The student-dashboard component (`src/app/student-dashboard/page.tsx`) currently uses mock data. When integrating real APIs:

1. **Replace the fetchData function** to use the services:

```typescript
const fetchData = async () => {
  try {
    setLoading(true);
    
    // Use real API services
    const studentsResponse = await studentService.getStudents();
    
    if (studentsResponse.success && studentsResponse.data) {
      // Process and set data
      setStudentsData(studentsResponse.data.data);
    }
  } catch (error) {
    console.error('Error:', error);
    // Handle error
  } finally {
    setLoading(false);
  }
};
```

2. **Keep the UI components unchanged** - they just need properly formatted data

## 🌐 Environment Variables

Create `.env.local` for development:

```bash
# Backend API URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:8084/api

# Or for production
# NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com/api
```

Access in code:
```typescript
process.env.NEXT_PUBLIC_API_BASE_URL
```

## 📦 Available Services

- `studentService` - Student operations
- `stipendService` - Stipend operations
- `programService` - Program operations
- `collegeService` - College operations

Import and use:
```typescript
import { studentService } from '@/services/student.service';
import { stipendService } from '@/services/stipend.service';
import { programService } from '@/services/program.service';
import { collegeService } from '@/services/college.service';
```

## 🚨 Important Notes

1. **Don't modify the frontend UI** unless necessary
2. **All API changes should be in the service layer**
3. **The API client handles auth, errors, and timeouts automatically**
4. **Types ensure compile-time safety**
5. **Services are documented and ready to use**

## 🔗 Related Documentation

- `FRONTEND_IMPLEMENTATION_GUIDE.md` - Complete backend API specification
- `src/config/api.config.ts` - Endpoint configurations
- `src/lib/api-client.ts` - API client implementation
- `src/types/student.types.ts` - Type definitions

## 📞 Support

When integrating real APIs, if you encounter issues:

1. Check endpoint URLs in `api.config.ts`
2. Verify response structure matches types
3. Check browser network tab for actual requests
4. Review error messages from API client

---

**Last Updated**: November 27, 2025
