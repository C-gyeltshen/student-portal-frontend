/**
 * Comprehensive Unit Tests for FinanceDashboard Component
 * Tests cover rendering, interactions, calculations, and conditional rendering
 */

import React from "react";
import { render, screen, fireEvent, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import FinanceDashboard from "../../src/app/user/finance/dashboard/page";

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />;
  },
}));

describe("FinanceDashboard Component", () => {
  // ============================================================
  // COMPONENT RENDERING TESTS
  // ============================================================

  describe("Component Rendering", () => {
    test("renders header with RUB logo and title", () => {
      // Arrange & Act
      render(<FinanceDashboard />);

      // Assert
      const logo = screen.getByAltText("RUB Logo");
      expect(logo).toBeInTheDocument();
      expect(logo).toHaveAttribute("src", "/image/1.png");

      const title = screen.getByText("RUB Finance Portal");
      expect(title).toBeInTheDocument();
      expect(title).toHaveClass("text-2xl", "font-bold");

      const subtitle = screen.getByText("Financial Management & Reports");
      expect(subtitle).toBeInTheDocument();
    });

    test("renders Financial Officer user badge", () => {
      // Arrange & Act
      render(<FinanceDashboard />);

      // Assert
      const officerBadge = screen.getByText("Financial Officer");
      expect(officerBadge).toBeInTheDocument();
      expect(officerBadge).toHaveClass("text-sm", "font-medium");
    });

    test("renders all four stats cards with correct structure", () => {
      // Arrange & Act
      render(<FinanceDashboard />);

      // Assert
      expect(screen.getByText("Total Stipends Processed")).toBeInTheDocument();
      expect(screen.getByText("Total Deductions Applied")).toBeInTheDocument();
      expect(screen.getByText("Eligible Students Count")).toBeInTheDocument();
      expect(screen.getByText("Pending Approvals")).toBeInTheDocument();
    });

    test("renders filter controls with all inputs", () => {
      // Arrange & Act
      render(<FinanceDashboard />);

      // Assert
      const searchInput = screen.getByPlaceholderText(
        "Search by student ID or name..."
      );
      expect(searchInput).toBeInTheDocument();

      const departmentFilter = screen.getByDisplayValue("All Departments");
      expect(departmentFilter).toBeInTheDocument();

      const statusFilter = screen.getByDisplayValue("All Status");
      expect(statusFilter).toBeInTheDocument();

      const fromDateLabel = screen.getByText("From Date");
      expect(fromDateLabel).toBeInTheDocument();

      const toDateLabel = screen.getByText("To Date");
      expect(toDateLabel).toBeInTheDocument();
    });

    test("renders action buttons (Expand All, Collapse All, Clear Filters, Export)", () => {
      // Arrange & Act
      render(<FinanceDashboard />);

      // Assert
      expect(
        screen.getByRole("button", { name: /expand all/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /collapse all/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /clear filters/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /export report/i })
      ).toBeInTheDocument();
    });

    test("renders finance table with correct column headers", () => {
      // Arrange & Act
      render(<FinanceDashboard />);

      // Assert
      expect(screen.getByText("Student ID")).toBeInTheDocument();
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Stipend Amount")).toBeInTheDocument();
      expect(screen.getByText("Deductions")).toBeInTheDocument();
      expect(screen.getByText("Net Amount")).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();
      expect(screen.getByText("Actions")).toBeInTheDocument();
    });
  });

  // ============================================================
  // DATA CALCULATIONS TESTS
  // ============================================================

  describe("Data Calculations", () => {
    test("calculates and displays total stipends correctly", () => {
      // Arrange & Act
      render(<FinanceDashboard />);

      // Assert - Mock data has 5 records totaling: 5000+4800+5200+4700+5100 = 24800
      const totalStipends = screen.getByText(/Nu 24,800/i);
      expect(totalStipends).toBeInTheDocument();
    });

    test("calculates and displays total deductions correctly", () => {
      // Arrange & Act
      render(<FinanceDashboard />);

      // Assert - Mock data deductions: 250+300+200+150+100 = 1000
      const totalDeductions = screen.getByText(/Nu 1,000/i);
      expect(totalDeductions).toBeInTheDocument();
    });

    test("displays correct student count", () => {
      // Arrange & Act
      render(<FinanceDashboard />);

      // Assert - 5 unique students in mock data
      const studentCount = screen.getByText("5");
      expect(studentCount).toBeInTheDocument();
    });

    test("calculates and displays pending approvals count", () => {
      // Arrange & Act
      render(<FinanceDashboard />);

      // Assert - Mock data has 2 pending records (Karma Wangmo and Kinley Dem)
      const pendingCount = screen.getByText("2");
      expect(pendingCount).toBeInTheDocument();
    });

    test("displays percentage of deductions to stipends", () => {
      // Arrange & Act
      render(<FinanceDashboard />);

      // Assert - (1000/24800)*100 = 4.0%
      const percentage = screen.getByText(/4.0% of stipends/i);
      expect(percentage).toBeInTheDocument();
    });

    test("displays payment count in stats card", () => {
      // Arrange & Act
      render(<FinanceDashboard />);

      // Assert
      const paymentCount = screen.getByText("5 payments");
      expect(paymentCount).toBeInTheDocument();
    });
  });

  // ============================================================
  // USER INTERACTIONS TESTS
  // ============================================================

  describe("User Interactions", () => {
    test("search functionality filters by student name", () => {
      // Arrange
      render(<FinanceDashboard />);
      const searchInput = screen.getByPlaceholderText(
        "Search by student ID or name..."
      );

      // Act
      fireEvent.change(searchInput, { target: { value: "Tshering" } });

      // Assert
      expect(screen.getByText("Tshering Dorji")).toBeInTheDocument();
      expect(screen.queryByText("Karma Wangmo")).not.toBeInTheDocument();
    });

    test("search functionality filters by student ID", () => {
      // Arrange
      render(<FinanceDashboard />);
      const searchInput = screen.getByPlaceholderText(
        "Search by student ID or name..."
      );

      // Act
      fireEvent.change(searchInput, { target: { value: "11901236" } });

      // Assert
      expect(screen.getByText("Pema Lhamo")).toBeInTheDocument();
      expect(screen.queryByText("Tshering Dorji")).not.toBeInTheDocument();
    });

    test("search is case insensitive", () => {
      // Arrange
      render(<FinanceDashboard />);
      const searchInput = screen.getByPlaceholderText(
        "Search by student ID or name..."
      );

      // Act
      fireEvent.change(searchInput, { target: { value: "KARMA" } });

      // Assert
      expect(screen.getByText("Karma Wangmo")).toBeInTheDocument();
    });

    test("filter by department works correctly", () => {
      // Arrange
      render(<FinanceDashboard />);
      const departmentFilter = screen.getByDisplayValue("All Departments");

      // Act
      fireEvent.change(departmentFilter, { target: { value: "1" } });

      // Assert
      expect(
        screen.getByText("College of Science and Technology")
      ).toBeInTheDocument();
      expect(
        screen.queryByText("College of Natural Resources")
      ).not.toBeInTheDocument();
      expect(screen.queryByText("Sherubtse College")).not.toBeInTheDocument();
    });

    test("filter by status works correctly", () => {
      // Arrange
      render(<FinanceDashboard />);
      const statusFilter = screen.getByDisplayValue("All Status");

      // Act
      fireEvent.change(statusFilter, { target: { value: "Pending" } });

      // Assert
      // Should show only Karma Wangmo and Kinley Dem (pending status)
      expect(screen.getByText("Karma Wangmo")).toBeInTheDocument();
      expect(screen.getByText("Kinley Dem")).toBeInTheDocument();
    });

    test("date range filtering works - start date", () => {
      // Arrange
      render(<FinanceDashboard />);
      const dateInputs = screen.getAllByLabelText(/date/i);
      const startDateInput = dateInputs.find(
        (input) =>
          input.closest("div").querySelector("label")?.textContent ===
          "From Date"
      );

      // Act
      fireEvent.change(startDateInput, { target: { value: "2025-09-17" } });

      // Assert
      expect(screen.getByText("Kinley Dem")).toBeInTheDocument();
      expect(screen.queryByText("Tshering Dorji")).not.toBeInTheDocument();
    });

    test("expand all button expands all department rows", () => {
      // Arrange
      render(<FinanceDashboard />);
      const expandAllButton = screen.getByRole("button", {
        name: /expand all/i,
      });

      // Act
      fireEvent.click(expandAllButton);

      // Assert - Student names should be visible when departments are expanded
      expect(screen.getByText("Tshering Dorji")).toBeInTheDocument();
      expect(screen.getByText("Karma Wangmo")).toBeInTheDocument();
      expect(screen.getByText("Pema Lhamo")).toBeInTheDocument();
      expect(screen.getByText("Sonam Tenzin")).toBeInTheDocument();
      expect(screen.getByText("Kinley Dem")).toBeInTheDocument();
    });

    test("collapse all button collapses all department rows", () => {
      // Arrange
      render(<FinanceDashboard />);
      const expandAllButton = screen.getByRole("button", {
        name: /expand all/i,
      });
      const collapseAllButton = screen.getByRole("button", {
        name: /collapse all/i,
      });

      // Act
      fireEvent.click(expandAllButton);
      fireEvent.click(collapseAllButton);

      // Assert - Student names should not be visible when departments are collapsed
      expect(screen.queryByText("Tshering Dorji")).not.toBeInTheDocument();
      expect(screen.queryByText("Karma Wangmo")).not.toBeInTheDocument();
    });

    test("clear filters button resets all filters", () => {
      // Arrange
      render(<FinanceDashboard />);
      const searchInput = screen.getByPlaceholderText(
        "Search by student ID or name..."
      );
      const departmentFilter = screen.getByDisplayValue("All Departments");
      const statusFilter = screen.getByDisplayValue("All Status");
      const clearButton = screen.getByRole("button", {
        name: /clear filters/i,
      });

      // Act - Apply filters
      fireEvent.change(searchInput, { target: { value: "Karma" } });
      fireEvent.change(departmentFilter, { target: { value: "1" } });
      fireEvent.change(statusFilter, { target: { value: "Pending" } });

      // Act - Clear filters
      fireEvent.click(clearButton);

      // Assert - All filters should be reset
      expect(searchInput.value).toBe("");
      expect(departmentFilter.value).toBe("all");
      expect(statusFilter.value).toBe("all");
    });

    test("clicking department row toggles expansion", () => {
      // Arrange
      render(<FinanceDashboard />);
      const departmentRow = screen.getByText(
        "College of Science and Technology"
      );

      // Act - Click to expand
      fireEvent.click(departmentRow);

      // Assert - Should show students
      expect(screen.getByText("Tshering Dorji")).toBeInTheDocument();
      expect(screen.getByText("Karma Wangmo")).toBeInTheDocument();

      // Act - Click again to collapse
      fireEvent.click(departmentRow);

      // Assert - Students should not be visible
      expect(screen.queryByText("Tshering Dorji")).not.toBeInTheDocument();
    });
  });

  // ============================================================
  // CONDITIONAL RENDERING TESTS
  // ============================================================

  describe("Conditional Rendering", () => {
    test("shows empty state when no records match filters", () => {
      // Arrange
      render(<FinanceDashboard />);
      const searchInput = screen.getByPlaceholderText(
        "Search by student ID or name..."
      );

      // Act
      fireEvent.change(searchInput, {
        target: { value: "NonExistentStudent" },
      });

      // Assert
      expect(
        screen.getByText("No financial records found")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Try adjusting your search or filter criteria")
      ).toBeInTheDocument();
    });

    test("displays correct status badge colors for Processed status", () => {
      // Arrange
      render(<FinanceDashboard />);
      const expandAllButton = screen.getByRole("button", {
        name: /expand all/i,
      });

      // Act
      fireEvent.click(expandAllButton);

      // Assert
      const processedBadges = screen.getAllByText("Processed");
      expect(processedBadges[0]).toHaveClass("bg-green-100", "text-green-800");
    });

    test("displays correct status badge colors for Pending status", () => {
      // Arrange
      render(<FinanceDashboard />);
      const expandAllButton = screen.getByRole("button", {
        name: /expand all/i,
      });

      // Act
      fireEvent.click(expandAllButton);

      // Assert
      const pendingBadges = screen.getAllByText("Pending");
      expect(pendingBadges[0]).toHaveClass("bg-yellow-100", "text-yellow-800");
    });

    test("displays correct status badge colors for Eligible status", () => {
      // Arrange
      render(<FinanceDashboard />);
      const expandAllButton = screen.getByRole("button", {
        name: /expand all/i,
      });

      // Act
      fireEvent.click(expandAllButton);

      // Assert
      const eligibleBadge = screen.getByText("Eligible");
      expect(eligibleBadge).toHaveClass("bg-blue-100", "text-blue-800");
    });

    test("department rows show student count correctly", () => {
      // Arrange & Act
      render(<FinanceDashboard />);

      // Assert
      const deptWithTwoStudents = screen.getByText("2 Students");
      expect(deptWithTwoStudents).toBeInTheDocument();
    });

    test("department rows display total stipend and deductions", () => {
      // Arrange & Act
      render(<FinanceDashboard />);

      // Assert
      expect(screen.getByText("Total Stipend")).toBeInTheDocument();
      expect(screen.getByText("Total Deductions")).toBeInTheDocument();
    });

    test("student rows show deduction breakdown", () => {
      // Arrange
      render(<FinanceDashboard />);
      const expandAllButton = screen.getByRole("button", {
        name: /expand all/i,
      });

      // Act
      fireEvent.click(expandAllButton);

      // Assert
      expect(screen.getAllByText(/Hostel:/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Electricity:/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Mess:/i).length).toBeGreaterThan(0);
    });

    test("student rows display action buttons", () => {
      // Arrange
      render(<FinanceDashboard />);
      const expandAllButton = screen.getByRole("button", {
        name: /expand all/i,
      });

      // Act
      fireEvent.click(expandAllButton);

      // Assert
      const calculateButtons = screen.getAllByTitle("Calculate");
      const detailButtons = screen.getAllByTitle("View Details");
      const processButtons = screen.getAllByTitle("Process Payment");

      expect(calculateButtons.length).toBeGreaterThan(0);
      expect(detailButtons.length).toBeGreaterThan(0);
      expect(processButtons.length).toBeGreaterThan(0);
    });

    test("displays student initials in avatar correctly", () => {
      // Arrange
      render(<FinanceDashboard />);
      const expandAllButton = screen.getByRole("button", {
        name: /expand all/i,
      });

      // Act
      fireEvent.click(expandAllButton);

      // Assert - Tshering Dorji should have initials "TD"
      expect(screen.getByText("TD")).toBeInTheDocument();
    });
  });

  // ============================================================
  // COMBINED FILTER TESTS
  // ============================================================

  describe("Combined Filter Logic", () => {
    test("applies search and department filter together", () => {
      // Arrange
      render(<FinanceDashboard />);
      const searchInput = screen.getByPlaceholderText(
        "Search by student ID or name..."
      );
      const departmentFilter = screen.getByDisplayValue("All Departments");

      // Act
      fireEvent.change(searchInput, { target: { value: "a" } });
      fireEvent.change(departmentFilter, { target: { value: "2" } });

      // Assert - Should show Pema Lhamo from College of Natural Resources
      expect(
        screen.getByText("College of Natural Resources")
      ).toBeInTheDocument();
    });

    test("applies all filters simultaneously", () => {
      // Arrange
      render(<FinanceDashboard />);
      const searchInput = screen.getByPlaceholderText(
        "Search by student ID or name..."
      );
      const departmentFilter = screen.getByDisplayValue("All Departments");
      const statusFilter = screen.getByDisplayValue("All Status");

      // Act
      fireEvent.change(searchInput, { target: { value: "Karma" } });
      fireEvent.change(departmentFilter, { target: { value: "1" } });
      fireEvent.change(statusFilter, { target: { value: "Pending" } });

      // Assert
      expect(screen.getByText("Karma Wangmo")).toBeInTheDocument();
      expect(screen.queryByText("Kinley Dem")).not.toBeInTheDocument(); // Different department
    });

    test("recalculates statistics when filters change", () => {
      // Arrange
      render(<FinanceDashboard />);
      const searchInput = screen.getByPlaceholderText(
        "Search by student ID or name..."
      );

      // Act
      fireEvent.change(searchInput, { target: { value: "Tshering" } });

      // Assert - Should only show Tshering's stipend (5000)
      expect(screen.getByText(/Nu 5,000/i)).toBeInTheDocument();
    });
  });

  // ============================================================
  // ACCESSIBILITY TESTS
  // ============================================================

  describe("Accessibility", () => {
    test("search input has proper placeholder text", () => {
      // Arrange & Act
      render(<FinanceDashboard />);

      // Assert
      const searchInput = screen.getByPlaceholderText(
        "Search by student ID or name..."
      );
      expect(searchInput).toHaveAttribute("type", "text");
    });

    test("date inputs have proper labels", () => {
      // Arrange & Act
      render(<FinanceDashboard />);

      // Assert
      expect(screen.getByText("From Date")).toBeInTheDocument();
      expect(screen.getByText("To Date")).toBeInTheDocument();
    });

    test("buttons have descriptive text", () => {
      // Arrange & Act
      render(<FinanceDashboard />);

      // Assert
      expect(
        screen.getByRole("button", { name: /expand all/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /collapse all/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /clear filters/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /export report/i })
      ).toBeInTheDocument();
    });

    test("action buttons have title attributes for tooltips", () => {
      // Arrange
      render(<FinanceDashboard />);
      const expandAllButton = screen.getByRole("button", {
        name: /expand all/i,
      });

      // Act
      fireEvent.click(expandAllButton);

      // Assert
      const calculateButton = screen.getAllByTitle("Calculate")[0];
      const viewButton = screen.getAllByTitle("View Details")[0];
      const processButton = screen.getAllByTitle("Process Payment")[0];

      expect(calculateButton).toBeInTheDocument();
      expect(viewButton).toBeInTheDocument();
      expect(processButton).toBeInTheDocument();
    });

    test("image has alt text", () => {
      // Arrange & Act
      render(<FinanceDashboard />);

      // Assert
      const logo = screen.getByAltText("RUB Logo");
      expect(logo).toBeInTheDocument();
    });
  });

  // ============================================================
  // GROUPING AND DISPLAY TESTS
  // ============================================================

  describe("Data Grouping and Display", () => {
    test("groups students by department correctly", () => {
      // Arrange & Act
      render(<FinanceDashboard />);

      // Assert
      expect(
        screen.getByText("College of Science and Technology")
      ).toBeInTheDocument();
      expect(
        screen.getByText("College of Natural Resources")
      ).toBeInTheDocument();
      expect(screen.getByText("Sherubtse College")).toBeInTheDocument();
    });

    test("displays currency formatting correctly", () => {
      // Arrange
      render(<FinanceDashboard />);
      const expandAllButton = screen.getByRole("button", {
        name: /expand all/i,
      });

      // Act
      fireEvent.click(expandAllButton);

      // Assert - Check for proper thousand separator
      expect(screen.getByText(/Nu 5,000/i)).toBeInTheDocument();
    });

    test("displays student ID in monospace font", () => {
      // Arrange
      render(<FinanceDashboard />);
      const expandAllButton = screen.getByRole("button", {
        name: /expand all/i,
      });

      // Act
      fireEvent.click(expandAllButton);

      // Assert
      const studentId = screen.getByText("11901234");
      expect(studentId).toHaveClass("font-mono");
    });

    test("hides department when all its students are filtered out", () => {
      // Arrange
      render(<FinanceDashboard />);
      const departmentFilter = screen.getByDisplayValue("All Departments");

      // Act
      fireEvent.change(departmentFilter, { target: { value: "1" } });

      // Assert
      expect(
        screen.getByText("College of Science and Technology")
      ).toBeInTheDocument();
      expect(screen.queryByText("Sherubtse College")).not.toBeInTheDocument();
    });
  });
});
