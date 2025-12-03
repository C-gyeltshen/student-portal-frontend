/**
 * Integration Tests for FinanceDashboard Component
 * Tests complete user workflows and interactions between components
 */

import React from "react";
import {
  render,
  screen,
  fireEvent,
  within,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

describe("FinanceDashboard Integration Tests", () => {
  // Helper function to get stats card values
  const getStatsCardValue = (label) => {
    const element = screen.getByText(label);
    const container = element.closest(".bg-white");
    const valueElement = within(container).getByText(/Nu|^\d+$/);
    return valueElement.textContent;
  };

  // Helper function to get all department rows
  const getDepartmentRows = () => {
    return screen.queryAllByRole("row").filter((row) => {
      const text = row.textContent;
      return text.includes("College") || text.includes("Sherubtse");
    });
  };

  // Helper function to get date inputs by label text
  const getDateInputByLabel = (labelText) => {
    const labels = screen.getAllByText(labelText);
    const label = labels.find((l) => l.tagName === "LABEL");
    if (!label) return null;
    const container = label.closest("div");
    return container.querySelector('input[type="date"]');
  };

  // ============================================================
  // 1. COMPLETE FILTERING WORKFLOW
  // ============================================================

  describe("Complete Filtering Workflow", () => {
    test("search for student by name and verify results update", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<FinanceDashboard />);

      // Initial state - should have all records
      const initialStats = screen
        .getByText("Total Stipends Processed")
        .closest(".bg-white");
      const initialStipends = within(initialStats).getByText(/Nu 24,800/);
      expect(initialStipends).toBeInTheDocument();

      // Act - Search for "Tshering"
      const searchInput = screen.getByPlaceholderText(
        "Search by student ID or name..."
      );
      await user.type(searchInput, "Tshering");

      // Assert - Verify filtered results
      const expandAllBtn = screen.getByRole("button", { name: /expand all/i });
      fireEvent.click(expandAllBtn);

      expect(screen.getByText("Tshering Dorji")).toBeInTheDocument();
      expect(screen.queryByText("Karma Wangmo")).not.toBeInTheDocument();
      expect(screen.queryByText("Pema Lhamo")).not.toBeInTheDocument();

      // Verify stats updated to show only filtered student
      const filteredStats = screen
        .getByText("Total Stipends Processed")
        .closest(".bg-white");
      const filteredStipends = within(filteredStats).getAllByText(/Nu/)[0];
      expect(filteredStipends.textContent).toContain("5,000");
    });

    test("search by student ID and verify results", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<FinanceDashboard />);

      // Act - Search by ID
      const searchInput = screen.getByPlaceholderText(
        "Search by student ID or name..."
      );
      await user.type(searchInput, "11901236");

      // Assert
      const expandAllBtn = screen.getByRole("button", { name: /expand all/i });
      fireEvent.click(expandAllBtn);

      expect(screen.getByText("Pema Lhamo")).toBeInTheDocument();
      expect(screen.getByText("11901236")).toBeInTheDocument();
      expect(screen.queryByText("Tshering Dorji")).not.toBeInTheDocument();
    });

    test("filter by department and verify only relevant records show", () => {
      // Arrange
      render(<FinanceDashboard />);

      // Act - Filter by College of Science and Technology
      const departmentFilter = screen.getByDisplayValue("All Departments");
      fireEvent.change(departmentFilter, { target: { value: "1" } });

      // Assert - Should only show CST department
      const deptRows = getDepartmentRows();
      expect(deptRows.length).toBe(1);
      expect(
        screen.getAllByText("College of Science and Technology")[1]
      ).toBeInTheDocument();

      // Check that other departments are not in the document (only in select dropdown)
      const cnrElements = screen.getAllByText("College of Natural Resources");
      expect(cnrElements.length).toBe(1); // Only in dropdown
      expect(cnrElements[0].tagName).toBe("OPTION");

      const sherubtseElements = screen.queryAllByText("Sherubtse College");
      if (sherubtseElements.length > 0) {
        expect(sherubtseElements.every((el) => el.tagName === "OPTION")).toBe(
          true
        );
      }

      // Verify student count in stats updated
      const studentCountCard = screen
        .getByText("Eligible Students Count")
        .closest(".bg-white");
      const count = within(studentCountCard).getByText("2");
      expect(count).toBeInTheDocument();
    });

    test("filter by status and verify correct records display", () => {
      // Arrange
      render(<FinanceDashboard />);

      // Act - Filter by Pending status
      const statusFilter = screen.getByDisplayValue("All Status");
      fireEvent.change(statusFilter, { target: { value: "Pending" } });

      // Expand to see students
      const expandAllBtn = screen.getByRole("button", { name: /expand all/i });
      fireEvent.click(expandAllBtn);

      // Assert - Should only show pending students
      expect(screen.getByText("Karma Wangmo")).toBeInTheDocument();
      expect(screen.getByText("Kinley Dem")).toBeInTheDocument();
      expect(screen.queryByText("Tshering Dorji")).not.toBeInTheDocument();

      // Verify pending approvals count matches
      const pendingCard = screen
        .getByText("Pending Approvals")
        .closest(".bg-white");
      const pendingCount = within(pendingCard).getByText("2");
      expect(pendingCount).toBeInTheDocument();
    });

    test("combine multiple filters and verify results", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<FinanceDashboard />);

      // Act - Apply multiple filters
      const searchInput = screen.getByPlaceholderText(
        "Search by student ID or name..."
      );
      await user.type(searchInput, "Karma");

      const departmentFilter = screen.getByDisplayValue("All Departments");
      fireEvent.change(departmentFilter, { target: { value: "1" } });

      const statusFilter = screen.getByDisplayValue("All Status");
      fireEvent.change(statusFilter, { target: { value: "Pending" } });

      // Expand to see results
      const expandAllBtn = screen.getByRole("button", { name: /expand all/i });
      fireEvent.click(expandAllBtn);

      // Assert - Should only show Karma Wangmo (matches all filters)
      expect(screen.getByText("Karma Wangmo")).toBeInTheDocument();
      expect(screen.queryByText("Tshering Dorji")).not.toBeInTheDocument();
      expect(screen.queryByText("Kinley Dem")).not.toBeInTheDocument(); // Different department

      // Verify stats reflect combined filters
      const statsCard = screen
        .getByText("Total Stipends Processed")
        .closest(".bg-white");
      const stipendAmount = within(statsCard).getAllByText(/Nu/)[0];
      expect(stipendAmount.textContent).toContain("4,800"); // Only Karma's stipend
    });

    test("clear filters resets all filters and shows all records", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<FinanceDashboard />);

      // Act - Apply filters
      const searchInput = screen.getByPlaceholderText(
        "Search by student ID or name..."
      );
      await user.type(searchInput, "Karma");

      const departmentFilter = screen.getByDisplayValue("All Departments");
      fireEvent.change(departmentFilter, { target: { value: "1" } });

      const statusFilter = screen.getByDisplayValue("All Status");
      fireEvent.change(statusFilter, { target: { value: "Pending" } });

      // Clear filters
      const clearBtn = screen.getByRole("button", { name: /clear filters/i });
      fireEvent.click(clearBtn);

      // Assert - All filters should be reset
      expect(searchInput.value).toBe("");
      expect(departmentFilter.value).toBe("all");
      expect(statusFilter.value).toBe("all");

      // Verify all departments visible again
      const deptRows = getDepartmentRows();
      expect(deptRows.length).toBe(3);

      // Verify stats back to original
      const statsCard = screen
        .getByText("Total Stipends Processed")
        .closest(".bg-white");
      const totalStipends = within(statsCard).getAllByText(/Nu/)[0];
      expect(totalStipends.textContent).toContain("24,800");
    });
  });

  // ============================================================
  // 2. DATA GROUPING AND EXPANSION
  // ============================================================

  describe("Data Grouping and Expansion", () => {
    test("expand department row displays student records", () => {
      // Arrange
      render(<FinanceDashboard />);

      // Initially, students should not be visible
      expect(screen.queryByText("Tshering Dorji")).not.toBeInTheDocument();

      // Act - Click on CST department row
      const cstDepartment = screen.getAllByText(
        "College of Science and Technology"
      )[1];
      fireEvent.click(cstDepartment);

      // Assert - Students from CST should be visible
      expect(screen.getByText("Tshering Dorji")).toBeInTheDocument();
      expect(screen.getByText("Karma Wangmo")).toBeInTheDocument();

      // Students from other departments should not be visible
      expect(screen.queryByText("Pema Lhamo")).not.toBeInTheDocument();
      expect(screen.queryByText("Kinley Dem")).not.toBeInTheDocument();
    });

    test("expand all functionality shows all student records", () => {
      // Arrange
      render(<FinanceDashboard />);

      // Act - Click Expand All
      const expandAllBtn = screen.getByRole("button", { name: /expand all/i });
      fireEvent.click(expandAllBtn);

      // Assert - All students should be visible
      expect(screen.getByText("Tshering Dorji")).toBeInTheDocument();
      expect(screen.getByText("Karma Wangmo")).toBeInTheDocument();
      expect(screen.getByText("Pema Lhamo")).toBeInTheDocument();
      expect(screen.getByText("Sonam Tenzin")).toBeInTheDocument();
      expect(screen.getByText("Kinley Dem")).toBeInTheDocument();

      // Verify all action buttons are visible
      const calculateButtons = screen.getAllByTitle("Calculate");
      expect(calculateButtons).toHaveLength(5); // One for each student
    });

    test("collapse all functionality hides all student records", () => {
      // Arrange
      render(<FinanceDashboard />);

      // First expand all
      const expandAllBtn = screen.getByRole("button", { name: /expand all/i });
      fireEvent.click(expandAllBtn);

      // Verify students are visible
      expect(screen.getByText("Tshering Dorji")).toBeInTheDocument();

      // Act - Click Collapse All
      const collapseAllBtn = screen.getByRole("button", {
        name: /collapse all/i,
      });
      fireEvent.click(collapseAllBtn);

      // Assert - All students should be hidden
      expect(screen.queryByText("Tshering Dorji")).not.toBeInTheDocument();
      expect(screen.queryByText("Karma Wangmo")).not.toBeInTheDocument();
      expect(screen.queryByText("Pema Lhamo")).not.toBeInTheDocument();
      expect(screen.queryByText("Sonam Tenzin")).not.toBeInTheDocument();
      expect(screen.queryByText("Kinley Dem")).not.toBeInTheDocument();
    });

    test("toggle individual department maintains other department states", () => {
      // Arrange
      render(<FinanceDashboard />);

      // Act - Expand CST
      const cstDepartment = screen.getAllByText(
        "College of Science and Technology"
      )[1];
      fireEvent.click(cstDepartment);

      // Expand CNR - get the h3 element, not the option
      const cnrElements = screen.getAllByText("College of Natural Resources");
      const cnrDepartment = cnrElements.find((el) => el.tagName === "H3");
      fireEvent.click(cnrDepartment);

      // Assert - Both should be expanded
      expect(screen.getByText("Tshering Dorji")).toBeInTheDocument();
      expect(screen.getByText("Pema Lhamo")).toBeInTheDocument();

      // Act - Collapse CST
      fireEvent.click(cstDepartment);

      // Assert - CST students hidden, CNR students still visible
      expect(screen.queryByText("Tshering Dorji")).not.toBeInTheDocument();
      expect(screen.getByText("Pema Lhamo")).toBeInTheDocument();
    });

    test("department totals calculate correctly when expanded", () => {
      // Arrange
      render(<FinanceDashboard />);

      // Act - Expand CST department
      const cstDepartment = screen.getAllByText(
        "College of Science and Technology"
      )[1];
      const deptRow = cstDepartment.closest("tr");

      // Assert - Verify department totals in the collapsed row
      const totalStipendLabel = within(deptRow).getByText("Total Stipend");
      const stipendContainer = totalStipendLabel.closest("div");
      expect(
        within(stipendContainer).getByText(/Nu 9,800/)
      ).toBeInTheDocument(); // 5000 + 4800

      const totalDeductionsLabel =
        within(deptRow).getByText("Total Deductions");
      const deductionsContainer = totalDeductionsLabel.closest("div");
      expect(
        within(deductionsContainer).getByText(/Nu 550/)
      ).toBeInTheDocument(); // 250 + 300

      // Verify student count
      expect(within(deptRow).getByText("2 Students")).toBeInTheDocument();
      expect(within(deptRow).getByText("2 Payments")).toBeInTheDocument();
    });

    test("expanded state persists when filters change", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<FinanceDashboard />);

      // Expand all departments
      const expandAllBtn = screen.getByRole("button", { name: /expand all/i });
      fireEvent.click(expandAllBtn);

      // Verify expanded
      expect(screen.getByText("Tshering Dorji")).toBeInTheDocument();

      // Act - Apply a filter
      const searchInput = screen.getByPlaceholderText(
        "Search by student ID or name..."
      );
      await user.type(searchInput, "Pema");

      // Assert - Department should still be expanded (showing Pema)
      expect(screen.getByText("Pema Lhamo")).toBeInTheDocument();

      // Clear filter
      const clearBtn = screen.getByRole("button", { name: /clear filters/i });
      fireEvent.click(clearBtn);

      // All students should be visible again (expansion state maintained)
      expect(screen.getByText("Tshering Dorji")).toBeInTheDocument();
      expect(screen.getByText("Karma Wangmo")).toBeInTheDocument();
    });
  });

  // ============================================================
  // 3. DATE RANGE FILTERING
  // ============================================================

  describe("Date Range Filtering", () => {
    test("set start date and verify date filtering works", () => {
      // Arrange
      render(<FinanceDashboard />);

      // Act - Set start date to 2025-09-16
      const startDateInput = getDateInputByLabel("From Date");
      fireEvent.change(startDateInput, { target: { value: "2025-09-16" } });

      // Expand to see results
      const expandAllBtn = screen.getByRole("button", { name: /expand all/i });
      fireEvent.click(expandAllBtn);

      // Assert - Should only show records from 2025-09-16 onwards
      expect(screen.getByText("Pema Lhamo")).toBeInTheDocument(); // 2025-09-16
      expect(screen.getByText("Sonam Tenzin")).toBeInTheDocument(); // 2025-09-16
      expect(screen.getByText("Kinley Dem")).toBeInTheDocument(); // 2025-09-17

      // Should not show earlier records
      expect(screen.queryByText("Tshering Dorji")).not.toBeInTheDocument(); // 2025-09-15
      expect(screen.queryByText("Karma Wangmo")).not.toBeInTheDocument(); // 2025-09-15

      // Verify stats updated
      const studentCountCard = screen
        .getByText("Eligible Students Count")
        .closest(".bg-white");
      const count = within(studentCountCard).getByText("3");
      expect(count).toBeInTheDocument();
    });

    test("set end date and verify date filtering works", () => {
      // Arrange
      render(<FinanceDashboard />);

      // Act - Set end date to 2025-09-15
      const endDateInput = getDateInputByLabel("To Date");
      fireEvent.change(endDateInput, { target: { value: "2025-09-15" } });

      // Expand to see results
      const expandAllBtn = screen.getByRole("button", { name: /expand all/i });
      fireEvent.click(expandAllBtn);

      // Assert - Should only show records up to 2025-09-15
      expect(screen.getByText("Tshering Dorji")).toBeInTheDocument();
      expect(screen.getByText("Karma Wangmo")).toBeInTheDocument();

      // Should not show later records
      expect(screen.queryByText("Pema Lhamo")).not.toBeInTheDocument();
      expect(screen.queryByText("Kinley Dem")).not.toBeInTheDocument();
    });

    test("set date range and verify filtering works", () => {
      // Arrange
      render(<FinanceDashboard />);

      // Act - Set date range to exactly 2025-09-16
      const startDateInput = getDateInputByLabel("From Date");
      const endDateInput = getDateInputByLabel("To Date");

      fireEvent.change(startDateInput, { target: { value: "2025-09-16" } });
      fireEvent.change(endDateInput, { target: { value: "2025-09-16" } });

      // Expand to see results
      const expandAllBtn = screen.getByRole("button", { name: /expand all/i });
      fireEvent.click(expandAllBtn);

      // Assert - Should only show records on 2025-09-16
      expect(screen.getByText("Pema Lhamo")).toBeInTheDocument();
      expect(screen.getByText("Sonam Tenzin")).toBeInTheDocument();

      // Others should not be visible
      expect(screen.queryByText("Tshering Dorji")).not.toBeInTheDocument();
      expect(screen.queryByText("Kinley Dem")).not.toBeInTheDocument();
    });

    test("clear filters resets date filters", () => {
      // Arrange
      render(<FinanceDashboard />);

      // Set date filters
      const startDateInput = getDateInputByLabel("From Date");
      const endDateInput = getDateInputByLabel("To Date");

      fireEvent.change(startDateInput, { target: { value: "2025-09-16" } });
      fireEvent.change(endDateInput, { target: { value: "2025-09-16" } });

      // Act - Clear filters
      const clearBtn = screen.getByRole("button", { name: /clear filters/i });
      fireEvent.click(clearBtn);

      // Assert - Date filters should be reset
      expect(startDateInput.value).toBe("");
      expect(endDateInput.value).toBe("");

      // All records should be visible
      const expandAllBtn = screen.getByRole("button", { name: /expand all/i });
      fireEvent.click(expandAllBtn);
      expect(screen.getByText("Tshering Dorji")).toBeInTheDocument();
      expect(screen.getByText("Kinley Dem")).toBeInTheDocument();
    });

    test("date range filtering works with other filters", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<FinanceDashboard />);

      // Act - Apply date filter and department filter
      const startDateInput = getDateInputByLabel("From Date");
      fireEvent.change(startDateInput, { target: { value: "2025-09-16" } });

      const departmentFilter = screen.getByDisplayValue("All Departments");
      fireEvent.change(departmentFilter, { target: { value: "2" } }); // CNR

      // Expand to see results
      const expandAllBtn = screen.getByRole("button", { name: /expand all/i });
      fireEvent.click(expandAllBtn);

      // Assert - Should show CNR students from 2025-09-16 onwards
      expect(screen.getByText("Pema Lhamo")).toBeInTheDocument();
      expect(screen.getByText("Sonam Tenzin")).toBeInTheDocument();

      // Should not show other departments or earlier dates
      expect(screen.queryByText("Tshering Dorji")).not.toBeInTheDocument();
      expect(screen.queryByText("Kinley Dem")).not.toBeInTheDocument(); // Different dept
    });
  });

  // ============================================================
  // 4. STATS CARDS INTEGRATION
  // ============================================================

  describe("Stats Cards Integration", () => {
    test("stats update when search filter is applied", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<FinanceDashboard />);

      // Initial stats
      const initialStipends = screen
        .getByText("Total Stipends Processed")
        .closest(".bg-white");
      expect(
        within(initialStipends).getAllByText(/Nu/)[0].textContent
      ).toContain("24,800");

      // Act - Search for Tshering
      const searchInput = screen.getByPlaceholderText(
        "Search by student ID or name..."
      );
      await user.type(searchInput, "Tshering");

      // Assert - Stats should update to show only Tshering's amounts
      const filteredStipends = screen
        .getByText("Total Stipends Processed")
        .closest(".bg-white");
      expect(
        within(filteredStipends).getAllByText(/Nu/)[0].textContent
      ).toContain("5,000");

      const filteredDeductions = screen
        .getByText("Total Deductions Applied")
        .closest(".bg-white");
      expect(
        within(filteredDeductions).getAllByText(/Nu/)[0].textContent
      ).toContain("250");

      const studentCount = screen
        .getByText("Eligible Students Count")
        .closest(".bg-white");
      expect(within(studentCount).getByText("1")).toBeInTheDocument();
    });

    test("stats update when department filter is applied", () => {
      // Arrange
      render(<FinanceDashboard />);

      // Act - Filter by CST (department 1)
      const departmentFilter = screen.getByDisplayValue("All Departments");
      fireEvent.change(departmentFilter, { target: { value: "1" } });

      // Assert - Stats should show CST totals only
      const stipendsCard = screen
        .getByText("Total Stipends Processed")
        .closest(".bg-white");
      expect(within(stipendsCard).getAllByText(/Nu/)[0].textContent).toContain(
        "9,800"
      ); // 5000 + 4800

      const deductionsCard = screen
        .getByText("Total Deductions Applied")
        .closest(".bg-white");
      expect(
        within(deductionsCard).getAllByText(/Nu/)[0].textContent
      ).toContain("550"); // 250 + 300

      const studentCountCard = screen
        .getByText("Eligible Students Count")
        .closest(".bg-white");
      expect(within(studentCountCard).getByText("2")).toBeInTheDocument();

      const pendingCard = screen
        .getByText("Pending Approvals")
        .closest(".bg-white");
      expect(within(pendingCard).getByText("1")).toBeInTheDocument(); // Only Karma
    });

    test("stats calculations match filtered data", () => {
      // Arrange
      render(<FinanceDashboard />);

      // Act - Filter by Pending status
      const statusFilter = screen.getByDisplayValue("All Status");
      fireEvent.change(statusFilter, { target: { value: "Pending" } });

      // Assert - Verify stats match pending records
      // Karma (4800) + Kinley (5100) = 9900
      const stipendsCard = screen
        .getByText("Total Stipends Processed")
        .closest(".bg-white");
      expect(within(stipendsCard).getAllByText(/Nu/)[0].textContent).toContain(
        "9,900"
      );

      // Karma (300) + Kinley (100) = 400
      const deductionsCard = screen
        .getByText("Total Deductions Applied")
        .closest(".bg-white");
      expect(
        within(deductionsCard).getAllByText(/Nu/)[0].textContent
      ).toContain("400");

      // Pending count should be 2
      const pendingCard = screen
        .getByText("Pending Approvals")
        .closest(".bg-white");
      expect(within(pendingCard).getByText("2")).toBeInTheDocument();
    });

    test("deduction percentage updates correctly with filters", () => {
      // Arrange
      render(<FinanceDashboard />);

      // Initial percentage
      const initialDeductions = screen
        .getByText("Total Deductions Applied")
        .closest(".bg-white");
      const initialPercentage =
        within(initialDeductions).getByText(/% of stipends/);
      expect(initialPercentage.textContent).toContain("4.0%"); // (1000/24800)*100

      // Act - Filter to show only Tshering (higher deduction %)
      const searchInput = screen.getByPlaceholderText(
        "Search by student ID or name..."
      );
      fireEvent.change(searchInput, { target: { value: "Tshering" } });

      // Assert - Percentage should update
      const filteredDeductions = screen
        .getByText("Total Deductions Applied")
        .closest(".bg-white");
      const filteredPercentage =
        within(filteredDeductions).getByText(/% of stipends/);
      expect(filteredPercentage.textContent).toContain("5.0%"); // (250/5000)*100
    });

    test("payment count in stats matches filtered records", () => {
      // Arrange
      render(<FinanceDashboard />);

      // Initial count
      const initialStipends = screen
        .getByText("Total Stipends Processed")
        .closest(".bg-white");
      expect(
        within(initialStipends).getByText("5 payments")
      ).toBeInTheDocument();

      // Act - Filter by department
      const departmentFilter = screen.getByDisplayValue("All Departments");
      fireEvent.change(departmentFilter, { target: { value: "3" } }); // Sherubtse

      // Assert - Payment count should update to 1
      const filteredStipends = screen
        .getByText("Total Stipends Processed")
        .closest(".bg-white");
      expect(
        within(filteredStipends).getByText("1 payments")
      ).toBeInTheDocument();

      const studentCountCard = screen
        .getByText("Eligible Students Count")
        .closest(".bg-white");
      expect(within(studentCountCard).getByText("1")).toBeInTheDocument();
    });

    test("stats reflect no results when filters exclude all records", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<FinanceDashboard />);

      // Act - Search for non-existent student
      const searchInput = screen.getByPlaceholderText(
        "Search by student ID or name..."
      );
      await user.type(searchInput, "NonExistentStudent");

      // Assert - All stats should show zero
      const stipendsCard = screen
        .getByText("Total Stipends Processed")
        .closest(".bg-white");
      expect(within(stipendsCard).getAllByText(/Nu/)[0].textContent).toContain(
        "0"
      );

      const deductionsCard = screen
        .getByText("Total Deductions Applied")
        .closest(".bg-white");
      expect(
        within(deductionsCard).getAllByText(/Nu/)[0].textContent
      ).toContain("0");

      const studentCountCard = screen
        .getByText("Eligible Students Count")
        .closest(".bg-white");
      expect(within(studentCountCard).getByText("0")).toBeInTheDocument();

      const pendingCard = screen
        .getByText("Pending Approvals")
        .closest(".bg-white");
      expect(within(pendingCard).getByText("0")).toBeInTheDocument();

      // Empty state message should be shown
      expect(
        screen.getByText("No financial records found")
      ).toBeInTheDocument();
    });
  });

  // ============================================================
  // 5. EXPORT FUNCTIONALITY
  // ============================================================

  describe("Export Functionality", () => {
    test("export button is present and clickable", () => {
      // Arrange
      render(<FinanceDashboard />);

      // Assert
      const exportBtn = screen.getByRole("button", { name: /export report/i });
      expect(exportBtn).toBeInTheDocument();
      expect(exportBtn).toBeEnabled();

      // Act - Click should not throw error
      expect(() => fireEvent.click(exportBtn)).not.toThrow();
    });

    test("export button accessible after applying filters", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<FinanceDashboard />);

      // Act - Apply filters
      const searchInput = screen.getByPlaceholderText(
        "Search by student ID or name..."
      );
      await user.type(searchInput, "Karma");

      // Assert - Export button still accessible
      const exportBtn = screen.getByRole("button", { name: /export report/i });
      expect(exportBtn).toBeInTheDocument();
      expect(exportBtn).toBeEnabled();
    });

    test("export button has correct icon", () => {
      // Arrange
      render(<FinanceDashboard />);

      // Assert - Button should have download icon
      const exportBtn = screen.getByRole("button", { name: /export report/i });
      const svg = exportBtn.querySelector("svg");
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveClass("lucide-download");
    });
  });

  // ============================================================
  // 6. COMPLEX USER WORKFLOWS
  // ============================================================

  describe("Complex User Workflows", () => {
    test("complete workflow: search, filter, expand, and verify data consistency", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<FinanceDashboard />);

      // Step 1: Search for students containing 'a'
      const searchInput = screen.getByPlaceholderText(
        "Search by student ID or name..."
      );
      await user.type(searchInput, "a");

      // Step 2: Filter by College of Natural Resources
      const departmentFilter = screen.getByDisplayValue("All Departments");
      fireEvent.change(departmentFilter, { target: { value: "2" } });

      // Step 3: Expand departments
      const expandAllBtn = screen.getByRole("button", { name: /expand all/i });
      fireEvent.click(expandAllBtn);

      // Assert - Should show only CNR students with 'a' in name
      expect(screen.getByText("Pema Lhamo")).toBeInTheDocument();
      expect(screen.getByText("Sonam Tenzin")).toBeInTheDocument();
      expect(screen.queryByText("Karma Wangmo")).not.toBeInTheDocument(); // Different dept

      // Step 4: Verify stats consistency
      const studentCountCard = screen
        .getByText("Eligible Students Count")
        .closest(".bg-white");
      expect(within(studentCountCard).getByText("2")).toBeInTheDocument();

      const stipendsCard = screen
        .getByText("Total Stipends Processed")
        .closest(".bg-white");
      expect(within(stipendsCard).getAllByText(/Nu/)[0].textContent).toContain(
        "9,900"
      ); // 5200 + 4700
    });

    test("workflow: filter by status, set date range, verify and export", async () => {
      // Arrange
      render(<FinanceDashboard />);

      // Step 1: Filter by Pending status (we know Karma and Kinley are Pending)
      const statusFilter = screen.getByDisplayValue("All Status");
      fireEvent.change(statusFilter, { target: { value: "Pending" } });

      // Step 2: Verify filtering worked
      await waitFor(() => {
        const deptRows = getDepartmentRows();
        expect(deptRows.length).toBeGreaterThan(0);
      });

      // Step 3: Set date range to 2025-09-15 onwards
      const startDateInput = getDateInputByLabel("From Date");
      fireEvent.change(startDateInput, { target: { value: "2025-09-15" } });

      // Step 4: Expand and verify records are present
      const expandAllBtn = screen.getByRole("button", { name: /expand all/i });
      fireEvent.click(expandAllBtn);

      // Should have Pending students (Karma 09-15, Kinley 09-17)
      await waitFor(() => {
        const karmaElements = screen.queryAllByText("Karma Wangmo");
        expect(karmaElements.length).toBeGreaterThan(0);
      });

      // Step 5: Verify export button still works
      const exportBtn = screen.getByRole("button", { name: /export report/i });
      expect(exportBtn).toBeEnabled();
      fireEvent.click(exportBtn);
    });

    test("workflow: expand departments, apply filters, maintain expansion state", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<FinanceDashboard />);

      // Step 1: Expand all departments
      const expandAllBtn = screen.getByRole("button", { name: /expand all/i });
      fireEvent.click(expandAllBtn);

      // Verify all students visible
      expect(screen.getByText("Tshering Dorji")).toBeInTheDocument();
      expect(screen.getByText("Kinley Dem")).toBeInTheDocument();

      // Step 2: Apply search filter
      const searchInput = screen.getByPlaceholderText(
        "Search by student ID or name..."
      );
      await user.type(searchInput, "Pema");

      // Step 3: Verify filtered student still visible (expansion maintained)
      expect(screen.getByText("Pema Lhamo")).toBeInTheDocument();
      expect(screen.queryByText("Tshering Dorji")).not.toBeInTheDocument();

      // Step 4: Clear filter
      const clearBtn = screen.getByRole("button", { name: /clear filters/i });
      fireEvent.click(clearBtn);

      // Step 5: Verify all students visible again
      expect(screen.getByText("Tshering Dorji")).toBeInTheDocument();
      expect(screen.getByText("Pema Lhamo")).toBeInTheDocument();
      expect(screen.getByText("Kinley Dem")).toBeInTheDocument();
    });

    test("workflow: complex filtering then reset to initial state", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<FinanceDashboard />);

      // Capture initial state
      const initialStipends = screen
        .getByText("Total Stipends Processed")
        .closest(".bg-white");
      const initialAmount =
        within(initialStipends).getAllByText(/Nu/)[0].textContent;

      // Apply complex filters
      await user.type(
        screen.getByPlaceholderText("Search by student ID or name..."),
        "Karma"
      );
      fireEvent.change(screen.getByDisplayValue("All Departments"), {
        target: { value: "1" },
      });
      fireEvent.change(screen.getByDisplayValue("All Status"), {
        target: { value: "Pending" },
      });

      const startDateInput = getDateInputByLabel("From Date");
      fireEvent.change(startDateInput, { target: { value: "2025-09-15" } });

      // Verify filtered state
      const filteredStipends = screen
        .getByText("Total Stipends Processed")
        .closest(".bg-white");
      const filteredAmount =
        within(filteredStipends).getAllByText(/Nu/)[0].textContent;
      expect(filteredAmount).not.toBe(initialAmount);

      // Clear all filters
      fireEvent.click(screen.getByRole("button", { name: /clear filters/i }));

      // Verify back to initial state
      const resetStipends = screen
        .getByText("Total Stipends Processed")
        .closest(".bg-white");
      const resetAmount =
        within(resetStipends).getAllByText(/Nu/)[0].textContent;
      expect(resetAmount).toBe(initialAmount);
      expect(resetAmount).toContain("24,800");
    });
  });

  // ============================================================
  // 7. ERROR HANDLING AND EDGE CASES
  // ============================================================

  describe("Error Handling and Edge Cases", () => {
    test("handles rapid filter changes gracefully", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<FinanceDashboard />);

      // Act - Rapidly change filters
      const searchInput = screen.getByPlaceholderText(
        "Search by student ID or name..."
      );
      await user.type(searchInput, "Tshering");
      await user.clear(searchInput);
      await user.type(searchInput, "Karma");
      await user.clear(searchInput);
      await user.type(searchInput, "Pema");

      // Assert - Should not crash and show correct result
      const expandAllBtn = screen.getByRole("button", { name: /expand all/i });
      fireEvent.click(expandAllBtn);
      expect(screen.getByText("Pema Lhamo")).toBeInTheDocument();
    });

    test("maintains UI consistency when no records match filters", async () => {
      // Arrange
      const user = userEvent.setup();
      render(<FinanceDashboard />);

      // Act - Filter to show no results
      await user.type(
        screen.getByPlaceholderText("Search by student ID or name..."),
        "XYZ"
      );

      // Assert - UI should be consistent
      expect(
        screen.getByText("No financial records found")
      ).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /expand all/i })).toBeEnabled();
      expect(
        screen.getByRole("button", { name: /clear filters/i })
      ).toBeEnabled();
      expect(
        screen.getByRole("button", { name: /export report/i })
      ).toBeEnabled();
    });

    test("handles department filter changes while department is expanded", () => {
      // Arrange
      render(<FinanceDashboard />);

      // Expand CST
      const cstDepartment = screen.getAllByText(
        "College of Science and Technology"
      )[1];
      fireEvent.click(cstDepartment);
      expect(screen.getByText("Tshering Dorji")).toBeInTheDocument();

      // Act - Filter to different department
      const departmentFilter = screen.getByDisplayValue("All Departments");
      fireEvent.change(departmentFilter, { target: { value: "2" } });

      // Assert - Should show new department, old students not visible
      expect(screen.queryByText("Tshering Dorji")).not.toBeInTheDocument();
      expect(
        screen.getAllByText("College of Natural Resources")[1]
      ).toBeInTheDocument();
    });
  });
});
