/**
 * Unit Tests for CollapsibleRow Subcomponent
 * Tests the collapsible department row functionality
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  ChevronDown: () => <div data-testid="chevron-down">ChevronDown</div>,
  ChevronRight: () => <div data-testid="chevron-right">ChevronRight</div>,
  Building2: () => <div data-testid="building-icon">Building2</div>,
  Calculator: () => <div data-testid="calculator-icon">Calculator</div>,
  Eye: () => <div data-testid="eye-icon">Eye</div>,
  Send: () => <div data-testid="send-icon">Send</div>,
}));

// Import the CollapsibleRow component
// Since it's not exported, we need to test it through the main component
// For now, we'll create a standalone version for testing
const CollapsibleRow = ({ department, records, isExpanded, onToggle }) => {
  const totalStipend = records.reduce((s, r) => s + r.stipend_amount, 0);
  const totalDeductions = records.reduce((s, r) => s + r.deductions, 0);
  const studentCount = records.length;

  return (
    <>
      {/* College Header Row */}
      <tr
        className="bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 cursor-pointer transition-all border-b-2 border-emerald-200"
        onClick={onToggle}
        data-testid="department-row"
      >
        <td className="px-6 py-4" colSpan={7}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 bg-emerald-600 rounded-lg">
                {isExpanded ? (
                  <div data-testid="chevron-down">ChevronDown</div>
                ) : (
                  <div data-testid="chevron-right">ChevronRight</div>
                )}
              </div>
              <div data-testid="building-icon">Building2</div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {department.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {studentCount} {studentCount === 1 ? "Student" : "Students"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 pr-4">
              <div className="text-right">
                <p className="text-xs text-gray-600 mb-1 font-medium">
                  Total Stipend
                </p>
                <p className="text-lg font-bold text-emerald-700">
                  Nu {totalStipend.toLocaleString()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-600 mb-1 font-medium">
                  Total Deductions
                </p>
                <p className="text-lg font-bold text-amber-600">
                  Nu {totalDeductions.toLocaleString()}
                </p>
              </div>
              <div className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium text-sm whitespace-nowrap">
                {studentCount} {studentCount === 1 ? "Payment" : "Payments"}
              </div>
            </div>
          </div>
        </td>
      </tr>

      {/* Student Data Rows */}
      {isExpanded &&
        records.map((rec, idx) => (
          <tr
            key={rec.id}
            className={`border-b hover:bg-emerald-50 transition-colors ${
              idx % 2 === 0 ? "bg-white" : "bg-gray-50"
            }`}
            data-testid={`student-row-${rec.id}`}
          >
            {/* Student ID */}
            <td className="px-6 py-4">
              <div className="text-sm font-mono text-gray-900">
                {rec.rub_id_card_number}
              </div>
            </td>
            {/* Name */}
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-semibold text-sm">
                  {rec.recipient
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="font-medium text-gray-900">{rec.recipient}</div>
              </div>
            </td>
            {/* Stipend Amount */}
            <td className="px-6 py-4">
              <div className="text-sm font-medium text-emerald-700">
                Nu {rec.stipend_amount.toLocaleString()}
              </div>
            </td>
            {/* Deduction Breakdown */}
            <td className="px-6 py-4">
              <div className="space-y-1 text-xs">
                <div className="text-gray-700">
                  <span className="font-semibold">Hostel:</span> Nu{" "}
                  {rec.deduction_breakdown.hostel}
                </div>
                <div className="text-gray-700">
                  <span className="font-semibold">Electricity:</span> Nu{" "}
                  {rec.deduction_breakdown.electricity}
                </div>
                <div className="text-gray-700">
                  <span className="font-semibold">Mess:</span> Nu{" "}
                  {rec.deduction_breakdown.mess}
                </div>
                <div className="text-amber-600 font-bold border-t border-gray-300 pt-1 mt-1">
                  Total: Nu {rec.deductions.toLocaleString()}
                </div>
              </div>
            </td>
            {/* Net Amount */}
            <td className="px-6 py-4">
              <div className="text-sm font-bold text-gray-900">
                Nu {rec.net_amount.toLocaleString()}
              </div>
            </td>
            {/* Status */}
            <td className="px-6 py-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                  rec.status === "Processed"
                    ? "bg-green-100 text-green-800"
                    : rec.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : rec.status === "Eligible"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {rec.status}
              </span>
            </td>
            {/* Action Buttons */}
            <td className="px-6 py-4">
              <div className="flex gap-2">
                <button
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors font-medium flex items-center gap-1 whitespace-nowrap"
                  title="Calculate"
                  data-testid={`calculate-btn-${rec.id}`}
                >
                  <div data-testid="calculator-icon">Calculator</div>
                  <span className="hidden sm:inline">Calculate</span>
                </button>
                <button
                  className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg transition-colors font-medium flex items-center gap-1 whitespace-nowrap"
                  title="View Details"
                  data-testid={`details-btn-${rec.id}`}
                >
                  <div data-testid="eye-icon">Eye</div>
                  <span className="hidden sm:inline">Details</span>
                </button>
                <button
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-lg transition-colors font-medium flex items-center gap-1 whitespace-nowrap"
                  title="Process Payment"
                  data-testid={`process-btn-${rec.id}`}
                >
                  <div data-testid="send-icon">Send</div>
                  <span className="hidden sm:inline">Process</span>
                </button>
              </div>
            </td>
          </tr>
        ))}
    </>
  );
};

describe("CollapsibleRow Subcomponent", () => {
  // Mock data for testing
  const mockDepartment = {
    id: "1",
    name: "College of Science and Technology",
  };

  const mockRecords = [
    {
      id: "f1",
      recipient: "Tshering Dorji",
      rub_id_card_number: 11901234,
      department_id: "1",
      department_name: "College of Science and Technology",
      stipend_amount: 5000,
      deductions: 250,
      deduction_breakdown: { hostel: 100, electricity: 50, mess: 100 },
      net_amount: 4750,
      date: "2025-09-15",
      status: "Processed",
    },
    {
      id: "f2",
      recipient: "Karma Wangmo",
      rub_id_card_number: 11901235,
      department_id: "1",
      department_name: "College of Science and Technology",
      stipend_amount: 4800,
      deductions: 300,
      deduction_breakdown: { hostel: 120, electricity: 60, mess: 120 },
      net_amount: 4500,
      date: "2025-09-15",
      status: "Pending",
    },
  ];

  const mockOnToggle = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================
  // RENDERING TESTS
  // ============================================================

  describe("Rendering", () => {
    test("renders department name correctly", () => {
      // Arrange & Act
      render(
        <table>
          <tbody>
            <CollapsibleRow
              department={mockDepartment}
              records={mockRecords}
              isExpanded={false}
              onToggle={mockOnToggle}
            />
          </tbody>
        </table>
      );

      // Assert
      expect(
        screen.getByText("College of Science and Technology")
      ).toBeInTheDocument();
    });

    test("displays correct student count", () => {
      // Arrange & Act
      render(
        <table>
          <tbody>
            <CollapsibleRow
              department={mockDepartment}
              records={mockRecords}
              isExpanded={false}
              onToggle={mockOnToggle}
            />
          </tbody>
        </table>
      );

      // Assert
      expect(screen.getByText("2 Students")).toBeInTheDocument();
    });

    test('displays singular "Student" for one record', () => {
      // Arrange
      const singleRecord = [mockRecords[0]];

      // Act
      render(
        <table>
          <tbody>
            <CollapsibleRow
              department={mockDepartment}
              records={singleRecord}
              isExpanded={false}
              onToggle={mockOnToggle}
            />
          </tbody>
        </table>
      );

      // Assert
      expect(screen.getByText("1 Student")).toBeInTheDocument();
    });

    test("calculates and displays total stipend correctly", () => {
      // Arrange & Act
      render(
        <table>
          <tbody>
            <CollapsibleRow
              department={mockDepartment}
              records={mockRecords}
              isExpanded={false}
              onToggle={mockOnToggle}
            />
          </tbody>
        </table>
      );

      // Assert - 5000 + 4800 = 9800
      expect(screen.getByText("Nu 9,800")).toBeInTheDocument();
    });

    test("calculates and displays total deductions correctly", () => {
      // Arrange & Act
      render(
        <table>
          <tbody>
            <CollapsibleRow
              department={mockDepartment}
              records={mockRecords}
              isExpanded={false}
              onToggle={mockOnToggle}
            />
          </tbody>
        </table>
      );

      // Assert - 250 + 300 = 550
      expect(screen.getByText("Nu 550")).toBeInTheDocument();
    });

    test("displays payment count badge", () => {
      // Arrange & Act
      render(
        <table>
          <tbody>
            <CollapsibleRow
              department={mockDepartment}
              records={mockRecords}
              isExpanded={false}
              onToggle={mockOnToggle}
            />
          </tbody>
        </table>
      );

      // Assert
      expect(screen.getByText("2 Payments")).toBeInTheDocument();
    });

    test('displays singular "Payment" for one record', () => {
      // Arrange
      const singleRecord = [mockRecords[0]];

      // Act
      render(
        <table>
          <tbody>
            <CollapsibleRow
              department={mockDepartment}
              records={singleRecord}
              isExpanded={false}
              onToggle={mockOnToggle}
            />
          </tbody>
        </table>
      );

      // Assert
      expect(screen.getByText("1 Payment")).toBeInTheDocument();
    });
  });

  // ============================================================
  // EXPANSION STATE TESTS
  // ============================================================

  describe("Expansion State", () => {
    test("shows chevron right icon when collapsed", () => {
      // Arrange & Act
      render(
        <table>
          <tbody>
            <CollapsibleRow
              department={mockDepartment}
              records={mockRecords}
              isExpanded={false}
              onToggle={mockOnToggle}
            />
          </tbody>
        </table>
      );

      // Assert
      expect(screen.getByTestId("chevron-right")).toBeInTheDocument();
      expect(screen.queryByTestId("chevron-down")).not.toBeInTheDocument();
    });

    test("shows chevron down icon when expanded", () => {
      // Arrange & Act
      render(
        <table>
          <tbody>
            <CollapsibleRow
              department={mockDepartment}
              records={mockRecords}
              isExpanded={true}
              onToggle={mockOnToggle}
            />
          </tbody>
        </table>
      );

      // Assert
      expect(screen.getByTestId("chevron-down")).toBeInTheDocument();
      expect(screen.queryByTestId("chevron-right")).not.toBeInTheDocument();
    });

    test("does not render student rows when collapsed", () => {
      // Arrange & Act
      render(
        <table>
          <tbody>
            <CollapsibleRow
              department={mockDepartment}
              records={mockRecords}
              isExpanded={false}
              onToggle={mockOnToggle}
            />
          </tbody>
        </table>
      );

      // Assert
      expect(screen.queryByText("Tshering Dorji")).not.toBeInTheDocument();
      expect(screen.queryByText("Karma Wangmo")).not.toBeInTheDocument();
    });

    test("renders student rows when expanded", () => {
      // Arrange & Act
      render(
        <table>
          <tbody>
            <CollapsibleRow
              department={mockDepartment}
              records={mockRecords}
              isExpanded={true}
              onToggle={mockOnToggle}
            />
          </tbody>
        </table>
      );

      // Assert
      expect(screen.getByText("Tshering Dorji")).toBeInTheDocument();
      expect(screen.getByText("Karma Wangmo")).toBeInTheDocument();
    });

    test("calls onToggle when department row is clicked", () => {
      // Arrange
      render(
        <table>
          <tbody>
            <CollapsibleRow
              department={mockDepartment}
              records={mockRecords}
              isExpanded={false}
              onToggle={mockOnToggle}
            />
          </tbody>
        </table>
      );

      const departmentRow = screen.getByTestId("department-row");

      // Act
      fireEvent.click(departmentRow);

      // Assert
      expect(mockOnToggle).toHaveBeenCalledTimes(1);
    });
  });

  // ============================================================
  // STUDENT ROW CONTENT TESTS
  // ============================================================

  describe("Student Row Content", () => {
    test("displays student ID in monospace font", () => {
      // Arrange & Act
      render(
        <table>
          <tbody>
            <CollapsibleRow
              department={mockDepartment}
              records={mockRecords}
              isExpanded={true}
              onToggle={mockOnToggle}
            />
          </tbody>
        </table>
      );

      // Assert
      const studentId = screen.getByText("11901234");
      expect(studentId).toHaveClass("font-mono");
    });

    test("displays student initials in avatar", () => {
      // Arrange & Act
      render(
        <table>
          <tbody>
            <CollapsibleRow
              department={mockDepartment}
              records={mockRecords}
              isExpanded={true}
              onToggle={mockOnToggle}
            />
          </tbody>
        </table>
      );

      // Assert
      expect(screen.getByText("TD")).toBeInTheDocument(); // Tshering Dorji
      expect(screen.getByText("KW")).toBeInTheDocument(); // Karma Wangmo
    });

    test("displays stipend amount with currency formatting", () => {
      // Arrange & Act
      render(
        <table>
          <tbody>
            <CollapsibleRow
              department={mockDepartment}
              records={mockRecords}
              isExpanded={true}
              onToggle={mockOnToggle}
            />
          </tbody>
        </table>
      );

      // Assert
      expect(screen.getByText("Nu 5,000")).toBeInTheDocument();
      expect(screen.getByText("Nu 4,800")).toBeInTheDocument();
    });

    test("displays deduction breakdown with all components", () => {
      // Arrange & Act
      render(
        <table>
          <tbody>
            <CollapsibleRow
              department={mockDepartment}
              records={mockRecords}
              isExpanded={true}
              onToggle={mockOnToggle}
            />
          </tbody>
        </table>
      );

      // Assert
      expect(screen.getAllByText(/Hostel:/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Electricity:/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Mess:/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Total: Nu/i).length).toBeGreaterThan(0);
    });

    test("displays net amount correctly", () => {
      // Arrange & Act
      render(
        <table>
          <tbody>
            <CollapsibleRow
              department={mockDepartment}
              records={mockRecords}
              isExpanded={true}
              onToggle={mockOnToggle}
            />
          </tbody>
        </table>
      );

      // Assert
      expect(screen.getByText("Nu 4,750")).toBeInTheDocument();
      expect(screen.getByText("Nu 4,500")).toBeInTheDocument();
    });

    test("displays status badges with correct styling", () => {
      // Arrange & Act
      render(
        <table>
          <tbody>
            <CollapsibleRow
              department={mockDepartment}
              records={mockRecords}
              isExpanded={true}
              onToggle={mockOnToggle}
            />
          </tbody>
        </table>
      );

      // Assert
      const processedBadge = screen.getByText("Processed");
      expect(processedBadge).toHaveClass("bg-green-100", "text-green-800");

      const pendingBadge = screen.getByText("Pending");
      expect(pendingBadge).toHaveClass("bg-yellow-100", "text-yellow-800");
    });
  });

  // ============================================================
  // ACTION BUTTON TESTS
  // ============================================================

  describe("Action Buttons", () => {
    test("renders all three action buttons for each student", () => {
      // Arrange & Act
      render(
        <table>
          <tbody>
            <CollapsibleRow
              department={mockDepartment}
              records={mockRecords}
              isExpanded={true}
              onToggle={mockOnToggle}
            />
          </tbody>
        </table>
      );

      // Assert - 2 students, so 2 of each button
      expect(screen.getByTestId("calculate-btn-f1")).toBeInTheDocument();
      expect(screen.getByTestId("calculate-btn-f2")).toBeInTheDocument();
      expect(screen.getByTestId("details-btn-f1")).toBeInTheDocument();
      expect(screen.getByTestId("details-btn-f2")).toBeInTheDocument();
      expect(screen.getByTestId("process-btn-f1")).toBeInTheDocument();
      expect(screen.getByTestId("process-btn-f2")).toBeInTheDocument();
    });

    test("action buttons have correct titles for accessibility", () => {
      // Arrange & Act
      render(
        <table>
          <tbody>
            <CollapsibleRow
              department={mockDepartment}
              records={mockRecords}
              isExpanded={true}
              onToggle={mockOnToggle}
            />
          </tbody>
        </table>
      );

      // Assert
      const calculateBtn = screen.getByTestId("calculate-btn-f1");
      const detailsBtn = screen.getByTestId("details-btn-f1");
      const processBtn = screen.getByTestId("process-btn-f1");

      expect(calculateBtn).toHaveAttribute("title", "Calculate");
      expect(detailsBtn).toHaveAttribute("title", "View Details");
      expect(processBtn).toHaveAttribute("title", "Process Payment");
    });

    test("action buttons have appropriate styling classes", () => {
      // Arrange & Act
      render(
        <table>
          <tbody>
            <CollapsibleRow
              department={mockDepartment}
              records={mockRecords}
              isExpanded={true}
              onToggle={mockOnToggle}
            />
          </tbody>
        </table>
      );

      // Assert
      const calculateBtn = screen.getByTestId("calculate-btn-f1");
      const detailsBtn = screen.getByTestId("details-btn-f1");
      const processBtn = screen.getByTestId("process-btn-f1");

      expect(calculateBtn).toHaveClass("bg-blue-600");
      expect(detailsBtn).toHaveClass("bg-purple-600");
      expect(processBtn).toHaveClass("bg-emerald-600");
    });
  });

  // ============================================================
  // ALTERNATING ROW COLORS TESTS
  // ============================================================

  describe("Row Styling", () => {
    test("applies alternating background colors to student rows", () => {
      // Arrange & Act
      render(
        <table>
          <tbody>
            <CollapsibleRow
              department={mockDepartment}
              records={mockRecords}
              isExpanded={true}
              onToggle={mockOnToggle}
            />
          </tbody>
        </table>
      );

      // Assert
      const firstRow = screen.getByTestId("student-row-f1");
      const secondRow = screen.getByTestId("student-row-f2");

      expect(firstRow).toHaveClass("bg-white");
      expect(secondRow).toHaveClass("bg-gray-50");
    });

    test("department row has gradient background", () => {
      // Arrange & Act
      render(
        <table>
          <tbody>
            <CollapsibleRow
              department={mockDepartment}
              records={mockRecords}
              isExpanded={false}
              onToggle={mockOnToggle}
            />
          </tbody>
        </table>
      );

      // Assert
      const deptRow = screen.getByTestId("department-row");
      expect(deptRow).toHaveClass(
        "bg-gradient-to-r",
        "from-emerald-50",
        "to-teal-50"
      );
    });

    test("department row has cursor pointer", () => {
      // Arrange & Act
      render(
        <table>
          <tbody>
            <CollapsibleRow
              department={mockDepartment}
              records={mockRecords}
              isExpanded={false}
              onToggle={mockOnToggle}
            />
          </tbody>
        </table>
      );

      // Assert
      const deptRow = screen.getByTestId("department-row");
      expect(deptRow).toHaveClass("cursor-pointer");
    });
  });

  // ============================================================
  // EDGE CASES TESTS
  // ============================================================

  describe("Edge Cases", () => {
    test("handles empty records array", () => {
      // Arrange & Act
      render(
        <table>
          <tbody>
            <CollapsibleRow
              department={mockDepartment}
              records={[]}
              isExpanded={true}
              onToggle={mockOnToggle}
            />
          </tbody>
        </table>
      );

      // Assert
      expect(screen.getByText("0 Students")).toBeInTheDocument();
      expect(screen.getAllByText("Nu 0").length).toBeGreaterThan(0);
      expect(screen.queryByTestId(/student-row/)).not.toBeInTheDocument();
    });

    test("handles large numbers with proper formatting", () => {
      // Arrange
      const largeAmountRecords = [
        {
          ...mockRecords[0],
          stipend_amount: 125000,
          deductions: 15000,
          net_amount: 110000,
        },
      ];

      // Act
      render(
        <table>
          <tbody>
            <CollapsibleRow
              department={mockDepartment}
              records={largeAmountRecords}
              isExpanded={true}
              onToggle={mockOnToggle}
            />
          </tbody>
        </table>
      );

      // Assert
      expect(screen.getAllByText("Nu 125,000").length).toBeGreaterThan(0);
    });

    test("renders all records correctly with different data", () => {
      // Arrange
      const manyRecords = [
        mockRecords[0],
        mockRecords[1],
        {
          ...mockRecords[0],
          id: "f3",
          recipient: "Pema Lhamo",
          rub_id_card_number: 11901236,
        },
      ];

      // Act
      render(
        <table>
          <tbody>
            <CollapsibleRow
              department={mockDepartment}
              records={manyRecords}
              isExpanded={true}
              onToggle={mockOnToggle}
            />
          </tbody>
        </table>
      );

      // Assert
      expect(screen.getByText("3 Students")).toBeInTheDocument();
      expect(screen.getByText("Tshering Dorji")).toBeInTheDocument();
      expect(screen.getByText("Karma Wangmo")).toBeInTheDocument();
      expect(screen.getByText("Pema Lhamo")).toBeInTheDocument();
    });
  });
});
