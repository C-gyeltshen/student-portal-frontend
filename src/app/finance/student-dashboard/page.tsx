"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  GraduationCap,
  DollarSign,
  CheckCircle,
  XCircle,
  CreditCard,
  Mail,
  Phone,
  MapPin,
  Calendar,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import { studentService } from "@/services/student.service";
import { stipendService } from "@/services/stipend.service";
import type {
  Student,
  StipendAllocation,
  StipendPayment,
} from "@/types/student.types";

// Type definitions for dashboard display
interface Transaction {
  id: string;
  amount: number;
  date: string;
  time: string;
  reference: string;
  paymentMethod: string;
  status: "completed" | "pending" | "failed";
  description: string;
}

interface Deduction {
  id: string;
  type: string;
  amount: number;
  description: string;
  date: string;
}

interface StudentProfile {
  id: string;
  name: string;
  studentNumber: string;
  program: string;
  college: string;
  status: "active" | "inactive";
  email: string;
  phone: string;
  address: string;
  enrollmentDate: string;
  yearLevel: string;
  gpa: number;
}

interface StudentWithStipend {
  id: string;
  name: string;
  studentId: string;
  program: string;
  college: string;
  status: "active" | "inactive";
  stipendReceived: boolean;
  stipendReason: string;
  stipendAmount: number;
  totalDeductions: number;
  netStipend: number;
  deductions: Deduction[];
  transactions: Transaction[];
  profile: StudentProfile;
}

const StudentDashboard = () => {
  const [studentData, setStudentData] = useState<StudentWithStipend | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // TODO: Replace with actual logged-in student ID from auth context
  // For now, you can pass it as a prop or get it from URL params
  const STUDENT_ID = 1; // Replace with actual student ID

  // Fetch data on component mount
  useEffect(() => {
    fetchStudentData();
  }, []);

  /**
   * Transform backend Student data to dashboard StudentWithStipend format
   */
  const transformStudentData = (
    student: Student,
    allocations: StipendAllocation[] = [],
    payments: StipendPayment[] = []
  ): StudentWithStipend => {
    // Get the latest active allocation
    const activeAllocation = allocations.find(
      (alloc) => alloc.status === "active" || alloc.status === "pending"
    );

    // Calculate total deductions (example: could come from a deductions API)
    const totalDeductions = 0; // You can fetch this from backend

    // Get payment history and transform to transactions
    const transactions: Transaction[] = payments.map((payment) => {
      const paymentDate = new Date(payment.payment_date);
      return {
        id: payment.id.toString(),
        amount: payment.amount_paid,
        date: paymentDate.toLocaleDateString("en-GB"),
        time: paymentDate.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        reference: payment.transaction_reference || `TXN${payment.id}`,
        paymentMethod: formatPaymentMethod(payment.payment_method),
        status: payment.payment_status,
        description:
          payment.notes ||
          `Stipend payment for ${activeAllocation?.academic_year || ""}`,
      };
    });

    // Example deductions (in real app, fetch from backend)
    const deductions: Deduction[] = [];

    const stipendAmount = activeAllocation?.amount || 0;
    const netStipend = stipendAmount - totalDeductions;

    return {
      id: student.id.toString(),
      name: `${student.first_name} ${student.last_name}`,
      studentId: student.student_id,
      program: student.program?.program_name || "N/A",
      college: student.college?.college_name || "N/A",
      status: student.status === "active" ? "active" : "inactive",
      stipendReceived: activeAllocation?.status === "active",
      stipendReason: activeAllocation
        ? "Stipend Allocated"
        : "No Active Allocation",
      stipendAmount,
      totalDeductions,
      netStipend,
      deductions,
      transactions,
      profile: {
        id: student.id.toString(),
        name: `${student.first_name} ${student.last_name}`,
        studentNumber: student.student_id,
        program: student.program?.program_name || "N/A",
        college: student.college?.college_name || "N/A",
        status: student.status === "active" ? "active" : "inactive",
        email: student.email,
        phone: student.phone_number || "N/A",
        address: student.current_address || student.permanent_address || "N/A",
        enrollmentDate: student.enrollment_date
          ? new Date(student.enrollment_date).toLocaleDateString("en-GB")
          : "N/A",
        yearLevel: student.year_of_study
          ? `Year ${student.year_of_study}`
          : "N/A",
        gpa: student.gpa || 0,
      },
    };
  };

  /**
   * Format payment method for display
   */
  const formatPaymentMethod = (method: string): string => {
    const methodMap: Record<string, string> = {
      bank_transfer: "Bank Transfer",
      cash: "Cash",
      check: "Check",
    };
    return methodMap[method] || method;
  };

  /**
   * Fetch student data from backend
   */
  const fetchStudentData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch student details
      const studentResponse = await studentService.getStudent(STUDENT_ID);

      if (!studentResponse.success || !studentResponse.data) {
        throw new Error("Failed to fetch student data");
      }

      const student = studentResponse.data;

      // Fetch stipend allocations for this student
      const allocationsResponse = await stipendService.getAllocations({
        student_id: student.id,
      });

      const allocations = Array.isArray(allocationsResponse.data)
        ? allocationsResponse.data
        : (allocationsResponse.data as any)?.data || [];

      // Fetch payment history
      const paymentsResponse = await stipendService.getPaymentHistory(
        student.id
      );
      const payments = paymentsResponse.data || [];

      // Transform and set data
      const transformedData = transformStudentData(
        student,
        allocations,
        payments
      );
      setStudentData(transformedData);
    } catch (err: any) {
      console.error("Error fetching student data:", err);
      setError(err.message || "Failed to load student data");

      // Fallback to mock data for development
      useMockData();
    } finally {
      setLoading(false);
    }
  };

  /**
   * Use mock data as fallback (for development when backend is not available)
   */
  const useMockData = () => {
    const mockStudent: StudentWithStipend = {
      id: "7",
      name: "Tshering Wangpo Dorji",
      studentId: "02230311",
      program: "BE. Software Engineering",
      college: "CST",
      status: "active",
      stipendReceived: true,
      stipendReason: "Stipend Received",
      stipendAmount: 5000,
      totalDeductions: 180,
      netStipend: 4820,
      deductions: [
        {
          id: "d11",
          type: "Library Fee",
          amount: 150,
          description: "Annual library membership",
          date: "15/01/2024",
        },
        {
          id: "d12",
          type: "IT Lab Fee",
          amount: 30,
          description: "Computer lab maintenance",
          date: "21/01/2024",
        },
      ],
      transactions: [
        {
          id: "t7",
          amount: 4820,
          date: "01/02/2024",
          time: "11:05 AM",
          reference: "TXN001240",
          paymentMethod: "Bank Transfer",
          status: "completed",
          description: "Stipend payment for January 2024",
        },
      ],
      profile: {
        id: "7",
        name: "Tshering Wangpo Dorji",
        studentNumber: "02230311",
        program: "BE. Software Engineering",
        college: "CST",
        status: "active",
        email: "02230311.cst@rub.edu.bt",
        phone: "+975-17263253",
        address: "Paro, Bhutan",
        enrollmentDate: "15/06/2021",
        yearLevel: "Year II",
        gpa: 3.62,
      },
    };

    setStudentData(mockStudent);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading student data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !studentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Failed to Load Data
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchStudentData}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!studentData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
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
                  Student Dashboard
                </h1>
                <p className="text-sm text-gray-600">
                  Royal University of Bhutan
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
                <User className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  Student Portal
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Student Profile Card */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl">
              TP
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {studentData.profile.name}
              </h2>
              <p className="text-gray-600">
                {studentData.profile.studentNumber} •{" "}
                {studentData.profile.program}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  Active
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                  Stipend Received
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <p className="text-xs text-gray-500 uppercase">Email</p>
                <p className="text-sm font-medium text-gray-900">
                  {studentData.profile.email}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <p className="text-xs text-gray-500 uppercase">Phone</p>
                <p className="text-sm font-medium text-gray-900">
                  {studentData.profile.phone}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <p className="text-xs text-gray-500 uppercase">Address</p>
                <p className="text-sm font-medium text-gray-900">
                  {studentData.profile.address}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <p className="text-xs text-gray-500 uppercase">Enrollment</p>
                <p className="text-sm font-medium text-gray-900">
                  {studentData.profile.enrollmentDate}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <GraduationCap className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <p className="text-xs text-gray-500 uppercase">Year Level</p>
                <p className="text-sm font-medium text-gray-900">
                  {studentData.profile.yearLevel}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <GraduationCap className="w-5 h-5 text-blue-600 mt-1" />
              <div>
                <p className="text-xs text-gray-500 uppercase">College</p>
                <p className="text-sm font-medium text-gray-900">
                  {studentData.profile.college}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stipend Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Stipend Amount</p>
                <p className="text-3xl font-bold text-blue-600">
                  Nu. {studentData.stipendAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Deductions</p>
                <p className="text-3xl font-bold text-red-600">
                  Nu. {studentData.totalDeductions.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Net Stipend</p>
                <p className="text-3xl font-bold text-green-600">
                  Nu. {studentData.netStipend.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Deductions Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 mb-6">
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-b-2 border-red-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <XCircle className="w-6 h-6 text-red-700" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Deductions
                </h3>
                <p className="text-sm text-gray-600">
                  {studentData.deductions.length} Deduction(s)
                </p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            {studentData.deductions.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {studentData.deductions.map((deduction, idx) => (
                    <tr
                      key={deduction.id}
                      className={`border-b ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {deduction.type}
                      </td>
                      <td className="px-6 py-4 text-red-600 font-semibold">
                        Nu. {deduction.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {deduction.description}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {deduction.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                <p>No deductions recorded</p>
              </div>
            )}
          </div>
        </div>

        {/* Transaction History Section */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b-2 border-green-200 px-6 py-4">
            <div className="flex items-center gap-3">
              <CreditCard className="w-6 h-6 text-green-700" />
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  Transaction History
                </h3>
                <p className="text-sm text-gray-600">
                  {studentData.transactions.length} Transaction(s)
                </p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            {studentData.transactions.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Reference
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {studentData.transactions.map((transaction, idx) => (
                    <tr
                      key={transaction.id}
                      className={`border-b ${
                        idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        Nu. {transaction.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {transaction.date}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {transaction.time}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 font-mono">
                        {transaction.reference}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {transaction.paymentMethod}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            transaction.status === "completed"
                              ? "bg-green-100 text-green-700"
                              : transaction.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {transaction.status.charAt(0).toUpperCase() +
                            transaction.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {transaction.description}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="px-6 py-8 text-center text-gray-500">
                <p>No transactions recorded</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
