# Use Case Documentation: Student Portal Frontend

## 1. User Dashboard - Student Records Management

### Overview

The User Dashboard is a comprehensive student records management system designed for administrators to view, search, filter, and manage student information across multiple colleges within the Royal University of Bhutan (RUB) system.

### Primary Actors

- **System Administrator**: Primary user who manages and oversees student records
- **College Administrators**: Secondary users who may need access to their college's student data

### Key Features

#### 1.1 Student Data Visualization

**Use Case**: View all students grouped by college

- **Description**: The system displays students organized by their respective colleges with expandable/collapsible sections
- **Preconditions**: User must be authenticated as an administrator
- **Main Flow**:
  1. User navigates to `/user/dashboard`
  2. System fetches all users with role_id = 1 (students) from API endpoint `http://localhost:8080/api/users/role/1`
  3. System groups students by college affiliation
  4. System displays college headers with student count
  5. User can click on college header to expand/collapse student list
- **Data Displayed**:
  - Student name (first name + second name)
  - RUB ID card number
  - Email address
  - Phone number
  - Program of study
  - Date of birth
  - Enrollment date (created_at)
- **Business Value**: Provides centralized view of all student records for administrative oversight

#### 1.2 Advanced Search and Filtering

**Use Case**: Search and filter student records

- **Description**: Administrators can search students by multiple criteria and filter by college
- **Main Flow**:
  1. User enters search term in search box
  2. System filters students by:
     - Student name (case-insensitive)
     - RUB ID card number
     - Email address
  3. User can additionally select college from dropdown filter
  4. System displays only matching students
- **Search Characteristics**:
  - Real-time search (updates as user types)
  - Case-insensitive matching
  - Multiple field search simultaneously
  - Combinable with college filter
- **Business Value**: Enables quick access to specific student records from large datasets

#### 1.3 Data Aggregation and Statistics

**Use Case**: View statistical overview of student enrollment

- **Description**: Dashboard displays key metrics about student population
- **Statistics Provided**:
  - **Total Students**: Count of all students in the system
  - **Active Colleges**: Number of colleges with enrolled students
  - **Programs**: Unique count of academic programs
- **Visual Design**: Color-coded stat cards with icons for quick recognition
- **Business Value**: Provides at-a-glance insights into enrollment distribution

#### 1.4 Bulk Operations

**Use Case**: Manage multiple college sections simultaneously

- **Description**: Users can expand or collapse all college sections at once
- **Actions Available**:
  - **Expand All**: Opens all college sections to view all students
  - **Collapse All**: Closes all sections for overview mode
  - **Export**: Downloads student data (CSV format)
- **Business Value**: Improves efficiency when reviewing large datasets

#### 1.5 Responsive Navigation

**Use Case**: Navigate between different administrative sections

- **Description**: Vertical navigation menu provides access to related administrative functions
- **Navigation Options**:
  - Admin Dashboard (current page)
  - Financial Officer Management
  - Student Records
  - Fee Payment
- **Features**:
  - Active state highlighting
  - Mobile-responsive with hamburger menu
  - Sticky positioning for easy access
- **Business Value**: Streamlined navigation between related administrative tasks

### Technical Implementation Details

- **Framework**: Next.js with React (TypeScript)
- **API Integration**: RESTful API calls to backend on port 8080
- **Data Transformation**: Raw API data transformed to standardized format
- **State Management**: React hooks (useState, useEffect)
- **Responsive Design**: Tailwind CSS with mobile-first approach
- **Real-time Updates**: Dynamic filtering and search without page refresh

### User Experience Highlights

- **Loading States**: Animated spinner during data fetch
- **Error Handling**: User-friendly error messages with retry option
- **Empty States**: Helpful messages when no data matches filters
- **Visual Hierarchy**: Color-coded sections (blue gradients for colleges, alternating row colors)
- **Accessibility**: Keyboard navigation, semantic HTML, ARIA labels

---

## 2. Financial Officer Management Page

### Overview

The Financial Officer Management page is a dedicated administrative interface for managing financial officers within the RUB system. It provides CRUD (Create, Read, Update, Delete) operations specifically for users with the Financial Officer role.

### Primary Actors

- **System Administrator**: Manages financial officer accounts
- **Super Admin**: Has oversight of all financial officer assignments

### Key Features

#### 2.1 Financial Officer Listing

**Use Case**: View all financial officers in the system

- **Description**: Displays a comprehensive list of all users assigned the Financial Officer role
- **Preconditions**: User must have administrative privileges
- **Main Flow**:
  1. User navigates to `/user/financial-officer`
  2. System fetches users with role_id = 2 (Financial Officer) from API endpoint `http://localhost:8082/users/role/2`
  3. System displays officers in tabular format
  4. Each row can be expanded to view detailed information
- **Data Displayed**:
  - Email address (with icon)
  - Phone number (with icon)
  - Status (Active/Inactive with color-coded badges)
  - Action buttons (Edit)
- **Expandable Details**:
  - User Email
  - Role ID
  - Phone Number
  - User ID (unique identifier)
  - Created At (timestamp)
- **Business Value**: Centralized management of financial personnel

#### 2.2 Create New Financial Officer

**Use Case**: Add a new financial officer to the system

- **Description**: Administrators can create new financial officer accounts
- **Main Flow**:
  1. User clicks "Add Officer" button
  2. System opens creation dialog
  3. User enters required information:
     - First Name (required)
     - Last Name (required)
     - Email Address (required, validated)
  4. System validates input:
     - Email format validation (regex)
     - Required field checking
  5. User clicks "Add Officer"
  6. System sends POST request to `/api/users/create/finance-officer`
  7. System refreshes officer list
  8. Dialog closes automatically
- **Validation Rules**:
  - Email must be valid format (contains @ and domain)
  - First name and last name cannot be empty
  - All whitespace trimmed before submission
- **Default Values**:
  - Status: Active
  - Role ID: 2 (Financial Officer)
  - Created At: Current timestamp
- **Business Value**: Streamlined onboarding of financial staff

#### 2.3 Edit Financial Officer Information

**Use Case**: Update existing financial officer details

- **Description**: Modify information for existing financial officers
- **Main Flow**:
  1. User clicks edit icon on officer row
  2. System opens edit dialog pre-filled with current data
  3. User can modify:
     - Email address
     - Phone number
     - Status (Active/Inactive)
  4. User clicks "Update Officer"
  5. System updates officer record
  6. List refreshes with updated information
- **Editable Fields** (Edit Mode):
  - Email address
  - Phone number
  - Status (Active/Inactive dropdown)
- **Read-Only Fields**:
  - Role ID (always 2)
  - User ID
  - Created At timestamp
- **Business Value**: Maintains accurate officer contact information

#### 2.4 Officer Status Management

**Use Case**: Track and update officer employment status

- **Description**: Visual indication and management of officer active status
- **Status Types**:
  - **Active**: Green badge with dot indicator
  - **Inactive**: Gray badge with dot indicator
- **Visual Indicators**:
  - Color-coded badges (green/gray)
  - Status dot (filled circle)
  - Font weight for emphasis
- **Business Value**: Quick identification of available officers

#### 2.5 Search and Filter Officers

**Use Case**: Locate specific financial officers

- **Description**: Search functionality for finding officers quickly
- **Search Criteria**:
  - Email address
  - User ID
  - First name
  - Last name
- **Search Behavior**:
  - Case-insensitive matching
  - Real-time filtering
  - Searches across multiple fields simultaneously
- **Business Value**: Quick access to specific officer records

#### 2.6 Statistical Overview

**Use Case**: Monitor financial officer workforce metrics

- **Description**: Dashboard displays key metrics about financial officer team
- **Metrics Displayed**:
  - **Total Officers**: Count of all financial officers
  - **Active Officers**: Count of currently active officers
  - **Inactive Officers**: Count of inactive officers
- **Visual Design**:
  - Color-coded stat cards (blue, green, purple)
  - Icon representations (Users, Briefcase, AlertCircle)
  - Large, readable numbers
- **Business Value**: At-a-glance workforce management insights

#### 2.7 Expandable Row Details

**Use Case**: View comprehensive officer information

- **Description**: Each officer row can be expanded to show full details
- **Interaction**:
  1. User clicks chevron icon (down/up)
  2. Row expands with animation (fade-in, slide-in)
  3. Detailed information displayed in card grid
  4. Click again to collapse
- **Detailed View Layout**:
  - Grid layout (2 columns on desktop, 1 on mobile)
  - White cards with borders
  - Labeled fields with icons
  - Professional typography hierarchy
- **Business Value**: Detailed view without page navigation

#### 2.8 Data Export

**Use Case**: Export financial officer data

- **Description**: Download officer information for reporting
- **Export Format**: CSV (implied by Download button)
- **Use Cases**:
  - Audit reports
  - HR documentation
  - Backup records
- **Business Value**: Integration with external systems and reporting

### Technical Implementation Details

- **Framework**: Next.js with React (TypeScript)
- **API Endpoints**:
  - GET: `http://localhost:8082/users/role/2` (fetch officers)
  - POST: `/api/users/create/finance-officer` (create officer)
- **State Management**:
  - React hooks (useState, useEffect, useCallback)
  - Local state for dialog management
  - Form state handling
- **Data Mapping**:
  - API response transformed to consistent format
  - Default values for missing fields
  - Role ID hardcoded to 2
- **Validation**: Client-side email and required field validation
- **UI/UX**:
  - Modal dialogs for forms
  - Loading states with spinners
  - Error handling with retry mechanism
  - Responsive design (mobile-first)
  - Smooth animations and transitions

### Integration Points

- **Navigation**: Integrated with VerticalNav component
- **Shared Components**:
  - VerticalNav for cross-page navigation
  - StatCard for metrics display
  - OfficerRow for table rows
- **API Communication**: RESTful endpoints on port 8082
- **Role-Based Access**: Hardcoded role ID 2 for financial officers

### Error Handling

- **Network Errors**:
  - User-friendly error messages
  - Retry button functionality
  - Console logging for debugging
- **Validation Errors**:
  - Alert messages for invalid input
  - Field-level validation feedback
- **API Errors**:
  - Catches and displays API error messages
  - Falls back to generic error message if none provided

### Security Considerations

- **Email Validation**: Prevents invalid email formats
- **Role Assignment**: Automatically assigns correct role ID (2)
- **Input Sanitization**: Whitespace trimming on all inputs
- **Required Fields**: Enforced for critical data (name, email)

---

## Comparison and System Integration

### Common Features

Both pages share:

- **VerticalNav Component**: Consistent navigation experience
- **Responsive Design**: Mobile-first approach with breakpoints
- **Search Functionality**: Real-time, case-insensitive search
- **Statistical Cards**: Metrics overview at the top
- **Export Capability**: Data download functionality
- **Loading States**: Professional loading indicators
- **Error Handling**: User-friendly error messages

### Differentiation

| Feature                | User Dashboard          | Financial Officer          |
| ---------------------- | ----------------------- | -------------------------- |
| **Primary Focus**      | Student records viewing | Officer account management |
| **Data Grouping**      | By college              | Flat list with search      |
| **Main Actions**       | View, search, filter    | Create, edit, view         |
| **Expandable Content** | College sections        | Individual officer details |
| **Role ID**            | 1 (Students)            | 2 (Financial Officers)     |
| **API Port**           | 8080                    | 8082                       |
| **Write Operations**   | None (read-only)        | Create and update          |

### Workflow Integration

1. **Administrator Workflow**:

   - Check student enrollment (User Dashboard)
   - Assign financial officers to colleges (Financial Officer page)
   - Navigate seamlessly via VerticalNav

2. **Data Consistency**:

   - Both pages fetch from user management system
   - Role-based data separation (role_id 1 vs 2)
   - Consistent data transformation patterns

3. **Future Integration Points**:
   - Fee Payment linking students to officers
   - College-specific officer assignments
   - Reporting and analytics across both datasets

---

## Conclusion

These two pages form critical components of the RUB Student Portal's administrative interface, providing comprehensive management tools for both student records and financial officer administration. The User Dashboard offers powerful viewing and filtering capabilities for student data, while the Financial Officer page provides full CRUD operations for managing financial personnel. Together, they demonstrate a well-architected system with consistent design patterns, robust error handling, and user-friendly interfaces.
