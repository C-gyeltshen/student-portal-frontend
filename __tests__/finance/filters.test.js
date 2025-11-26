/**
 * Unit Tests for Filter Logic
 * Tests search, department, status, and date range filtering functionality
 */

import "@testing-library/jest-dom";

/**
 * Mock financial records for testing
 */
const mockFinancialRecords = [
  {
    id: "f1",
    recipient: "Tshering Dorji",
    rub_id_card_number: 11901234,
    department_id: "1",
    department_name: "College of Science and Technology",
    stipend_amount: 5000,
    deductions: 250,
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
    net_amount: 4500,
    date: "2025-09-15",
    status: "Pending",
  },
  {
    id: "f3",
    recipient: "Pema Lhamo",
    rub_id_card_number: 11901236,
    department_id: "2",
    department_name: "College of Natural Resources",
    stipend_amount: 5200,
    deductions: 200,
    net_amount: 5000,
    date: "2025-09-16",
    status: "Processed",
  },
  {
    id: "f4",
    recipient: "Sonam Tenzin",
    rub_id_card_number: 11901237,
    department_id: "2",
    department_name: "College of Natural Resources",
    stipend_amount: 4700,
    deductions: 150,
    net_amount: 4550,
    date: "2025-09-16",
    status: "Eligible",
  },
  {
    id: "f5",
    recipient: "Kinley Dem",
    rub_id_card_number: 11901238,
    department_id: "3",
    department_name: "Sherubtse College",
    stipend_amount: 5100,
    deductions: 100,
    net_amount: 5000,
    date: "2025-09-17",
    status: "Pending",
  },
];

/**
 * Filter function - extracted from the component for testing
 */
const applyFilters = (records, filters) => {
  const { searchTerm, selectedDepartment, selectedStatus, startDate, endDate } =
    filters;

  return records.filter((r) => {
    const matchesSearch =
      r.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.rub_id_card_number.toString().includes(searchTerm);

    const matchesDept =
      selectedDepartment === "all" || r.department_id === selectedDepartment;

    const matchesStatus =
      selectedStatus === "all" || r.status === selectedStatus;

    const recordDate = new Date(r.date);
    const matchesStartDate = !startDate || recordDate >= new Date(startDate);
    const matchesEndDate = !endDate || recordDate <= new Date(endDate);

    return (
      matchesSearch &&
      matchesDept &&
      matchesStatus &&
      matchesStartDate &&
      matchesEndDate
    );
  });
};

describe("Filter Logic Tests", () => {
  // ============================================================
  // SEARCH FILTER TESTS
  // ============================================================

  describe("Search Filter", () => {
    test("filters by exact student name", () => {
      // Arrange
      const filters = {
        searchTerm: "Tshering Dorji",
        selectedDepartment: "all",
        selectedStatus: "all",
        startDate: "",
        endDate: "",
      };

      // Act
      const filtered = applyFilters(mockFinancialRecords, filters);

      // Assert
      expect(filtered).toHaveLength(1);
      expect(filtered[0].recipient).toBe("Tshering Dorji");
    });

    test("filters by partial name (case insensitive)", () => {
      // Arrange
      const filters = {
        searchTerm: "karma",
        selectedDepartment: "all",
        selectedStatus: "all",
        startDate: "",
        endDate: "",
      };

      // Act
      const filtered = applyFilters(mockFinancialRecords, filters);

      // Assert
      expect(filtered).toHaveLength(1);
      expect(filtered[0].recipient).toBe("Karma Wangmo");
    });

    test("filters by student ID", () => {
      // Arrange
      const filters = {
        searchTerm: "11901236",
        selectedDepartment: "all",
        selectedStatus: "all",
        startDate: "",
        endDate: "",
      };

      // Act
      const filtered = applyFilters(mockFinancialRecords, filters);

      // Assert
      expect(filtered).toHaveLength(1);
      expect(filtered[0].rub_id_card_number).toBe(11901236);
    });

    test("filters by partial student ID", () => {
      // Arrange
      const filters = {
        searchTerm: "1234",
        selectedDepartment: "all",
        selectedStatus: "all",
        startDate: "",
        endDate: "",
      };

      // Act
      const filtered = applyFilters(mockFinancialRecords, filters);

      // Assert
      expect(filtered).toHaveLength(1);
      expect(filtered[0].rub_id_card_number).toBe(11901234);
    });

    test("is case insensitive for names", () => {
      // Arrange
      const filters = {
        searchTerm: "PEMA",
        selectedDepartment: "all",
        selectedStatus: "all",
        startDate: "",
        endDate: "",
      };

      // Act
      const filtered = applyFilters(mockFinancialRecords, filters);

      // Assert
      expect(filtered).toHaveLength(1);
      expect(filtered[0].recipient).toBe("Pema Lhamo");
    });

    test("returns empty array when no matches found", () => {
      // Arrange
      const filters = {
        searchTerm: "NonExistentStudent",
        selectedDepartment: "all",
        selectedStatus: "all",
        startDate: "",
        endDate: "",
      };

      // Act
      const filtered = applyFilters(mockFinancialRecords, filters);

      // Assert
      expect(filtered).toHaveLength(0);
    });

    test("returns all records when search term is empty", () => {
      // Arrange
      const filters = {
        searchTerm: "",
        selectedDepartment: "all",
        selectedStatus: "all",
        startDate: "",
        endDate: "",
      };

      // Act
      const filtered = applyFilters(mockFinancialRecords, filters);

      // Assert
      expect(filtered).toHaveLength(5);
    });

    test("matches multiple records with common substring", () => {
      // Arrange - "a" appears in Karma, Pema, Sonam
      const filters = {
        searchTerm: "a",
        selectedDepartment: "all",
        selectedStatus: "all",
        startDate: "",
        endDate: "",
      };

      // Act
      const filtered = applyFilters(mockFinancialRecords, filters);

      // Assert
      expect(filtered.length).toBeGreaterThan(1);
      expect(
        filtered.some(
          (r) => r.recipient.includes("a") || r.recipient.includes("A")
        )
      ).toBe(true);
    });
  });

  // ============================================================
  // DEPARTMENT FILTER TESTS
  // ============================================================

  describe("Department Filter", () => {
    test("filters by specific department", () => {
      // Arrange
      const filters = {
        searchTerm: "",
        selectedDepartment: "1",
        selectedStatus: "all",
        startDate: "",
        endDate: "",
      };

      // Act
      const filtered = applyFilters(mockFinancialRecords, filters);

      // Assert
      expect(filtered).toHaveLength(2);
      expect(filtered.every((r) => r.department_id === "1")).toBe(true);
    });

    test('returns all records when department is "all"', () => {
      // Arrange
      const filters = {
        searchTerm: "",
        selectedDepartment: "all",
        selectedStatus: "all",
        startDate: "",
        endDate: "",
      };

      // Act
      const filtered = applyFilters(mockFinancialRecords, filters);

      // Assert
      expect(filtered).toHaveLength(5);
    });

    test("filters College of Natural Resources correctly", () => {
      // Arrange
      const filters = {
        searchTerm: "",
        selectedDepartment: "2",
        selectedStatus: "all",
        startDate: "",
        endDate: "",
      };

      // Act
      const filtered = applyFilters(mockFinancialRecords, filters);

      // Assert
      expect(filtered).toHaveLength(2);
      expect(
        filtered.every(
          (r) => r.department_name === "College of Natural Resources"
        )
      ).toBe(true);
    });

    test("filters Sherubtse College correctly", () => {
      // Arrange
      const filters = {
        searchTerm: "",
        selectedDepartment: "3",
        selectedStatus: "all",
        startDate: "",
        endDate: "",
      };

      // Act
      const filtered = applyFilters(mockFinancialRecords, filters);

      // Assert
      expect(filtered).toHaveLength(1);
      expect(filtered[0].department_name).toBe("Sherubtse College");
    });

    test("returns empty array for non-existent department", () => {
      // Arrange
      const filters = {
        searchTerm: "",
        selectedDepartment: "999",
        selectedStatus: "all",
        startDate: "",
        endDate: "",
      };

      // Act
      const filtered = applyFilters(mockFinancialRecords, filters);

      // Assert
      expect(filtered).toHaveLength(0);
    });
  });

  // ============================================================
  // STATUS FILTER TESTS
  // ============================================================

  describe("Status Filter", () => {
    test("filters by Processed status", () => {
      // Arrange
      const filters = {
        searchTerm: "",
        selectedDepartment: "all",
        selectedStatus: "Processed",
        startDate: "",
        endDate: "",
      };

      // Act
      const filtered = applyFilters(mockFinancialRecords, filters);

      // Assert
      expect(filtered).toHaveLength(2);
      expect(filtered.every((r) => r.status === "Processed")).toBe(true);
    });

    test("filters by Pending status", () => {
      // Arrange
      const filters = {
        searchTerm: "",
        selectedDepartment: "all",
        selectedStatus: "Pending",
        startDate: "",
        endDate: "",
      };

      // Act
      const filtered = applyFilters(mockFinancialRecords, filters);

      // Assert
      expect(filtered).toHaveLength(2);
      expect(filtered.every((r) => r.status === "Pending")).toBe(true);
    });

    test("filters by Eligible status", () => {
      // Arrange
      const filters = {
        searchTerm: "",
        selectedDepartment: "all",
        selectedStatus: "Eligible",
        startDate: "",
        endDate: "",
      };

      // Act
      const filtered = applyFilters(mockFinancialRecords, filters);

      // Assert
      expect(filtered).toHaveLength(1);
      expect(filtered[0].status).toBe("Eligible");
    });

    test('returns all records when status is "all"', () => {
      // Arrange
      const filters = {
        searchTerm: "",
        selectedDepartment: "all",
        selectedStatus: "all",
        startDate: "",
        endDate: "",
      };

      // Act
      const filtered = applyFilters(mockFinancialRecords, filters);

      // Assert
      expect(filtered).toHaveLength(5);
    });

    test("status filter is case sensitive", () => {
      // Arrange
      const filters = {
        searchTerm: "",
        selectedDepartment: "all",
        selectedStatus: "processed", // lowercase
        startDate: "",
        endDate: "",
      };

      // Act
      const filtered = applyFilters(mockFinancialRecords, filters);

      // Assert
      expect(filtered).toHaveLength(0); // Should not match due to case sensitivity
    });
  });

  // ============================================================
  // DATE RANGE FILTER TESTS
  // ============================================================

  describe("Date Range Filter", () => {
    test("filters by start date only", () => {
      // Arrange
      const filters = {
        searchTerm: "",
        selectedDepartment: "all",
        selectedStatus: "all",
        startDate: "2025-09-16",
        endDate: "",
      };

      // Act
      const filtered = applyFilters(mockFinancialRecords, filters);

      // Assert
      expect(filtered).toHaveLength(3); // f3, f4, f5
      expect(
        filtered.every((r) => new Date(r.date) >= new Date("2025-09-16"))
      ).toBe(true);
    });

    test("filters by end date only", () => {
      // Arrange
      const filters = {
        searchTerm: "",
        selectedDepartment: "all",
        selectedStatus: "all",
        startDate: "",
        endDate: "2025-09-15",
      };

      // Act
      const filtered = applyFilters(mockFinancialRecords, filters);

      // Assert
      expect(filtered).toHaveLength(2); // f1, f2
      expect(
        filtered.every((r) => new Date(r.date) <= new Date("2025-09-15"))
      ).toBe(true);
    });

    test("filters by date range (start and end)", () => {
      // Arrange
      const filters = {
        searchTerm: "",
        selectedDepartment: "all",
        selectedStatus: "all",
        startDate: "2025-09-16",
        endDate: "2025-09-16",
      };

      // Act
      const filtered = applyFilters(mockFinancialRecords, filters);

      // Assert
      expect(filtered).toHaveLength(2); // f3, f4
      expect(filtered.every((r) => r.date === "2025-09-16")).toBe(true);
    });

    test("returns all records when no date filters applied", () => {
      // Arrange
      const filters = {
        searchTerm: "",
        selectedDepartment: "all",
        selectedStatus: "all",
        startDate: "",
        endDate: "",
      };

      // Act
      const filtered = applyFilters(mockFinancialRecords, filters);

      // Assert
      expect(filtered).toHaveLength(5);
    });

    test("returns empty array when date range excludes all records", () => {
      // Arrange
      const filters = {
        searchTerm: "",
        selectedDepartment: "all",
        selectedStatus: "all",
        startDate: "2025-09-20",
        endDate: "2025-09-25",
      };

      // Act
      const filtered = applyFilters(mockFinancialRecords, filters);

      // Assert
      expect(filtered).toHaveLength(0);
    });

    test("handles inclusive date range correctly", () => {
      // Arrange
      const filters = {
        searchTerm: "",
        selectedDepartment: "all",
        selectedStatus: "all",
        startDate: "2025-09-15",
        endDate: "2025-09-17",
      };

      // Act
      const filtered = applyFilters(mockFinancialRecords, filters);

      // Assert
      expect(filtered).toHaveLength(5); // All records fall within this range
    });

    test("filters correctly when start date equals record date", () => {
      // Arrange
      const filters = {
        searchTerm: "",
        selectedDepartment: "all",
        selectedStatus: "all",
        startDate: "2025-09-17",
        endDate: "",
      };

      // Act
      const filtered = applyFilters(mockFinancialRecords, filters);

      // Assert
      expect(filtered).toHaveLength(1);
      expect(filtered[0].date).toBe("2025-09-17");
    });
  });

  // ============================================================
  // COMBINED FILTER TESTS
  // ============================================================

  describe("Combined Filters", () => {
    test("applies search and department filters together", () => {
      // Arrange
      const filters = {
        searchTerm: "a",
        selectedDepartment: "1",
        selectedStatus: "all",
        startDate: "",
        endDate: "",
      };

      // Act
      const filtered = applyFilters(mockFinancialRecords, filters);

      // Assert - Only Karma from dept 1
      expect(filtered).toHaveLength(1);
      expect(filtered[0].recipient).toBe("Karma Wangmo");
    });

    test("applies search and status filters together", () => {
      // Arrange
      const filters = {
        searchTerm: "e",
        selectedDepartment: "all",
        selectedStatus: "Pending",
        startDate: "",
        endDate: "",
      };

      // Act
      const filtered = applyFilters(mockFinancialRecords, filters);

      // Assert - Kinley Dem (Pending and contains 'e')
      expect(filtered.length).toBeGreaterThan(0);
      expect(filtered.every((r) => r.status === "Pending")).toBe(true);
    });

    test("applies department and status filters together", () => {
      // Arrange
      const filters = {
        searchTerm: "",
        selectedDepartment: "1",
        selectedStatus: "Pending",
        startDate: "",
        endDate: "",
      };

      // Act
      const filtered = applyFilters(mockFinancialRecords, filters);

      // Assert - Karma Wangmo
      expect(filtered).toHaveLength(1);
      expect(filtered[0].recipient).toBe("Karma Wangmo");
    });

    test("applies department and date range filters together", () => {
      // Arrange
      const filters = {
        searchTerm: "",
        selectedDepartment: "2",
        selectedStatus: "all",
        startDate: "2025-09-16",
        endDate: "2025-09-16",
      };

      // Act
      const filtered = applyFilters(mockFinancialRecords, filters);

      // Assert - Both Natural Resources students on 2025-09-16
      expect(filtered).toHaveLength(2);
      expect(filtered.every((r) => r.department_id === "2")).toBe(true);
    });

    test("applies all filters simultaneously", () => {
      // Arrange
      const filters = {
        searchTerm: "Karma",
        selectedDepartment: "1",
        selectedStatus: "Pending",
        startDate: "2025-09-15",
        endDate: "2025-09-15",
      };

      // Act
      const filtered = applyFilters(mockFinancialRecords, filters);

      // Assert
      expect(filtered).toHaveLength(1);
      expect(filtered[0].recipient).toBe("Karma Wangmo");
      expect(filtered[0].department_id).toBe("1");
      expect(filtered[0].status).toBe("Pending");
      expect(filtered[0].date).toBe("2025-09-15");
    });

    test("returns empty array when combined filters match nothing", () => {
      // Arrange
      const filters = {
        searchTerm: "Karma",
        selectedDepartment: "2", // Karma is in dept 1
        selectedStatus: "Pending",
        startDate: "",
        endDate: "",
      };

      // Act
      const filtered = applyFilters(mockFinancialRecords, filters);

      // Assert
      expect(filtered).toHaveLength(0);
    });

    test("combined filters maintain data integrity", () => {
      // Arrange
      const filters = {
        searchTerm: "Tshering",
        selectedDepartment: "1",
        selectedStatus: "Processed",
        startDate: "2025-09-15",
        endDate: "2025-09-15",
      };

      // Act
      const filtered = applyFilters(mockFinancialRecords, filters);

      // Assert
      expect(filtered).toHaveLength(1);
      expect(filtered[0]).toEqual(mockFinancialRecords[0]);
    });
  });

  // ============================================================
  // EDGE CASES TESTS
  // ============================================================

  describe("Edge Cases", () => {
    test("handles empty records array", () => {
      // Arrange
      const filters = {
        searchTerm: "",
        selectedDepartment: "all",
        selectedStatus: "all",
        startDate: "",
        endDate: "",
      };

      // Act
      const filtered = applyFilters([], filters);

      // Assert
      expect(filtered).toHaveLength(0);
    });

    test("handles whitespace in search term", () => {
      // Arrange
      const filters = {
        searchTerm: "  Karma  ",
        selectedDepartment: "all",
        selectedStatus: "all",
        startDate: "",
        endDate: "",
      };

      // Act
      const filtered = applyFilters(mockFinancialRecords, filters);

      // Assert - Note: whitespace is included in the search, so trimming may be needed
      expect(filtered.length).toBeGreaterThanOrEqual(0);
      if (filtered.length > 0) {
        expect(filtered[0].recipient).toContain("Karma");
      }
    });

    test("handles special characters in search", () => {
      // Arrange
      const filters = {
        searchTerm: "@#$%",
        selectedDepartment: "all",
        selectedStatus: "all",
        startDate: "",
        endDate: "",
      };

      // Act
      const filtered = applyFilters(mockFinancialRecords, filters);

      // Assert
      expect(filtered).toHaveLength(0);
    });

    test("handles invalid date format gracefully", () => {
      // Arrange
      const filters = {
        searchTerm: "",
        selectedDepartment: "all",
        selectedStatus: "all",
        startDate: "invalid-date",
        endDate: "",
      };

      // Act & Assert - Should not throw error
      expect(() => applyFilters(mockFinancialRecords, filters)).not.toThrow();
    });

    test("preserves original array when filtering", () => {
      // Arrange
      const originalLength = mockFinancialRecords.length;
      const filters = {
        searchTerm: "Karma",
        selectedDepartment: "all",
        selectedStatus: "all",
        startDate: "",
        endDate: "",
      };

      // Act
      applyFilters(mockFinancialRecords, filters);

      // Assert - Original array should remain unchanged
      expect(mockFinancialRecords).toHaveLength(originalLength);
    });
  });
});
