"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  User,
  Building2,
  CreditCard,
  Filter,
  Search,
  Download,
  Users,
  Clock,
  AlertCircle,
  Eye,
  Calculator,
  Send,
} from "lucide-react";
import Image from "next/image";
import VerticalNav from "../../user/component/VerticalNav";

// Mock data for finance dashboard
const mockDepartments = [
  { id: "1", name: "College of Science and Technology" },
  { id: "2", name: "College of Natural Resources" },
  { id: "3", name: "Sherubtse College" },
];

const mockFinancialRecords = [
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
    created_at: "2025-09-15T10:00:00Z",
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
    created_at: "2025-09-15T10:30:00Z",
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
    deduction_breakdown: { hostel: 80, electricity: 40, mess: 80 },
    net_amount: 5000,
    date: "2025-09-16",
    created_at: "2025-09-16T09:00:00Z",
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
    deduction_breakdown: { hostel: 60, electricity: 30, mess: 60 },
    net_amount: 4550,
    date: "2025-09-16",
    created_at: "2025-09-16T09:30:00Z",
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
    deduction_breakdown: { hostel: 40, electricity: 20, mess: 40 },
    net_amount: 5000,
    date: "2025-09-17",
    created_at: "2025-09-17T08:00:00Z",
    status: "Pending",
  },
];

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
      >
        <td className="px-6 py-4" colSpan={7}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 bg-emerald-600 rounded-lg">
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-white" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-white" />
                )}
              </div>
              <Building2 className="w-6 h-6 text-emerald-700" />
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
                >
                  <Calculator className="w-4 h-4" />
                  <span className="hidden sm:inline">Calculate</span>
                </button>
                <button
                  className="px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg transition-colors font-medium flex items-center gap-1 whitespace-nowrap"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">Details</span>
                </button>
                <button
                  className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-lg transition-colors font-medium flex items-center gap-1 whitespace-nowrap"
                  title="Process Payment"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Process</span>
                </button>
              </div>
            </td>
          </tr>
        ))}
    </>
  );
};

const FinanceDashboard = () => {
  const pathname = usePathname();
  const [expandedDepartments, setExpandedDepartments] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const toggleDepartment = (deptId) => {
    setExpandedDepartments((prev) => ({ ...prev, [deptId]: !prev[deptId] }));
  };

  const expandAll = () => {
    const all = {};
    mockDepartments.forEach((d) => (all[d.id] = true));
    setExpandedDepartments(all);
  };

  const collapseAll = () => setExpandedDepartments({});

  const filtered = mockFinancialRecords.filter((r) => {
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

  const grouped = mockDepartments
    .map((dept) => ({
      department: dept,
      records: filtered.filter((r) => r.department_id === dept.id),
    }))
    .filter((g) => g.records.length > 0);

  const totalStipends = filtered.reduce((s, r) => s + r.stipend_amount, 0);
  const totalDeductions = filtered.reduce((s, r) => s + r.deductions, 0);
  const netPayout = filtered.reduce((s, r) => s + r.net_amount, 0);
  const eligibleStudents = new Set(filtered.map((r) => r.rub_id_card_number))
    .size;
  const pendingApprovals = filtered.filter(
    (r) => r.status === "Pending"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/30 flex">
      {/* Sidebar with VerticalNav */}
      <div className="w-64 p-4 bg-gray-50 border-r border-gray-200">
        <VerticalNav currentPath={pathname} />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-b rounded-xl flex items-center justify-center overflow-hidden">
                  <Image
                    src="/image/1.png"
                    width={48}
                    height={48}
                    alt="RUB Logo"
                    className="object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    RUB Finance Portal
                  </h1>
                  <p className="text-sm text-gray-500 hidden sm:block">
                    Financial Management & Reports
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-lg">
                  <User className="w-5 h-5 text-emerald-600" />
                  <span className="text-sm font-medium text-gray-700">
                    Financial Officer
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Stipends Processed */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2 font-medium">
                    Total Stipends Processed
                  </p>
                  <p className="text-3xl font-bold text-emerald-600">
                    Nu {totalStipends.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {filtered.length} payments
                  </p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>

            {/* Total Deductions Applied */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2 font-medium">
                    Total Deductions Applied
                  </p>
                  <p className="text-3xl font-bold text-amber-600">
                    Nu {totalDeductions.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    {((totalDeductions / totalStipends) * 100).toFixed(1)}% of
                    stipends
                  </p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>

            {/* Eligible Students Count */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2 font-medium">
                    Eligible Students Count
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {eligibleStudents}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Active stipend recipients
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Pending Approvals */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-2 font-medium">
                    Pending Approvals
                  </p>
                  <p className="text-3xl font-bold text-orange-600">
                    {pendingApprovals}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Awaiting processing
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Controls */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Filters
              </h3>
            </div>

            {/* First Row: Search and Department */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by student ID or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-black placeholder-gray-600"
                />
              </div>

              {/* Department Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white text-black"
                >
                  <option value="all">All Departments</option>
                  {mockDepartments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none bg-white text-black"
                >
                  <option value="all">All Status</option>
                  <option value="Paid">Processed</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
            </div>

            {/* Second Row: Date Range Pickers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Start Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-black"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-black"
                />
              </div>
            </div>

            {/* Third Row: Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedDepartment("all");
                  setSelectedStatus("all");
                  setStartDate("");
                  setEndDate("");
                }}
                className="px-4 py-2.5 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded-lg transition-colors font-medium"
              >
                Clear Filters
              </button>
              <button
                onClick={expandAll}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors font-medium"
              >
                Expand All
              </button>
              <button
                onClick={collapseAll}
                className="px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
              >
                Collapse All
              </button>
              <button className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Export Report
              </button>
            </div>
          </div>

          {/* Finance Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Stipend Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Deductions
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Net Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {grouped.length > 0 ? (
                    grouped.map(({ department, records }) => (
                      <CollapsibleRow
                        key={department.id}
                        department={department}
                        records={records}
                        isExpanded={expandedDepartments[department.id]}
                        onToggle={() => toggleDepartment(department.id)}
                      />
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <CreditCard className="w-12 h-12 text-gray-300" />
                          <p className="text-lg font-medium">
                            No financial records found
                          </p>
                          <p className="text-sm">
                            Try adjusting your search or filter criteria
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinanceDashboard;
