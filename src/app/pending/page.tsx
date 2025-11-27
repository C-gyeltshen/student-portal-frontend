"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

export default function PendingPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== "pending") {
      // If user already has a role, redirect to dashboard
      router.push("/dashboard");
    }
  }, [user, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-xl rounded-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <svg
              className="w-16 h-16 text-yellow-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Account Under Review
          </h1>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              Your account has been created successfully! Your role request is
              currently under review by our administrators.
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="text-left bg-gray-50 rounded-md p-4">
              <h3 className="font-medium text-gray-900 mb-2">
                Account Details:
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Email:</span> {user?.email}
                </p>
                <p>
                  <span className="font-medium">Name:</span> {user?.displayName}
                </p>
                <p>
                  <span className="font-medium">Status:</span>
                  <span className="ml-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Pending Approval
                  </span>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              <h3 className="font-medium text-gray-900 mb-2">
                What happens next?
              </h3>
              <ul className="text-left space-y-1">
                <li>• An administrator will review your role request</li>
                <li>• You'll receive an email when your account is approved</li>
                <li>
                  • You can then access your dashboard based on your assigned
                  role
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out"
              >
                Sign Out
              </button>

              <p className="mt-3 text-xs text-gray-500">
                Need help? Contact our{" "}
                <Link
                  href="/contact"
                  className="text-indigo-600 hover:text-indigo-500"
                >
                  support team
                </Link>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Want to use a different email?{" "}
            <button
              onClick={handleLogout}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Create new account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
