"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  LayoutDashboard,
  DollarSign,
  GraduationCap,
  ChevronRight,
  CreditCard,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";

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
      href: "/user/financial-officer",
      isActive: currentPath.includes("/user/financial-officer"),
    },
    {
      name: "Student Records",
      icon: GraduationCap,
      href: "/dashboard/student-records",
      isActive: currentPath.includes("/dashboard/student-records"),
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

      {/* Navigation Sidebar */}
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

const LoginPage = () => {
  const router = useRouter();
  const [currentPath] = useState("/login");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    // Simulate API call
    try {
      // Replace with your actual API endpoint
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const data = await response.json();
      // Handle successful login (e.g., store token, redirect)
      router.push("/dashboard/student-records");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

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
                  alt="RUB Logo"
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

            {/* Login Button */}
            <button
              onClick={() => router.push("/user/login")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-sm"
            >
              <Lock className="w-4 h-4" />
              <span className="font-medium text-sm hidden sm:inline">
                Login
              </span>
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

          {/* Right Column: Login Form */}
          <div className="flex-1 min-w-0 flex items-center justify-center">
            <div className="w-full max-w-md">
              {/* Login Form Header */}
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                  Welcome Back
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Sign in to access your student portal
                </p>
              </div>

              {/* Login Form Card */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8">
                <div className="space-y-6">
                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-red-800">
                          Login Failed
                        </p>
                        <p className="text-sm text-red-600 mt-1">{error}</p>
                      </div>
                    </div>
                  )}

                  {/* Email Input */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        placeholder="Enter your email"
                        className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                        placeholder="Enter your password"
                        className="w-full pl-10 pr-12 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                      <button
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember"
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <label
                        htmlFor="remember"
                        className="ml-2 text-sm text-gray-700"
                      >
                        Remember me
                      </label>
                    </div>
                    <a
                      href="#"
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Forgot password?
                    </a>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Signing in...</span>
                      </>
                    ) : (
                      <span>Sign In</span>
                    )}
                  </button>
                </div>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">
                      Don't have an account?
                    </span>
                  </div>
                </div>

                {/* Sign Up Link */}
                <div className="text-center">
                  <a
                    href="#"
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Create an account
                  </a>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-600">
                  Need help?{" "}
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Contact Support
                  </a>
                </p>
                <p className="text-xs text-gray-500 mt-4">
                  © 2024 Royal University of Bhutan. All rights reserved.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
