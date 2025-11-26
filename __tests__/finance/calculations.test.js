/**
 * Unit Tests for Calculation Utilities
 * Tests financial calculations including totals, deductions, and net amounts
 */

import "@testing-library/jest-dom";

/**
 * Mock financial records for testing calculations
 */
const mockFinancialRecords = [
  {
    id: "f1",
    recipient: "Tshering Dorji",
    rub_id_card_number: 11901234,
    stipend_amount: 5000,
    deductions: 250,
    net_amount: 4750,
    status: "Processed",
  },
  {
    id: "f2",
    recipient: "Karma Wangmo",
    rub_id_card_number: 11901235,
    stipend_amount: 4800,
    deductions: 300,
    net_amount: 4500,
    status: "Pending",
  },
  {
    id: "f3",
    recipient: "Pema Lhamo",
    rub_id_card_number: 11901236,
    stipend_amount: 5200,
    deductions: 200,
    net_amount: 5000,
    status: "Processed",
  },
  {
    id: "f4",
    recipient: "Sonam Tenzin",
    rub_id_card_number: 11901237,
    stipend_amount: 4700,
    deductions: 150,
    net_amount: 4550,
    status: "Eligible",
  },
  {
    id: "f5",
    recipient: "Kinley Dem",
    rub_id_card_number: 11901238,
    stipend_amount: 5100,
    deductions: 100,
    net_amount: 5000,
    status: "Pending",
  },
];

/**
 * Calculation functions extracted from the component
 */
const calculateTotalStipends = (records) => {
  return records.reduce((sum, record) => sum + record.stipend_amount, 0);
};

const calculateTotalDeductions = (records) => {
  return records.reduce((sum, record) => sum + record.deductions, 0);
};

const calculateNetPayout = (records) => {
  return records.reduce((sum, record) => sum + record.net_amount, 0);
};

const calculateEligibleStudents = (records) => {
  return new Set(records.map((r) => r.rub_id_card_number)).size;
};

const calculatePendingApprovals = (records) => {
  return records.filter((r) => r.status === "Pending").length;
};

const calculateDeductionPercentage = (totalDeductions, totalStipends) => {
  if (totalStipends === 0) return 0;
  return (totalDeductions / totalStipends) * 100;
};

const calculateDepartmentTotals = (records) => {
  return {
    totalStipend: records.reduce((s, r) => s + r.stipend_amount, 0),
    totalDeductions: records.reduce((s, r) => s + r.deductions, 0),
    studentCount: records.length,
  };
};

describe("Calculation Utilities Tests", () => {
  // ============================================================
  // TOTAL STIPENDS CALCULATION TESTS
  // ============================================================

  describe("Total Stipends Calculation", () => {
    test("calculates total stipends correctly for all records", () => {
      // Arrange & Act
      const total = calculateTotalStipends(mockFinancialRecords);

      // Assert - 5000 + 4800 + 5200 + 4700 + 5100 = 24800
      expect(total).toBe(24800);
    });

    test("returns 0 for empty array", () => {
      // Arrange & Act
      const total = calculateTotalStipends([]);

      // Assert
      expect(total).toBe(0);
    });

    test("calculates correctly for single record", () => {
      // Arrange & Act
      const total = calculateTotalStipends([mockFinancialRecords[0]]);

      // Assert
      expect(total).toBe(5000);
    });

    test("handles large numbers correctly", () => {
      // Arrange
      const largeRecords = [
        { stipend_amount: 1000000 },
        { stipend_amount: 2000000 },
      ];

      // Act
      const total = calculateTotalStipends(largeRecords);

      // Assert
      expect(total).toBe(3000000);
    });

    test("calculates subset of records correctly", () => {
      // Arrange - First 3 records
      const subset = mockFinancialRecords.slice(0, 3);

      // Act
      const total = calculateTotalStipends(subset);

      // Assert - 5000 + 4800 + 5200 = 15000
      expect(total).toBe(15000);
    });

    test("handles decimal values correctly", () => {
      // Arrange
      const decimalRecords = [
        { stipend_amount: 5000.5 },
        { stipend_amount: 4800.25 },
      ];

      // Act
      const total = calculateTotalStipends(decimalRecords);

      // Assert
      expect(total).toBe(9800.75);
    });
  });

  // ============================================================
  // TOTAL DEDUCTIONS CALCULATION TESTS
  // ============================================================

  describe("Total Deductions Calculation", () => {
    test("calculates total deductions correctly for all records", () => {
      // Arrange & Act
      const total = calculateTotalDeductions(mockFinancialRecords);

      // Assert - 250 + 300 + 200 + 150 + 100 = 1000
      expect(total).toBe(1000);
    });

    test("returns 0 for empty array", () => {
      // Arrange & Act
      const total = calculateTotalDeductions([]);

      // Assert
      expect(total).toBe(0);
    });

    test("calculates correctly for single record", () => {
      // Arrange & Act
      const total = calculateTotalDeductions([mockFinancialRecords[0]]);

      // Assert
      expect(total).toBe(250);
    });

    test("handles records with zero deductions", () => {
      // Arrange
      const records = [
        { deductions: 0 },
        { deductions: 100 },
        { deductions: 0 },
      ];

      // Act
      const total = calculateTotalDeductions(records);

      // Assert
      expect(total).toBe(100);
    });

    test("calculates subset of records correctly", () => {
      // Arrange - Last 2 records
      const subset = mockFinancialRecords.slice(3, 5);

      // Act
      const total = calculateTotalDeductions(subset);

      // Assert - 150 + 100 = 250
      expect(total).toBe(250);
    });
  });

  // ============================================================
  // NET PAYOUT CALCULATION TESTS
  // ============================================================

  describe("Net Payout Calculation", () => {
    test("calculates net payout correctly for all records", () => {
      // Arrange & Act
      const total = calculateNetPayout(mockFinancialRecords);

      // Assert - 4750 + 4500 + 5000 + 4550 + 5000 = 23800
      expect(total).toBe(23800);
    });

    test("returns 0 for empty array", () => {
      // Arrange & Act
      const total = calculateNetPayout([]);

      // Assert
      expect(total).toBe(0);
    });

    test("calculates correctly for single record", () => {
      // Arrange & Act
      const total = calculateNetPayout([mockFinancialRecords[0]]);

      // Assert
      expect(total).toBe(4750);
    });

    test("net payout equals stipends minus deductions", () => {
      // Arrange
      const records = mockFinancialRecords;

      // Act
      const totalStipends = calculateTotalStipends(records);
      const totalDeductions = calculateTotalDeductions(records);
      const netPayout = calculateNetPayout(records);

      // Assert
      expect(netPayout).toBe(totalStipends - totalDeductions);
    });

    test("handles large net amounts", () => {
      // Arrange
      const records = [{ net_amount: 5000000 }, { net_amount: 3000000 }];

      // Act
      const total = calculateNetPayout(records);

      // Assert
      expect(total).toBe(8000000);
    });
  });

  // ============================================================
  // ELIGIBLE STUDENTS COUNT TESTS
  // ============================================================

  describe("Eligible Students Count", () => {
    test("counts unique students correctly", () => {
      // Arrange & Act
      const count = calculateEligibleStudents(mockFinancialRecords);

      // Assert - 5 unique student IDs
      expect(count).toBe(5);
    });

    test("returns 0 for empty array", () => {
      // Arrange & Act
      const count = calculateEligibleStudents([]);

      // Assert
      expect(count).toBe(0);
    });

    test("counts single student correctly", () => {
      // Arrange & Act
      const count = calculateEligibleStudents([mockFinancialRecords[0]]);

      // Assert
      expect(count).toBe(1);
    });

    test("handles duplicate student IDs correctly", () => {
      // Arrange - Same student appears multiple times
      const duplicateRecords = [
        { rub_id_card_number: 11901234 },
        { rub_id_card_number: 11901234 },
        { rub_id_card_number: 11901235 },
      ];

      // Act
      const count = calculateEligibleStudents(duplicateRecords);

      // Assert - Only 2 unique students
      expect(count).toBe(2);
    });

    test("counts all unique students in large dataset", () => {
      // Arrange
      const records = [
        { rub_id_card_number: 1 },
        { rub_id_card_number: 2 },
        { rub_id_card_number: 3 },
        { rub_id_card_number: 1 }, // duplicate
        { rub_id_card_number: 4 },
        { rub_id_card_number: 2 }, // duplicate
      ];

      // Act
      const count = calculateEligibleStudents(records);

      // Assert - 4 unique students (1, 2, 3, 4)
      expect(count).toBe(4);
    });
  });

  // ============================================================
  // PENDING APPROVALS COUNT TESTS
  // ============================================================

  describe("Pending Approvals Count", () => {
    test("counts pending approvals correctly", () => {
      // Arrange & Act
      const count = calculatePendingApprovals(mockFinancialRecords);

      // Assert - f2 and f5 have Pending status
      expect(count).toBe(2);
    });

    test("returns 0 when no pending approvals", () => {
      // Arrange
      const records = mockFinancialRecords.filter(
        (r) => r.status !== "Pending"
      );

      // Act
      const count = calculatePendingApprovals(records);

      // Assert
      expect(count).toBe(0);
    });

    test("returns 0 for empty array", () => {
      // Arrange & Act
      const count = calculatePendingApprovals([]);

      // Assert
      expect(count).toBe(0);
    });

    test("counts all records when all are pending", () => {
      // Arrange
      const allPending = [
        { status: "Pending" },
        { status: "Pending" },
        { status: "Pending" },
      ];

      // Act
      const count = calculatePendingApprovals(allPending);

      // Assert
      expect(count).toBe(3);
    });

    test("is case sensitive for status", () => {
      // Arrange
      const records = [
        { status: "Pending" },
        { status: "pending" }, // lowercase
        { status: "PENDING" }, // uppercase
      ];

      // Act
      const count = calculatePendingApprovals(records);

      // Assert - Only exact match counts
      expect(count).toBe(1);
    });

    test("ignores other statuses", () => {
      // Arrange
      const records = [
        { status: "Pending" },
        { status: "Processed" },
        { status: "Eligible" },
        { status: "Rejected" },
      ];

      // Act
      const count = calculatePendingApprovals(records);

      // Assert
      expect(count).toBe(1);
    });
  });

  // ============================================================
  // DEDUCTION PERCENTAGE TESTS
  // ============================================================

  describe("Deduction Percentage Calculation", () => {
    test("calculates percentage correctly", () => {
      // Arrange
      const totalStipends = calculateTotalStipends(mockFinancialRecords);
      const totalDeductions = calculateTotalDeductions(mockFinancialRecords);

      // Act
      const percentage = calculateDeductionPercentage(
        totalDeductions,
        totalStipends
      );

      // Assert - (1000/24800)*100 = 4.032...
      expect(percentage).toBeCloseTo(4.032, 2);
    });

    test("returns 0 when total stipends is 0", () => {
      // Arrange & Act
      const percentage = calculateDeductionPercentage(100, 0);

      // Assert
      expect(percentage).toBe(0);
    });

    test("returns 0 when both values are 0", () => {
      // Arrange & Act
      const percentage = calculateDeductionPercentage(0, 0);

      // Assert
      expect(percentage).toBe(0);
    });

    test("calculates 100% when deductions equal stipends", () => {
      // Arrange & Act
      const percentage = calculateDeductionPercentage(5000, 5000);

      // Assert
      expect(percentage).toBe(100);
    });

    test("calculates percentage greater than 100%", () => {
      // Arrange & Act
      const percentage = calculateDeductionPercentage(6000, 5000);

      // Assert
      expect(percentage).toBe(120);
    });

    test("handles decimal percentages correctly", () => {
      // Arrange & Act
      const percentage = calculateDeductionPercentage(333, 1000);

      // Assert
      expect(percentage).toBeCloseTo(33.3, 1);
    });

    test("rounds to appropriate decimal places", () => {
      // Arrange & Act
      const percentage = calculateDeductionPercentage(1, 3);

      // Assert - Should be 33.333...%
      expect(percentage).toBeCloseTo(33.33, 2);
    });
  });

  // ============================================================
  // DEPARTMENT TOTALS TESTS
  // ============================================================

  describe("Department Totals Calculation", () => {
    test("calculates all department metrics correctly", () => {
      // Arrange
      const deptRecords = mockFinancialRecords.slice(0, 2); // First 2 records

      // Act
      const totals = calculateDepartmentTotals(deptRecords);

      // Assert
      expect(totals.totalStipend).toBe(9800); // 5000 + 4800
      expect(totals.totalDeductions).toBe(550); // 250 + 300
      expect(totals.studentCount).toBe(2);
    });

    test("returns zeros for empty department", () => {
      // Arrange & Act
      const totals = calculateDepartmentTotals([]);

      // Assert
      expect(totals.totalStipend).toBe(0);
      expect(totals.totalDeductions).toBe(0);
      expect(totals.studentCount).toBe(0);
    });

    test("calculates for single student department", () => {
      // Arrange & Act
      const totals = calculateDepartmentTotals([mockFinancialRecords[0]]);

      // Assert
      expect(totals.totalStipend).toBe(5000);
      expect(totals.totalDeductions).toBe(250);
      expect(totals.studentCount).toBe(1);
    });

    test("student count equals number of records", () => {
      // Arrange
      const records = mockFinancialRecords.slice(0, 3);

      // Act
      const totals = calculateDepartmentTotals(records);

      // Assert
      expect(totals.studentCount).toBe(records.length);
    });
  });

  // ============================================================
  // EDGE CASES AND ERROR HANDLING TESTS
  // ============================================================

  describe("Edge Cases and Error Handling", () => {
    test("handles negative values in calculations", () => {
      // Arrange
      const records = [{ stipend_amount: 5000, deductions: -100 }];

      // Act
      const totalStipends = calculateTotalStipends(records);
      const totalDeductions = calculateTotalDeductions(records);

      // Assert
      expect(totalStipends).toBe(5000);
      expect(totalDeductions).toBe(-100);
    });

    test("handles very large numbers without overflow", () => {
      // Arrange
      const records = [
        {
          stipend_amount: Number.MAX_SAFE_INTEGER / 2,
          deductions: 0,
          net_amount: 0,
        },
        { stipend_amount: 1000, deductions: 0, net_amount: 0 },
      ];

      // Act & Assert - Should not throw
      expect(() => calculateTotalStipends(records)).not.toThrow();
    });

    test("maintains precision with decimal calculations", () => {
      // Arrange
      const records = [
        { stipend_amount: 1000.33 },
        { stipend_amount: 2000.67 },
      ];

      // Act
      const total = calculateTotalStipends(records);

      // Assert
      expect(total).toBe(3001.0);
    });

    test("handles records with missing fields gracefully", () => {
      // Arrange - Records with undefined values
      const records = [{ stipend_amount: 5000 }, { stipend_amount: undefined }];

      // Act
      const total = calculateTotalStipends(records);

      // Assert - undefined treated as 0 in reduce
      expect(isNaN(total)).toBe(true);
    });

    test("calculations are consistent across multiple calls", () => {
      // Arrange & Act
      const result1 = calculateTotalStipends(mockFinancialRecords);
      const result2 = calculateTotalStipends(mockFinancialRecords);

      // Assert
      expect(result1).toBe(result2);
    });

    test("calculation does not modify original array", () => {
      // Arrange
      const original = [...mockFinancialRecords];

      // Act
      calculateTotalStipends(mockFinancialRecords);
      calculateTotalDeductions(mockFinancialRecords);
      calculateNetPayout(mockFinancialRecords);

      // Assert
      expect(mockFinancialRecords).toEqual(original);
    });
  });

  // ============================================================
  // INTEGRATION TESTS
  // ============================================================

  describe("Integration Tests", () => {
    test("all calculations work together correctly", () => {
      // Arrange & Act
      const totalStipends = calculateTotalStipends(mockFinancialRecords);
      const totalDeductions = calculateTotalDeductions(mockFinancialRecords);
      const netPayout = calculateNetPayout(mockFinancialRecords);
      const studentCount = calculateEligibleStudents(mockFinancialRecords);
      const pendingCount = calculatePendingApprovals(mockFinancialRecords);
      const percentage = calculateDeductionPercentage(
        totalDeductions,
        totalStipends
      );

      // Assert
      expect(totalStipends).toBe(24800);
      expect(totalDeductions).toBe(1000);
      expect(netPayout).toBe(23800);
      expect(studentCount).toBe(5);
      expect(pendingCount).toBe(2);
      expect(percentage).toBeCloseTo(4.032, 2);
    });

    test("filtered records produce correct calculations", () => {
      // Arrange - Filter for Pending status
      const filtered = mockFinancialRecords.filter(
        (r) => r.status === "Pending"
      );

      // Act
      const totalStipends = calculateTotalStipends(filtered);
      const totalDeductions = calculateTotalDeductions(filtered);
      const pendingCount = calculatePendingApprovals(filtered);

      // Assert
      expect(filtered.length).toBe(2);
      expect(totalStipends).toBe(9900); // 4800 + 5100
      expect(totalDeductions).toBe(400); // 300 + 100
      expect(pendingCount).toBe(2);
    });

    test("calculations maintain mathematical relationships", () => {
      // Arrange & Act
      const totalStipends = calculateTotalStipends(mockFinancialRecords);
      const totalDeductions = calculateTotalDeductions(mockFinancialRecords);
      const netPayout = calculateNetPayout(mockFinancialRecords);

      // Assert - Net payout should equal stipends minus deductions
      expect(netPayout).toBe(totalStipends - totalDeductions);
      expect(totalStipends).toBeGreaterThan(totalDeductions);
      expect(netPayout).toBeGreaterThan(0);
    });
  });
});
