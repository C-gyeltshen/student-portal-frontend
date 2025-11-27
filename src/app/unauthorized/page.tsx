"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function UnauthorizedPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-xl rounded-lg p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <svg
              className="w-16 h-16 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              ></path>
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Access Denied
          </h1>

          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-800 text-sm">
              You don't have permission to access this page. Your current role
              doesn't have the required privileges.
            </p>
          </div>

          {user && (
            <div className="text-left bg-gray-50 rounded-md p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-2">
                Current Account:
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">Email:</span> {user.email}
                </p>
                <p>
                  <span className="font-medium">Role:</span>
                  <span className="ml-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {user.role}
                  </span>
                </p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Link
              href="/dashboard"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out block text-center"
            >
              Go to Dashboard
            </Link>

            <Link
              href="/"
              className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-md transition duration-150 ease-in-out block text-center"
            >
              Go to Home
            </Link>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Need access to this area? Contact your{" "}
              <Link
                href="/contact"
                className="text-indigo-600 hover:text-indigo-500"
              >
                system administrator
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
