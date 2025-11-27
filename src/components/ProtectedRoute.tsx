"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: ("admin" | "finance_officer" | "student")[];
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function ProtectedRoute({
  children,
  allowedRoles = [],
  requireAuth = true,
  redirectTo,
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // If authentication is required but user is not logged in
      if (requireAuth && !user) {
        router.push("/login");
        return;
      }

      // If user is logged in but hasn't been assigned a role yet
      if (user && user.role === "pending") {
        router.push("/pending");
        return;
      }

      // If specific roles are required and user doesn't have the right role
      if (
        user &&
        allowedRoles.length > 0 &&
        user.role &&
        user.role !== "pending" &&
        !allowedRoles.includes(user.role)
      ) {
        const defaultRedirect = redirectTo || "/unauthorized";
        router.push(defaultRedirect);
        return;
      }
    }
  }, [user, loading, router, allowedRoles, requireAuth, redirectTo]);

  // Show loading spinner while checking authentication
  if (loading) {
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
          <p className="mt-4 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If authentication is required but user is not logged in, don't render children
  if (requireAuth && !user) {
    return null;
  }

  // If user is pending approval, don't render children
  if (user && user.role === "pending") {
    return null;
  }

  // If specific roles are required and user doesn't have the right role, don't render children
  if (
    user &&
    allowedRoles.length > 0 &&
    user.role &&
    user.role !== "pending" &&
    !allowedRoles.includes(user.role)
  ) {
    return null;
  }

  // All checks passed, render children
  return <>{children}</>;
}
