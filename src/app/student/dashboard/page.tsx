"use client";

import { useAuth } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { useEffect, useState } from "react";
import { studentAPI } from "@/lib/api";

interface StudentProfile {
  name: string;
  email: string;
  studentId: string;
  program: string;
  college: string;
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    status: string;
  };
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Fetch student dashboard data
        const [dashboardResponse, bankDetailsResponse] = await Promise.all([
          studentAPI.getStudentDashboard(),
          studentAPI.getMyBankDetails().catch(() => ({ data: null })), // Bank details might not exist
        ]);

        const dashboardData = dashboardResponse.data;
        const bankData = bankDetailsResponse.data;

        const studentProfile: StudentProfile = {
          name: user?.displayName || "Student",
          email: user?.email || "",
          studentId: dashboardData.studentId,
          program: dashboardData.program,
          college: dashboardData.college,
          bankDetails: bankData
            ? {
                bankName: bankData.bankName,
                accountNumber: bankData.accountNumber,
                status: bankData.status,
              }
            : undefined,
        };

        setProfile(studentProfile);
      } catch (error) {
        console.error("Error fetching student profile:", error);
        // Set basic profile from user data if API fails
        setProfile({
          name: user?.displayName || "Student",
          email: user?.email || "",
          studentId: "N/A",
          program: "N/A",
          college: "N/A",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">
                Student Dashboard
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Welcome back, {user?.displayName}! Manage your profile and
                banking details.
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white overflow-hidden shadow rounded-lg animate-pulse"
                  >
                    <div className="p-5">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Profile Card */}
                <div className="bg-white overflow-hidden shadow rounded-lg lg:col-span-2">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Your Profile
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Full Name
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {profile?.name}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Email
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {profile?.email}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Student ID
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {profile?.studentId}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-sm font-medium text-gray-500">
                          Program
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {profile?.program}
                        </dd>
                      </div>
                      <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">
                          College
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {profile?.college}
                        </dd>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Banking Status Card */}
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Banking Status
                    </h3>
                    {profile?.bankDetails ? (
                      <div className="space-y-3">
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Bank
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            {profile.bankDetails.bankName}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Account
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            ****{profile.bankDetails.accountNumber.slice(-4)}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-sm font-medium text-gray-500">
                            Status
                          </dt>
                          <dd className="mt-1">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                profile.bankDetails.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {profile.bankDetails.status}
                            </span>
                          </dd>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          ></path>
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          No banking details
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Set up your banking information
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="mt-8 bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Link
                    href="/student/profile"
                    className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div>
                      <span className="rounded-lg inline-flex p-3 bg-blue-50 text-blue-700 ring-4 ring-white">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          ></path>
                        </svg>
                      </span>
                    </div>
                    <div className="mt-8">
                      <h3 className="text-lg font-medium">
                        <span
                          className="absolute inset-0"
                          aria-hidden="true"
                        ></span>
                        Update Profile
                      </h3>
                      <p className="mt-2 text-sm text-gray-500">
                        Edit your personal information
                      </p>
                    </div>
                  </Link>

                  <Link
                    href="/student/banking"
                    className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-500 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div>
                      <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-700 ring-4 ring-white">
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          ></path>
                        </svg>
                      </span>
                    </div>
                    <div className="mt-8">
                      <h3 className="text-lg font-medium">
                        <span
                          className="absolute inset-0"
                          aria-hidden="true"
                        ></span>
                        Banking Details
                      </h3>
                      <p className="mt-2 text-sm text-gray-500">
                        {profile?.bankDetails
                          ? "Manage your banking information"
                          : "Set up banking information"}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
