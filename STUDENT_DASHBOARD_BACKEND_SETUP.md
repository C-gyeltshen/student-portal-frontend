# Student Dashboard Backend Integration Guide

This guide explains how to connect the student dashboard to your backend API.

## Current Status

✅ **Frontend is Ready!** The student dashboard has been updated to fetch data from the backend API.

## Quick Setup Steps

### 1. Configure Backend URL

Update the backend URL in your `.env.local` file:

```bash
# Create or edit .env.local in the project root
NEXT_PUBLIC_API_BASE_URL=http://localhost:8084/api
```

Or if your backend is deployed:

```bash
NEXT_PUBLIC_API_BASE_URL=https://your-backend-api.com/api
```

### 2. Set Student ID

Currently, the dashboard uses a hardcoded student ID. You need to replace it with the actual logged-in student's ID.

**Option A: From Authentication Context (Recommended)**

```typescript
// In src/app/student-dashboard/page.tsx
// Replace line 73:
const STUDENT_ID = 1; // ❌ Remove this

// With:
const { user } = useAuth(); // ✅ Get from auth context
const STUDENT_ID = user?.student_id;
```

**Option B: From URL Parameters**

```typescript
// In src/app/student-dashboard/page.tsx
import { useSearchParams } from "next/navigation";

const searchParams = useSearchParams();
const STUDENT_ID = searchParams.get("studentId");
```

**Option C: From Route Parameters**

If you change the route to `/student-dashboard/[studentId]`:

```typescript
// In src/app/student-dashboard/[studentId]/page.tsx
export default function StudentDashboard({
  params,
}: {
  params: { studentId: string };
}) {
  const STUDENT_ID = params.studentId;
  // ... rest of code
}
```

### 3. Test the Backend Connection

1. Start your backend server (should be running on port 8084)
2. Start the frontend: `npm run dev`
3. Navigate to http://localhost:3000/student-dashboard
4. Check browser console for any API errors

## Required Backend Endpoints

The dashboard needs these endpoints to work properly:

### 1. Get Student Details

```
GET /api/students/:id
```

**Response:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "student_id": "02230311",
    "first_name": "Tshering",
    "last_name": "Wangpo Dorji",
    "email": "02230311.cst@rub.edu.bt",
    "phone_number": "+975-17263253",
    "current_address": "Paro, Bhutan",
    "enrollment_date": "2021-06-15",
    "status": "active",
    "year_of_study": 2,
    "gpa": 3.62,
    "program": {
      "program_name": "BE. Software Engineering"
    },
    "college": {
      "college_name": "CST"
    }
  }
}
```

### 2. Get Stipend Allocations

```
GET /api/stipends/allocations?student_id={studentId}
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "student_id": 1,
      "academic_year": "2024",
      "semester": 1,
      "amount": 5000,
      "status": "active",
      "start_date": "2024-01-01",
      "end_date": "2024-06-30"
    }
  ]
}
```

### 3. Get Payment History

```
GET /api/stipends/history/:studentId
```

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "allocation_id": 1,
      "payment_date": "2024-02-01T11:05:00Z",
      "amount_paid": 4820,
      "payment_method": "bank_transfer",
      "transaction_reference": "TXN001240",
      "payment_status": "completed",
      "notes": "Stipend payment for January 2024"
    }
  ]
}
```

## Fallback Behavior

If the backend is not available, the dashboard will:

1. Show an error message
2. Automatically fall back to mock data for development
3. Allow users to retry the connection

## Data Transformation

The dashboard automatically transforms backend data to the display format:

| Backend Field                            | Dashboard Field                     |
| ---------------------------------------- | ----------------------------------- |
| `first_name + last_name`                 | `name`                              |
| `student_id`                             | `studentNumber`                     |
| `program.program_name`                   | `program`                           |
| `college.college_name`                   | `college`                           |
| `year_of_study`                          | `yearLevel` (formatted as "Year X") |
| `current_address` or `permanent_address` | `address`                           |

## Adding Deductions Support

Currently, deductions are not implemented in the backend. To add support:

1. Create a deductions table in your backend
2. Add a deductions endpoint:
   ```
   GET /api/students/:studentId/deductions
   ```
3. Update the dashboard to fetch deductions:
   ```typescript
   // In fetchStudentData function, add:
   const deductionsResponse = await fetch(
     `${API_URL}/students/${STUDENT_ID}/deductions`
   );
   const deductions = await deductionsResponse.json();
   ```

## Troubleshooting

### CORS Errors

If you see CORS errors, update your backend to allow requests from `http://localhost:3000`:

```javascript
// In your backend (Express example)
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
```

### Network Errors

Check that:

- ✅ Backend is running on port 8084
- ✅ Frontend is running on port 3000
- ✅ `.env.local` has correct `NEXT_PUBLIC_API_BASE_URL`
- ✅ Firewall is not blocking connections

### Data Format Errors

If data doesn't display correctly:

1. Check browser console for error messages
2. Verify backend response matches expected format
3. Update `transformStudentData` function if needed

## Testing Checklist

- [ ] Student profile displays correctly
- [ ] Email, phone, address show real data
- [ ] Stipend amount displays from backend
- [ ] Transaction history shows payment records
- [ ] Status badges (Active/Inactive) are accurate
- [ ] GPA and year level display correctly
- [ ] Error handling works when backend is down
- [ ] Loading state appears while fetching data

## Next Steps

1. **Authentication**: Integrate with your auth system to get the logged-in student's ID
2. **Deductions**: Add backend API for student deductions
3. **Real-time Updates**: Consider adding WebSocket support for live updates
4. **Caching**: Add React Query or SWR for better data management
5. **Pagination**: Add pagination if transaction history is long

## Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify backend API responses match expected format
3. Check network tab in DevTools to see actual API calls
4. Review the `transformStudentData` function for data mapping issues

## File Structure

```
src/
├── app/
│   └── student-dashboard/
│       └── page.tsx               # Main dashboard component (UPDATED)
├── config/
│   └── api.config.ts             # API configuration
├── lib/
│   └── api-client.ts             # API client with error handling
├── services/
│   ├── student.service.ts        # Student API calls
│   └── stipend.service.ts        # Stipend API calls
└── types/
    └── student.types.ts          # TypeScript types
```

---

**Pro Tip**: Start with a single student's data to verify the connection works, then expand to handle multiple students and edge cases.
