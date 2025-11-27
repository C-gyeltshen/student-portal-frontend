"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // Redirect based on user role
      switch (user.role) {
        case "admin":
          router.replace("/admin/dashboard");
          break;
        case "finance_officer":
          router.replace("/finance/dashboard");
          break;
        case "student":
          router.replace("/student/dashboard");
          break;
        case "pending":
          router.replace("/pending");
          break;
        default:
          router.replace("/unauthorized");
      }
    } else if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // Show loading while determining redirect
  if (loading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-12 w-12 text-indigo-600 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="mt-4 text-sm text-gray-600">
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  return null;
}
