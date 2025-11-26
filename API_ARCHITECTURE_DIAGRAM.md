# API Architecture Diagram

## 📊 System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                   (student-dashboard/page.tsx)                  │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ Student  │  │ Stipend  │  │ Program  │  │ College  │      │
│  │   Card   │  │   Info   │  │   List   │  │  Filter  │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓ Uses
┌─────────────────────────────────────────────────────────────────┐
│                       SERVICE LAYER                             │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   student    │  │   stipend    │  │   program    │        │
│  │  .service.ts │  │  .service.ts │  │  .service.ts │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│  ┌──────────────┐                                              │
│  │   college    │  • getStudents()                             │
│  │  .service.ts │  • createStudent()                           │
│  └──────────────┘  • checkEligibility()                        │
│                    • getAllocations()                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓ Calls
┌─────────────────────────────────────────────────────────────────┐
│                        API CLIENT                               │
│                     (lib/api-client.ts)                         │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  Request Interceptor                                    │  │
│  │  • Add Authorization: Bearer <token>                    │  │
│  │  • Add Content-Type headers                             │  │
│  │  • Setup timeout                                        │  │
│  └─────────────────────────────────────────────────────────┘  │
│                          ↓                                      │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  HTTP Methods                                           │  │
│  │  • GET    • POST    • PUT    • DELETE                   │  │
│  └─────────────────────────────────────────────────────────┘  │
│                          ↓                                      │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │  Response Interceptor                                   │  │
│  │  • Parse JSON response                                  │  │
│  │  • Handle errors (401, 404, 500)                        │  │
│  │  • Standardize response format                          │  │
│  └─────────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓ Uses
┌─────────────────────────────────────────────────────────────────┐
│                    API CONFIGURATION                            │
│                   (config/api.config.ts)                        │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  BASE_URL: http://localhost:8084/api                    │ │
│  │  USE_PROXY: true                                         │ │
│  │  TIMEOUT: 30000                                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │  ENDPOINTS                                               │ │
│  │  • STUDENTS.LIST: '/students'                            │ │
│  │  • STUDENTS.DETAIL: (id) => `/students/${id}`           │ │
│  │  • STIPENDS.CHECK_ELIGIBILITY: (id) => ...              │ │
│  │  • PROGRAMS.LIST: '/programs'                            │ │
│  │  • COLLEGES.LIST: '/colleges'                            │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ↓ Targets
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND APIS (Future)                        │
│                  http://localhost:8084/api                      │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │   Student    │  │   Stipend    │  │   Program    │        │
│  │     API      │  │     API      │  │     API      │        │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│  ┌──────────────┐  ┌──────────────┐                           │
│  │   College    │  │   Reports    │                           │
│  │     API      │  │     API      │                           │
│  └──────────────┘  └──────────────┘                           │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Example: Get Students

```
1. USER ACTION
   └─> Click "View Students" in Dashboard

2. COMPONENT
   └─> student-dashboard/page.tsx
       └─> fetchData() called

3. SERVICE LAYER
   └─> studentService.getStudents({ page: 1, limit: 10 })

4. API CLIENT
   └─> apiClient.get('/students', { page: 1, limit: 10 })
       ├─> Add auth header: Authorization: Bearer <token>
       ├─> Build URL: /api/students?page=1&limit=10
       └─> Make HTTP GET request

5. BACKEND API (Future)
   └─> GET http://localhost:8084/api/students?page=1&limit=10
       └─> Returns: { data: [...], meta: { page, total, ... } }

6. RESPONSE HANDLING
   └─> API Client receives response
       ├─> Parse JSON
       ├─> Check status code
       └─> Return: { success: true, data: {...}, meta: {...} }

7. SERVICE LAYER
   └─> Returns typed response to component

8. COMPONENT
   └─> Updates state with student data
       └─> UI re-renders with new data

9. USER SEES
   └─> Updated student list on screen
```

## 🔐 Authentication Flow

```
┌──────────────┐
│   User Login │
└──────┬───────┘
       │
       ↓
┌──────────────────────────────┐
│ Store Token in localStorage  │
│ localStorage.setItem(        │
│   'authToken', token          │
│ )                            │
└──────┬───────────────────────┘
       │
       ↓
┌──────────────────────────────────────┐
│ API Client Auto-Adds Header          │
│ Every Request:                        │
│ Authorization: Bearer <token>         │
└──────┬───────────────────────────────┘
       │
       ↓
┌──────────────────────────────────────┐
│ Backend Validates Token               │
│ • Valid → Process request             │
│ • Invalid → Return 401                │
└──────┬───────────────────────────────┘
       │
       ├─> Valid ────────────────────────> Success Response
       │
       └─> 401 Unauthorized
           │
           ↓
       ┌───────────────────────┐
       │ API Client Handles    │
       │ • Clear token         │
       │ • Redirect to login   │
       └───────────────────────┘
```

## 📦 Type Safety Flow

```
┌─────────────────────────────────────────┐
│          student.types.ts               │
│                                         │
│  interface Student {                    │
│    id: number;                          │
│    first_name: string;                  │
│    last_name: string;                   │
│    email: string;                       │
│    ...                                  │
│  }                                      │
└────┬────────────────────────────────────┘
     │
     ↓ Uses
┌────────────────────────────────────────┐
│       student.service.ts               │
│                                        │
│  getStudent(id): Promise<             │
│    ApiResponse<Student>                │
│  >                                     │
└────┬───────────────────────────────────┘
     │
     ↓ Returns typed data
┌────────────────────────────────────────┐
│       Component                        │
│                                        │
│  const response = await                │
│    studentService.getStudent(123);    │
│                                        │
│  if (response.success) {               │
│    const student = response.data;     │
│    // TypeScript knows all fields!    │
│    console.log(student.first_name);   │
│  }                                     │
└────────────────────────────────────────┘
```

## 🔄 Current vs Future State

### Current State (Mock Data)
```
Frontend Component
    ↓
Next.js API Routes (/api/students/list)
    ↓
Mock Data
    ↓
Return to Frontend
```

### Future State (Real APIs)
```
Frontend Component
    ↓
Service Layer (studentService)
    ↓
API Client (apiClient)
    ↓
Backend API (http://localhost:8084/api/students)
    ↓
Database
    ↓
Response back through layers
```

## 🎯 Migration Path

```
STEP 1: Update Configuration
┌────────────────────────────┐
│ config/api.config.ts       │
│ BASE_URL = real backend    │
│ USE_PROXY = false          │
└────────────────────────────┘
            ↓
STEP 2: Test Services
┌────────────────────────────┐
│ Test each service method   │
│ Verify responses           │
│ Check error handling       │
└────────────────────────────┘
            ↓
STEP 3: Update Frontend
┌────────────────────────────┐
│ Replace mock API calls     │
│ Use service methods        │
│ Map response to UI format  │
└────────────────────────────┘
            ↓
STEP 4: Testing
┌────────────────────────────┐
│ Test all features          │
│ Verify error handling      │
│ Check edge cases           │
└────────────────────────────┘
            ↓
DONE! ✅
```

## 📊 Error Handling Flow

```
API Request
    ↓
┌───────────────┐
│ Network Call  │
└───┬───────────┘
    │
    ├─> Success (200-299)
    │   └─> Parse response
    │       └─> Return { success: true, data: {...} }
    │
    ├─> Client Error (400-499)
    │   ├─> 401 Unauthorized
    │   │   └─> Clear token & redirect to login
    │   ├─> 404 Not Found
    │   │   └─> Return { success: false, error: "Not found" }
    │   └─> Other 4xx
    │       └─> Return { success: false, error: message }
    │
    ├─> Server Error (500-599)
    │   └─> Return { success: false, error: "Server error" }
    │
    └─> Network Error
        ├─> Timeout
        │   └─> Return { success: false, error: "Request timeout" }
        └─> No Connection
            └─> Return { success: false, error: "No internet" }
```

## 🎨 Component Integration Pattern

```
┌─────────────────────────────────────────────────┐
│              Component State                    │
│  ┌────────────────────────────────────────┐    │
│  │ const [students, setStudents] = ...    │    │
│  │ const [loading, setLoading] = ...      │    │
│  │ const [error, setError] = ...          │    │
│  └────────────────────────────────────────┘    │
└──────┬──────────────────────────────────────────┘
       │
       ↓ useEffect
┌──────────────────────────────────────────────────┐
│            Fetch Function                        │
│  const fetchData = async () => {                 │
│    setLoading(true);                             │
│    try {                                         │
│      const response = await                      │
│        studentService.getStudents();             │
│                                                  │
│      if (response.success) {                     │
│        setStudents(response.data);               │
│      } else {                                    │
│        setError(response.error);                 │
│      }                                           │
│    } catch (err) {                               │
│      setError(err.message);                      │
│    } finally {                                   │
│      setLoading(false);                          │
│    }                                             │
│  }                                               │
└──────┬───────────────────────────────────────────┘
       │
       ↓ Updates state
┌──────────────────────────────────────────────────┐
│              UI Rendering                        │
│  {loading && <Spinner />}                        │
│  {error && <ErrorMessage />}                     │
│  {students.map(s => <StudentCard />)}            │
└──────────────────────────────────────────────────┘
```

## 🎯 Key Takeaways

1. **Layered Architecture**: Clear separation of concerns
2. **Type Safety**: Full TypeScript support throughout
3. **Centralized**: All API logic in one place
4. **Flexible**: Easy to switch between mock and real APIs
5. **Error Handling**: Consistent error handling at every layer
6. **Maintainable**: Changes in one layer don't affect others
7. **Documented**: Every layer is well-documented

---

**Last Updated**: November 27, 2025
