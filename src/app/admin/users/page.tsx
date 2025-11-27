"use client";

import React, { useState, useEffect } from "react";
import {
  ChevronDown,
  ChevronRight,
  User,
  Building2,
  GraduationCap,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Filter,
  Search,
  Download,
  ArrowLeft,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { adminAPI } from "@/lib/api";

// --- CollapsibleRow Component (No Changes Needed) ---
const CollapsibleRow = ({ college, students, isExpanded, onToggle }: any) => {
  return (
    <>
      {/* College Header Row */}
      <tr
        className="bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 cursor-pointer transition-all border-b-2 border-blue-200"
        onClick={onToggle}
      >
        <td className="px-6 py-4" colSpan={7}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 text-white" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-white" />
                )}
              </div>
              <Building2 className="w-6 h-6 text-blue-700" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {college.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {students.length} Students Enrolled
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium">
              <span>{students.length}</span>
            </div>
          </div>
        </td>
      </tr>

      {/* Student Rows */}
      {isExpanded &&
        students.map((student: any, idx: number) => (
          <tr
            key={student.id || idx}
            className={`border-b hover:bg-blue-50 transition-colors ${
              idx % 2 === 0 ? "bg-white" : "bg-gray-50"
            }`}
          >
            <td className="px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                  {student.name
                    ? student.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                    : "??"}
                </div>
                <div>
                  <div className="font-medium text-gray-900">
                    {student.name || "N/A"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {student.rub_id_card_number ||
                      student.rubIdCardNumber ||
                      "N/A"}
                  </div>
                </div>
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{student.email || "N/A"}</span>
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2 text-gray-700">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-sm">
                  {student.phone_number || student.phoneNumber || "N/A"}
                </span>
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2 text-gray-700">
                <GraduationCap className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{student.program || "N/A"}</span>
              </div>
            </td>
            <td className="px-6 py-4">
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm">
                  {student.date_of_birth || student.dateOfBirth
                    ? new Date(
                        student.date_of_birth || student.dateOfBirth
                      ).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </td>
            <td className="px-6 py-4">
              <span className="text-sm text-gray-600">
                {student.created_at || student.createdAt
                  ? new Date(
                      student.created_at || student.createdAt
                    ).toLocaleDateString()
                  : "N/A"}
              </span>
            </td>
            <td className="px-6 py-4">
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors font-medium">
                View Details
              </button>
            </td>
          </tr>
        ))}
    </>
  );
};
// --- End CollapsibleRow Component ---

const AdminUsersPage = () => {
  const [expandedColleges, setExpandedColleges] = useState<any>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("all");
  const [students, setStudents] = useState<any[]>([]);
  const [colleges, setColleges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await adminAPI.getAllUsers();
        const rawData = response.data;
        console.log("Fetched raw data:", rawData);

        // Filter for students only
        const studentUsers = rawData.filter(
          (user: any) => user.role === "student"
        );

        // --- 💡 DATA TRANSFORMATION: Map API keys to component keys ---
        const transformedStudents = studentUsers.map((student: any) => ({
          // Map 'ID' to 'id'
          id: student.ID || student.id,
          // Combine 'first name' and 'second name' into 'name'
          name: `${student["first name"] || student.firstName || ""} ${
            student["second name"] || student.lastName || ""
          }`.trim(),
          // Map 'email' directly
          email: student.email,

          // 🚨 CRITICAL PLACEHOLDERS: Your API data is missing college info.
          // This must be fixed on the backend for proper grouping.
          // Using a placeholder college for now so the UI groups data.
          college_id: student.college_id || "DEFAULT_COLLEGE_ID",
          college_name: student.college_name || "RUB Colleges (Placeholder)",

          // Map other fields (use fallbacks if they might be missing/null)
          rub_id_card_number:
            student.rub_id_card_number || student.rubIdCardNumber || "N/A",
          phone_number: student.phone_number || student.phoneNumber || "N/A",
          program: student.program || "N/A", // Assuming this field is in the API
          date_of_birth: student.date_of_birth || student.dateOfBirth || null, // Assuming this field is in the API
          created_at: student.created_at || student.createdAt || null, // Assuming this field is in the API
        }));
        // --- 💡 END DATA TRANSFORMATION ---

        setStudents(transformedStudents);

        // Extract unique colleges from the transformed data
        const collegesMap = new Map();
        transformedStudents.forEach((student: any) => {
          if (student.college_id && student.college_name) {
            collegesMap.set(student.college_id, {
              id: student.college_id,
              name: student.college_name,
            });
          }
        });
        const uniqueColleges = Array.from(collegesMap.values());
        console.log("Extracted colleges:", uniqueColleges);
        setColleges(uniqueColleges);

        setError(null);
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const toggleCollege = (collegeId: any) => {
    setExpandedColleges((prev: any) => ({
      ...prev,
      [collegeId]: !prev[collegeId],
    }));
  };

  const expandAll = () => {
    const allExpanded: any = {};
    colleges.forEach((college: any) => {
      allExpanded[college.id] = true;
    });
    setExpandedColleges(allExpanded);
  };

  const collapseAll = () => {
    setExpandedColleges({});
  };

  // Filter students by search and college
  const filteredStudents = students.filter((student: any) => {
    // Check for existence before calling toLowerCase
    const name = student.name?.toLowerCase() || "";
    const email = student.email?.toLowerCase() || "";
    const rubId = student.rub_id_card_number || student.rubIdCardNumber || "";

    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      rubId.toString().includes(searchTerm) ||
      email.includes(searchTerm.toLowerCase());

    const collegeId = student.college_id || student.collegeId;
    const matchesCollege =
      selectedCollege === "all" || collegeId === selectedCollege;

    return matchesSearch && matchesCollege;
  });

  // Group students by college
  const groupedStudents = colleges
    .map((college: any) => ({
      college,
      students: filteredStudents.filter((s: any) => {
        const studentCollegeId = s.college_id || s.collegeId;
        return studentCollegeId === college.id;
      }),
    }))
    .filter((group: any) => group.students.length > 0);

  // If no colleges are defined (e.g., due to missing API data),
  // create a single group for all students under the placeholder college
  if (colleges.length === 0 && filteredStudents.length > 0) {
    groupedStudents.push({
      college: {
        id: "DEFAULT_COLLEGE_ID",
        name: "RUB Students (Placeholder Group)",
      },
      students: filteredStudents,
    });
  }

  const totalStudents = filteredStudents.length;

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Link
                  href="/admin/dashboard"
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </Link>
                <div className="w-12 h-12 bg-gradient-to-b rounded-xl flex items-center justify-center overflow-hidden">
                  <Image
                    src="/image/1.png"
                    width={48}
                    height={48}
                    alt="RUB Logo"
                    className="object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    User Management
                  </h1>
                  <p className="text-sm text-gray-600">
                    Royal University of Bhutan - Admin Portal
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Students</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {totalStudents}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Colleges</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {groupedStudents.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Programs</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {new Set(students.map((s: any) => s.program)).size}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Controls */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-100">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, ID, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedCollege}
                  onChange={(e) => setSelectedCollege(e.target.value)}
                  className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Colleges</option>
                  {colleges.map((college: any) => (
                    <option key={college.id} value={college.id}>
                      {college.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={expandAll}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  Expand All
                </button>
                <button
                  onClick={collapseAll}
                  className="px-4 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
                >
                  Collapse All
                </button>
                <button className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>
          </div>

          {/* Student Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Phone
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Program
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      DOB
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Enrolled
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <p className="text-lg font-medium">
                            Loading students...
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-12 text-center text-red-500"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <p className="text-lg font-medium">
                            Error loading data
                          </p>
                          <p className="text-sm">{error}</p>
                        </div>
                      </td>
                    </tr>
                  ) : groupedStudents.length > 0 ? (
                    groupedStudents.map(({ college, students }: any) => (
                      <CollapsibleRow
                        key={college.id}
                        college={college}
                        students={students}
                        isExpanded={expandedColleges[college.id]}
                        onToggle={() => toggleCollege(college.id)}
                      />
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <User className="w-12 h-12 text-gray-300" />
                          <p className="text-lg font-medium">
                            No students found
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
    </ProtectedRoute>
  );
};

export default AdminUsersPage;
