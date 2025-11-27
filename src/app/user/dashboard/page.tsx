"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  LayoutDashboard,
  DollarSign,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";

// --- CollapsibleRow Component ---
const CollapsibleRow = ({ college, students, isExpanded, onToggle }: any) => {
  return (
    <>
      {/* College Header Row */}
      <tr
        className="bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 cursor-pointer transition-all border-b-2 border-blue-200"
        onClick={onToggle}
      >
        <td className="px-3 sm:px-6 py-4" colSpan={7}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-blue-600 rounded-lg">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                ) : (
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                )}
              </div>
              <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-blue-700" />
              <div>
                <h3 className="text-sm sm:text-lg font-semibold text-gray-800">
                  {college.name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600">
                  {students.length} Students Enrolled
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-2 sm:px-4 py-1.5 sm:py-2 bg-blue-600 text-white rounded-lg font-medium text-sm">
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
            <td className="px-3 sm:px-6 py-3 sm:py-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-xs sm:text-base">
                  {student.name
                    ? student.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                    : "??"}
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 text-sm sm:text-base truncate">
                    {student.name || "N/A"}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-500 truncate">
                    {student.rub_id_card_number ||
                      student.rubIdCardNumber ||
                      "N/A"}
                  </div>
                </div>
              </div>
            </td>
            <td className="px-3 sm:px-6 py-3 sm:py-4 hidden md:table-cell">
              <div className="flex items-center gap-2 text-gray-700">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm truncate">
                  {student.email || "N/A"}
                </span>
              </div>
            </td>
            <td className="px-3 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">
              <div className="flex items-center gap-2 text-gray-700">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm">
                  {student.phone_number || student.phoneNumber || "N/A"}
                </span>
              </div>
            </td>
            <td className="px-3 sm:px-6 py-3 sm:py-4 hidden xl:table-cell">
              <div className="flex items-center gap-2 text-gray-700">
                <GraduationCap className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm">{student.program || "N/A"}</span>
              </div>
            </td>
            <td className="px-3 sm:px-6 py-3 sm:py-4 hidden xl:table-cell">
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm">
                  {student.date_of_birth || student.dateOfBirth
                    ? new Date(
                        student.date_of_birth || student.dateOfBirth
                      ).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </td>
            <td className="px-3 sm:px-6 py-3 sm:py-4 hidden lg:table-cell">
              <span className="text-sm text-gray-600">
                {student.created_at || student.createdAt
                  ? new Date(
                      student.created_at || student.createdAt
                    ).toLocaleDateString()
                  : "N/A"}
              </span>
            </td>
            <td className="px-3 sm:px-6 py-3 sm:py-4">
              <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm rounded-lg transition-colors font-medium">
                View
              </button>
            </td>
          </tr>
        ))}
    </>
  );
};

// --- VerticalNav Component ---
interface NavItem {
  name: string;
  icon: React.ElementType;
  href: string;
  isActive: boolean;
}

interface VerticalNavProps {
  currentPath: string;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
}

const VerticalNav: React.FC<VerticalNavProps> = ({
  currentPath,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const router = useRouter();

  const navItems: NavItem[] = [
    {
      name: "Admin Dashboard",
      icon: LayoutDashboard,
      href: "/user/dashboard",
      isActive: currentPath.includes("/user/dashboard"),
    },
    {
      name: "Financial Officer",
      icon: DollarSign,
      href: "/user/",
      isActive: currentPath.includes("/user/financial-officer"),
    },
    {
      name: "Student Records",
      icon: GraduationCap,
      href: "/dashboard/student-records",
      isActive:
        currentPath.includes("/dashboard/student-records") ||
        currentPath === "/",
    },
    {
      name: "Login as FO",
      icon: GraduationCap,
      href: "/user/login",
      isActive: currentPath.includes("/dashboard/student-records"),
    },
  ];

  const handleNavClick = (href: string) => {
    router.push(href);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Navigation Sidebar - Fixed height to prevent movement */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50
        transform ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0
        transition-transform duration-300 ease-in-out
        w-64 bg-transparent lg:bg-transparent
      `}
      >
        <div className="h-full overflow-y-auto lg:overflow-visible bg-white lg:bg-transparent">
          {/* Mobile Close Button */}
          <div className="lg:hidden flex justify-end p-4">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Fixed height container to prevent navbar jumping */}
          <div className="lg:sticky lg:top-4">
            <div className="flex flex-col space-y-3 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-1">
                Navigation
              </h3>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item.href)}
                    className={`
                      flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ease-in-out text-left
                      ${
                        item.isActive
                          ? "bg-blue-600 text-white shadow-md ring-2 ring-blue-500/50"
                          : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-5 h-5 ${
                          item.isActive ? "text-white" : "text-blue-500"
                        }`}
                      />
                      <span className="font-medium text-sm">{item.name}</span>
                    </div>
                    {!item.isActive && (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                    {item.isActive && (
                      <div className="w-2 h-2 rounded-full bg-white ml-2"></div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Fee Payment Card */}
            <div className="mt-6 mx-4 p-4 bg-white rounded-xl shadow-lg border border-gray-100 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-indigo-500" />
                <span className="text-sm font-medium text-gray-700">
                  Fee Payment
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const StudentDashboard = () => {
  const router = useRouter();
  const [currentPath] = useState("/dashboard/student-records");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
        const response = await fetch("http://localhost:8080/api/users/role/1");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const rawData = await response.json();
        const transformedStudents = rawData.map((student: any) => ({
          id: student.ID,
          name: `${student["first name"] || ""} ${
            student["second name"] || ""
          }`.trim(),
          email: student.email,
          college_id: student.college_id || "DEFAULT_COLLEGE_ID",
          college_name: student.college_name || "RUB Colleges (Placeholder)",
          rub_id_card_number:
            student.rub_id_card_number || student.rubIdCardNumber || "N/A",
          phone_number: student.phone_number || student.phoneNumber || "N/A",
          program: student.program || "N/A",
          date_of_birth: student.date_of_birth || student.dateOfBirth || null,
          created_at: student.created_at || student.createdAt || null,
        }));

        setStudents(transformedStudents);

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

  const filteredStudents = students.filter((student: any) => {
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

  const groupedStudents = colleges
    .map((college: any) => ({
      college,
      students: filteredStudents.filter((s: any) => {
        const studentCollegeId = s.college_id || s.collegeId;
        return studentCollegeId === college.id;
      }),
    }))
    .filter((group: any) => group.students.length > 0);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header - Fixed to prevent movement */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>

            {/* Logo and Title */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-b rounded-xl flex items-center justify-center overflow-hidden">
                <Image
                  src="/image/1.png"
                  width={500}
                  height={500}
                  alt="Picture of the author"
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
                  RUB Student Portal
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">
                  Royal University of Bhutan
                </p>
              </div>
            </div>

            {/* Finance Officer Button */}
            <button
              onClick={() => router.push("/user/financial-officer")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm shadow-sm"
            >
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Finance Officer</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Main Content: Split Layout */}
        <div className="flex gap-4 lg:gap-8">
          {/* Left Column: Navigation */}
          <VerticalNav
            currentPath={currentPath}
            isMobileMenuOpen={isMobileMenuOpen}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
          />

          {/* Right Column: Main Data View */}
          <div className="flex-1 min-w-0">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">
                      Total Students
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {totalStudents}
                    </p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">
                      Active Colleges
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {groupedStudents.length}
                    </p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 border border-gray-100 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">
                      Programs
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {new Set(students.map((s: any) => s.program)).size}
                    </p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Controls */}
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-100">
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name, ID, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="relative sm:w-48">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                    <select
                      value={selectedCollege}
                      onChange={(e) => setSelectedCollege(e.target.value)}
                      className="w-full pl-9 sm:pl-10 pr-8 py-2 sm:py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                    >
                      <option value="all">All Colleges</option>
                      {colleges.map((college: any) => (
                        <option key={college.id} value={college.id}>
                          {college.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={expandAll}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm rounded-lg transition-colors font-medium"
                  >
                    Expand All
                  </button>
                  <button
                    onClick={collapseAll}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-600 hover:bg-gray-700 text-white text-xs sm:text-sm rounded-lg transition-colors font-medium"
                  >
                    Collapse All
                  </button>
                  <button className="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm rounded-lg transition-colors font-medium flex items-center justify-center gap-2">
                    <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Export</span>
                    <span className="sm:hidden">CSV</span>
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
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                        Email
                      </th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                        Phone
                      </th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden xl:table-cell">
                        Program
                      </th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden xl:table-cell">
                        DOB
                      </th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden lg:table-cell">
                        Enrolled
                      </th>
                      <th className="px-3 sm:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
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
                            <div className="w-10 h-10 sm:w-12 sm:h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-base sm:text-lg font-medium">
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
                            <p className="text-base sm:text-lg font-medium">
                              Error loading data
                            </p>
                            <p className="text-xs sm:text-sm">{error}</p>
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
                            <User className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300" />
                            <p className="text-base sm:text-lg font-medium">
                              No students found
                            </p>
                            <p className="text-xs sm:text-sm">
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
    </div>
  );
};

export default StudentDashboard;
