// Example usage of the updated authentication system
// This shows how to use the new useProtectedApi hook

import React, { useEffect } from "react";
import { useProtectedApi } from "@/hooks/useProtectedApi";
import { useAuth } from "@/contexts/AuthContext";

export default function ExampleUsage() {
  const { user, loading: authLoading } = useAuth();
  const { data, loading, error, getProfile, getDashboard } = useProtectedApi();

  useEffect(() => {
    if (user && !authLoading) {
      // Automatically fetch user profile when authenticated
      getProfile();
    }
  }, [user, authLoading, getProfile]);

  const handleGetDashboard = async () => {
    try {
      const dashboardData = await getDashboard();
      console.log("Dashboard data:", dashboardData);
    } catch (error) {
      console.error("Failed to fetch dashboard:", error);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4 m-4">
        <div className="flex">
          <div className="text-red-400">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <div className="mt-2 text-sm text-red-700">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600">Please log in to access this content.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Protected Content</h1>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">User Information</h2>
        <div className="space-y-2">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Name:</strong> {user.displayName || "N/A"}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <p>
            <strong>Verified:</strong> {user.isVerified ? "Yes" : "No"}
          </p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Profile Data</h2>
        {data ? (
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        ) : (
          <p className="text-gray-600">No profile data available</p>
        )}

        <button
          onClick={handleGetDashboard}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
        >
          Load Dashboard
        </button>
      </div>
    </div>
  );
}
