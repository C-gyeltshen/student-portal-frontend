# Student Portal Frontend Application

## Overview

This repository contains the frontend implementation for the Royal University of Bhutan Student Portal system. The application serves as the user interface layer for a comprehensive academic management platform built on a microservices architecture. It provides role-based access to various stakeholders including students, faculty, administrators, and finance officers, enabling them to manage academic records, financial transactions, and administrative operations through an intuitive web interface.

## Purpose and Scope

The Student Portal Frontend is designed to facilitate efficient interaction between users and the backend microservices infrastructure. The application implements a modern, responsive interface that adheres to contemporary web standards and accessibility guidelines. It serves as the primary digital gateway for the university community to access academic and administrative services.

### Key Functionalities

The application provides distinct functionality based on user roles:

**Student Interface**: Students can view their academic records, enrollment status, course information, fee statements, and payment history. The system provides real-time access to financial obligations and academic progress tracking.

**Finance Officer Dashboard**: Finance officers have access to comprehensive financial management tools, including student fee tracking, payment processing, bulk operations through CSV uploads, financial reporting, and revenue analysis capabilities.

**Administrative Functions**: Administrative users can perform system-wide operations including user management, bulk student data imports, and access to aggregated analytics and reporting features.

## Technical Architecture

### Technology Stack

The frontend application is built using modern web development technologies optimized for performance, maintainability, and developer experience:

- **Framework**: Next.js 15.5.5 (React-based framework with server-side rendering capabilities)
- **UI Language**: TypeScript 5 (statically typed superset of JavaScript)
- **UI Library**: React 19.1.0 (component-based user interface library)
- **Styling Framework**: Tailwind CSS 4 (utility-first CSS framework)
- **Component Library**: Material-UI (MUI) 7.3.5 (comprehensive React component library)
- **Icon System**: Material-UI Icons and Lucide React (scalable vector icon libraries)

### Development Patterns

The application follows industry-standard patterns and best practices:

- Component-based architecture for modular and reusable UI elements
- Type-safe development through comprehensive TypeScript implementation
- Responsive design principles ensuring cross-device compatibility
- Client-side state management for efficient data handling
- Server-side rendering for improved performance and search engine optimization
- RESTful API integration with the backend microservices

## Project Structure

The codebase is organized following Next.js conventions and best practices:

```
src/
  app/              Application routing and page components
  components/       Reusable UI components
  config/          Configuration files and environment settings
  lib/             Utility libraries and helper functions
  services/        API integration and data fetching logic
  types/           TypeScript type definitions and interfaces
  utils/           Common utility functions

public/           Static assets and sample data files
__tests__/        Test suites and mock implementations
```

## Backend Integration

The frontend application integrates with the following backend microservices:

- **Student Management Service**: Handles student registration, enrollment, and academic records
- **Finance Service**: Manages fee structures, payments, and financial reporting
- **Banking Services**: Processes banking information and transaction data
- **User Services**: Provides authentication and authorization functionality

API communication is implemented through RESTful endpoints, with proper error handling and loading states to ensure a robust user experience.

## Testing Strategy

The application implements a comprehensive testing approach to ensure reliability and maintainability:

### Unit Testing
- **Framework**: Jest 29.7.0 with jsdom environment
- **Testing Library**: React Testing Library 16.1.0
- **Coverage**: Component logic, utility functions, and service integrations
- **Accessibility**: Integration with jest-dom for accessibility assertions

### End-to-End Testing
- **Framework**: Playwright 1.57.0
- **Scope**: User workflows, integration scenarios, and cross-browser compatibility
- **Accessibility**: Axe-core integration for automated accessibility testing

### Test Execution

The following npm scripts are available for test execution:

```
npm test                    Execute all test suites
npm run test:watch         Run tests in watch mode for development
npm run test:coverage      Generate coverage reports
npm run test:coverage:html Generate and display HTML coverage report
```

Comprehensive testing documentation is available in `TESTING_GUIDE.md`, and coverage guidelines are documented in `COVERAGE_GUIDE.md`.

## Development Workflow

### Prerequisites

The development environment requires the following software:

- Node.js (version 18 or higher)
- npm (Node Package Manager)
- Git version control system
- Backend microservices running locally or accessible remotely

### Installation

Clone the repository and install dependencies:

```powershell
npm install
```

### Development Server

Start the development server with hot module replacement:

```powershell
npm run dev
```

The application will be accessible at `http://localhost:3000` by default.

### Production Build

Generate an optimized production build:

```powershell
npm run build
npm start
```

## Feature Documentation

Detailed documentation for specific features is available in the following files:

- `CSV_UPLOAD_FEATURE.md`: Bulk data import functionality and file format specifications
- `FINANCE_OFFICER_DASHBOARD_UPDATED.md`: Finance officer interface capabilities and workflows
- `BACKEND_INTEGRATION_COMPLETE.md`: API integration details and endpoint mappings

## Configuration

Application configuration is managed through environment-specific settings in the `src/config/` directory. API endpoints, authentication parameters, and feature flags can be configured to match the deployment environment.

## Accessibility Compliance

The application is developed with accessibility as a core requirement, implementing Web Content Accessibility Guidelines (WCAG) standards. Automated accessibility testing is integrated into the test suite to ensure compliance throughout the development lifecycle.

## Version Control and Branching

The project follows a structured branching strategy:

- **development**: Active development branch for feature integration
- **main/master**: Production-ready stable release branch

Feature development should be conducted in dedicated feature branches with descriptive names, following the team's established naming conventions.

## Contributing

Development should adhere to the established code style, testing requirements, and documentation standards. All changes should include appropriate test coverage and documentation updates where applicable.

## Related Documentation

For comprehensive system documentation, refer to the backend repository README at `rub_student_portal_microservices/README.md`, which provides detailed information about the microservices architecture, API specifications, and deployment procedures.
