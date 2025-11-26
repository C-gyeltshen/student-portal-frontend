# Unit Testing Plan for User Dashboard & Financial Officer Pages

## Overview

This document outlines the comprehensive testing strategy for the User Dashboard and Financial Officer pages using Playwright with a target code coverage of **80%**.

## Testing Framework

- **Framework**: Playwright for Next.js
- **Test Type**: Component and End-to-End (E2E) Testing
- **Coverage Target**: 80%
- **Test Runner**: Playwright Test Runner
- **Language**: TypeScript

## Dependencies Required

```json
{
  "@playwright/test": "^1.48.0",
  "@playwright/experimental-ct-react": "^1.48.0",
  "@axe-core/playwright": "^4.10.2"
}
```

## Test Structure

```
/tests
  ├── user/
  │   ├── dashboard/
  │   │   ├── page.spec.ts                    (E2E tests)
  │   │   ├── collapsible-row.spec.ts         (Component tests)
  │   │   └── vertical-nav.spec.ts            (Component tests)
  │   ├── financial-officer/
  │   │   ├── page.spec.ts                    (E2E tests)
  │   │   ├── officer-row.spec.ts             (Component tests)
  │   │   └── stat-card.spec.ts               (Component tests)
  │   └── component/
  │       └── vertical-nav.spec.ts            (Shared component tests)
  ├── fixtures/
  │   ├── students.json                       (Mock student data)
  │   └── officers.json                       (Mock officer data)
  ├── utils/
  │   └── test-helpers.ts                     (Helper functions)
  └── playwright.config.ts                    (Playwright configuration)
```

---

## 1. User Dashboard Page Tests (`/src/app/user/dashboard/page.tsx`)

### 1.1 Component Rendering Tests (15% coverage)

**Test Cases:**

- ✅ Page renders without crashing
- ✅ Header displays correct logo and title
- ✅ Stats cards render with correct initial values (Total Students, Active Colleges, Programs)
- ✅ Search bar and filter dropdown are visible
- ✅ Table headers render correctly
- ✅ Navigation sidebar is present
- ✅ Mobile menu button appears on small screens

### 1.2 Data Fetching & Loading States (15% coverage)

**Test Cases:**

- ✅ Loading spinner displays while fetching data
- ✅ API call to `http://localhost:8080/api/users/role/1` is made on mount
- ✅ Students data is correctly transformed and displayed
- ✅ Error message displays when API call fails
- ✅ Empty state shows when no students exist
- ✅ Colleges are extracted and grouped correctly

### 1.3 Search Functionality (10% coverage)

**Test Cases:**

- ✅ Search by student name filters correctly
- ✅ Search by RUB ID card number works
- ✅ Search by email filters results
- ✅ Case-insensitive search works
- ✅ Clearing search shows all students
- ✅ Search with no results shows appropriate message

### 1.4 Filter Functionality (10% coverage)

**Test Cases:**

- ✅ "All Colleges" option shows all students
- ✅ Selecting a specific college filters students
- ✅ College dropdown populates with unique colleges
- ✅ Filtered count updates correctly in stats
- ✅ Combined search and filter works together

### 1.5 Collapsible College Rows (15% coverage)

**Test Cases:**

- ✅ College row displays college name and student count
- ✅ Clicking college row toggles expansion
- ✅ Chevron icon changes direction on toggle
- ✅ Student rows display when expanded
- ✅ Student rows hide when collapsed
- ✅ Multiple colleges can be expanded simultaneously
- ✅ "Expand All" button expands all colleges
- ✅ "Collapse All" button collapses all colleges

### 1.6 Student Data Display (10% coverage)

**Test Cases:**

- ✅ Student name and initials display correctly
- ✅ RUB ID card number shows properly
- ✅ Email with icon renders
- ✅ Phone number displays (responsive)
- ✅ Program information shows
- ✅ Date of birth formats correctly
- ✅ Created date displays properly
- ✅ "View" button is clickable

### 1.7 Responsive Design (5% coverage)

**Test Cases:**

- ✅ Mobile menu opens/closes correctly
- ✅ Table columns hide appropriately on smaller screens
- ✅ Stats cards stack on mobile
- ✅ Search and filter controls adapt to mobile
- ✅ Navigation overlay works on mobile

### 1.8 Navigation (10% coverage)

**Test Cases:**

- ✅ VerticalNav component renders with correct items
- ✅ Current path highlights correct nav item
- ✅ Clicking nav items navigates to correct routes
- ✅ Mobile menu closes after navigation
- ✅ Fee Payment card is clickable

### 1.9 Export Functionality (5% coverage)

**Test Cases:**

- ✅ Export button is visible and clickable
- ✅ Export button shows appropriate icon

### 1.10 Edge Cases (5% coverage)

**Test Cases:**

- ✅ Handles students without college assignments
- ✅ Handles missing student data fields (null/undefined)
- ✅ Handles API timeout gracefully
- ✅ Handles malformed API responses
- ✅ Handles special characters in search

---

## 2. Financial Officer Page Tests (`/src/app/user/financial-officer/page.tsx`)

### 2.1 Component Rendering Tests (15% coverage)

**Test Cases:**

- ✅ Page renders without crashing
- ✅ Header displays with correct title
- ✅ "Add Officer" button is visible
- ✅ Stats cards render (Total, Active, Inactive officers)
- ✅ Search bar renders
- ✅ Export button is visible
- ✅ Table renders with correct headers
- ✅ VerticalNav component is present

### 2.2 Data Fetching & Loading States (15% coverage)

**Test Cases:**

- ✅ Loading spinner displays while fetching
- ✅ API call to `http://localhost:8082/users/role/2` is made
- ✅ Officers data is correctly mapped and displayed
- ✅ Error message displays on API failure
- ✅ Retry button works after error
- ✅ Empty state shows when no officers exist

### 2.3 Add Officer Dialog (15% coverage)

**Test Cases:**

- ✅ "Add Officer" button opens dialog
- ✅ Dialog displays with correct title and fields
- ✅ First name field accepts input
- ✅ Last name field accepts input
- ✅ Email field accepts input
- ✅ Email validation works (invalid email shows error)
- ✅ Required field validation (empty fields prevent submission)
- ✅ Close button closes dialog
- ✅ Cancel button closes dialog
- ✅ Successful creation adds officer to list
- ✅ API error displays alert message
- ✅ Loading state shows while saving

### 2.4 Edit Officer Dialog (15% coverage)

**Test Cases:**

- ✅ Edit button opens dialog with officer data
- ✅ Dialog pre-populates with existing officer data
- ✅ Email field is editable
- ✅ Phone field is editable
- ✅ Status dropdown changes value
- ✅ Update button saves changes
- ✅ Updated data reflects in table
- ✅ Cancel preserves original data

### 2.5 Officer Row Expansion (10% coverage)

**Test Cases:**

- ✅ Chevron button toggles row expansion
- ✅ Expanded row shows detailed information
- ✅ User email displays with icon
- ✅ Role ID shows correctly
- ✅ Phone number displays with icon
- ✅ User ID shows as monospace
- ✅ Created date formats correctly
- ✅ Multiple rows can be expanded independently

### 2.6 Search Functionality (10% coverage)

**Test Cases:**

- ✅ Search by email filters officers
- ✅ Search by ID works
- ✅ Search by first name filters
- ✅ Search by last name filters
- ✅ Case-insensitive search works
- ✅ Clearing search shows all officers
- ✅ No results message displays appropriately

### 2.7 Stats Calculation (10% coverage)

**Test Cases:**

- ✅ Total officers count is accurate
- ✅ Active officers count updates correctly
- ✅ Inactive officers count calculates properly
- ✅ Stats update after adding officer
- ✅ Stats update after editing officer status

### 2.8 Export Functionality (5% coverage)

**Test Cases:**

- ✅ Export button is clickable
- ✅ Export button shows correct icon and text

### 2.9 Navigation Integration (5% coverage)

**Test Cases:**

- ✅ VerticalNav highlights correct current path
- ✅ Navigation items route correctly

---

## 3. VerticalNav Component Tests (`/src/app/user/component/VerticalNav.tsx`)

### 3.1 Component Rendering (30% coverage)

**Test Cases:**

- ✅ Component renders all navigation items
- ✅ Icons render for each nav item
- ✅ Navigation titles display correctly
- ✅ Active state highlights correct item
- ✅ Inactive items show chevron icon
- ✅ Active item shows indicator dot

### 3.2 Navigation Behavior (40% coverage)

**Test Cases:**

- ✅ Clicking nav item calls router.push with correct path
- ✅ Admin Dashboard navigates to `/user/dashboard`
- ✅ Financial Officer navigates to `/user/financial-officer`
- ✅ Student Records navigates to `/dashboard/student-records`
- ✅ Active state updates based on currentPath prop

### 3.3 Mobile Functionality (20% coverage)

**Test Cases:**

- ✅ Mobile menu opens when button clicked
- ✅ Mobile menu closes when close button clicked
- ✅ Overlay dismisses menu when clicked
- ✅ Navigation closes menu after selection
- ✅ Menu slides in/out with correct animation

### 3.4 Styling & Accessibility (10% coverage)

**Test Cases:**

- ✅ Active item has correct background and ring styles
- ✅ Hover states work on inactive items
- ✅ Icons change color based on active state
- ✅ Buttons are keyboard accessible

---

## 4. CollapsibleRow Component Tests

### Test Cases (100% coverage)

- ✅ Renders college header with name
- ✅ Displays correct student count
- ✅ Toggle button expands/collapses rows
- ✅ Chevron direction changes on toggle
- ✅ Student rows render when expanded
- ✅ Student data displays correctly
- ✅ View button is clickable
- ✅ Hover effects work
- ✅ Responsive classes apply correctly

---

## 5. OfficerRow Component Tests

### Test Cases (100% coverage)

- ✅ Renders officer email
- ✅ Displays phone number
- ✅ Shows status badge with correct color
- ✅ Active status shows green badge
- ✅ Inactive status shows gray badge
- ✅ Edit button triggers onEdit callback
- ✅ Expansion toggle works
- ✅ Detailed view shows all officer info
- ✅ Icons render correctly

---

## 6. StatCard Component Tests

### Test Cases (100% coverage)

- ✅ Renders label text
- ✅ Displays value correctly
- ✅ Icon component renders
- ✅ Color variants apply correctly (blue, green, purple)
- ✅ Hover effects work
- ✅ Border and background styles apply

---

## Mock Data Setup

### Mock Students Data (`tests/fixtures/students.json`)

```json
[
  {
    "ID": 1,
    "first name": "Tenzin",
    "second name": "Dorji",
    "email": "tenzin.dorji@student.rub.edu.bt",
    "college_id": "COL001",
    "college_name": "College of Science and Technology",
    "rub_id_card_number": "12345678",
    "phone_number": "+97517123456",
    "program": "Computer Science",
    "date_of_birth": "2000-05-15",
    "created_at": "2023-08-01T10:00:00Z"
  }
]
```

### Mock Officers Data (`tests/fixtures/officers.json`)

```json
[
  {
    "id": 1,
    "firstName": "Karma",
    "lastName": "Wangchuk",
    "email": "karma.wangchuk@rub.edu.bt",
    "phone": "+97517654321",
    "role_id": 2,
    "created_at": "2023-01-15T08:30:00Z"
  }
]
```

---

## API Mocking Strategy

### 1. Mock Student API

```typescript
await page.route("**/api/users/role/1", async (route) => {
  await route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify(mockStudents),
  });
});
```

### 2. Mock Officer API (GET)

```typescript
await page.route("**/users/role/2", async (route) => {
  await route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify(mockOfficers),
  });
});
```

### 3. Mock Officer API (POST)

```typescript
await page.route("**/api/users/create/finance-officer", async (route) => {
  const request = route.request();
  const postData = JSON.parse(request.postData());

  await route.fulfill({
    status: 201,
    contentType: "application/json",
    body: JSON.stringify({
      id: 999,
      ...postData,
      created_at: new Date().toISOString(),
    }),
  });
});
```

---

## Test Implementation Guidelines

### 1. Setup Playwright Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ["html"],
    ["json", { outputFile: "test-results.json" }],
    ["junit", { outputFile: "test-results.xml" }],
  ],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "Mobile Chrome",
      use: { ...devices["Pixel 5"] },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
  },
});
```

### 2. Test Helper Functions

```typescript
// tests/utils/test-helpers.ts
import { Page } from "@playwright/test";

export async function waitForPageLoad(page: Page) {
  await page.waitForLoadState("networkidle");
}

export async function fillForm(page: Page, data: Record<string, string>) {
  for (const [field, value] of Object.entries(data)) {
    await page.fill(`input[name="${field}"]`, value);
  }
}

export async function mockStudentAPI(page: Page, data: any[]) {
  await page.route("**/api/users/role/1", (route) =>
    route.fulfill({ status: 200, body: JSON.stringify(data) })
  );
}

export async function mockOfficerAPI(page: Page, data: any[]) {
  await page.route("**/users/role/2", (route) =>
    route.fulfill({ status: 200, body: JSON.stringify(data) })
  );
}
```

---

## Coverage Breakdown Summary

| Component/Page         | Test Cases | Coverage Target |
| ---------------------- | ---------- | --------------- |
| User Dashboard Page    | 45         | 80%             |
| Financial Officer Page | 42         | 80%             |
| VerticalNav Component  | 15         | 80%             |
| CollapsibleRow         | 9          | 100%            |
| OfficerRow             | 9          | 100%            |
| StatCard               | 6          | 100%            |
| **Total**              | **126**    | **80%+**        |

---

## Execution Plan

### Phase 1: Setup (Week 1)

1. Install Playwright and dependencies
2. Configure Playwright for Next.js
3. Create mock data fixtures
4. Set up test helpers and utilities

### Phase 2: Component Tests (Week 2)

1. Write tests for StatCard component
2. Write tests for CollapsibleRow component
3. Write tests for OfficerRow component
4. Write tests for VerticalNav component

### Phase 3: Page Tests (Week 3-4)

1. Write User Dashboard page tests
   - Rendering and loading states
   - Search and filter functionality
   - Collapsible rows interaction
2. Write Financial Officer page tests
   - CRUD operations
   - Dialog interactions
   - Search functionality

### Phase 4: Integration & Coverage (Week 5)

1. Run coverage reports
2. Identify gaps and add missing tests
3. Optimize and refactor tests
4. Document test results

---

## Running Tests

### Commands

```bash
# Install dependencies
npm install --save-dev @playwright/test

# Install browsers
npx playwright install

# Run all tests
npx playwright test

# Run tests in UI mode
npx playwright test --ui

# Run specific test file
npx playwright test tests/user/dashboard/page.spec.ts

# Run tests with coverage
npx playwright test --coverage

# Generate HTML report
npx playwright show-report
```

---

## Success Criteria

- ✅ Minimum 80% code coverage achieved
- ✅ All critical user flows tested
- ✅ API mocking implemented correctly
- ✅ Tests pass consistently across browsers
- ✅ Mobile responsive tests included
- ✅ Accessibility tests integrated
- ✅ Clear test documentation
- ✅ CI/CD integration ready

---

## Continuous Integration

### GitHub Actions Workflow

```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies
        run: npm ci
      - name: Install Playwright
        run: npx playwright install --with-deps
      - name: Run tests
        run: npx playwright test
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

---

## Notes

- All tests should be independent and idempotent
- Use Page Object Model for better maintainability
- Mock all external API calls
- Test both happy paths and error scenarios
- Include accessibility tests using @axe-core/playwright
- Document any test-specific environment setup requirements

---

**Document Version**: 1.0  
**Last Updated**: November 27, 2025  
**Author**: GitHub Copilot  
**Status**: Ready for Implementation
