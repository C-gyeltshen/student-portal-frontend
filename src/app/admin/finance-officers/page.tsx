"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ChevronDown,
  ChevronUp,
  Edit,
  Plus,
  Briefcase,
  Users,
  AlertCircle,
  Search,
  Download,
  Loader,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useProtectedApi } from "@/hooks/useProtectedApi";

// --- Components ---

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ComponentType<{ size: number }>;
  color?: "blue" | "green" | "purple";
}

interface Officer {
  id: string | number;
  email: string;
  phone?: string;
  status?: string;
  isActive?: boolean;
  role?: string;
  created_at?: string;
  firstName?: string;
  lastName?: string;
}

function OfficerRow({
  officer,
  onEdit,
}: {
  officer: Officer;
  onEdit: (officer: Officer) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  // Status check for styling
  const isActive = officer.status === "Active" || officer.isActive;

  return (
    <>
      <tr
        key={`officer-${officer.id}`}
        className="border-b hover:bg-blue-50 transition"
      >
        <td className="p-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1 hover:bg-blue-200 rounded transition"
          >
            {isOpen ? (
              <ChevronUp size={20} className="text-blue-600" />
            ) : (
              <ChevronDown size={20} className="text-blue-600" />
            )}
          </button>
        </td>
        <td className="p-4 font-semibold text-gray-900">
          {officer.email || "-"} {/* Using email as primary name substitute */}
        </td>
        <td className="p-4 text-gray-700">{officer.phone || "-"}</td>
        <td className="p-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isActive
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {officer.status || (officer.isActive ? "Active" : "Inactive")}
          </span>
        </td>
        <td className="p-4">
          <button
            onClick={() => onEdit(officer)}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
          >
            <Edit size={18} />
          </button>
        </td>
      </tr>
      {isOpen && (
        <tr
          key={`officer-details-${officer.id}`}
          className="bg-blue-50 border-b"
        >
          <td colSpan={6} className="p-0">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Officer Details
              </h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                    User Email (Unique)
                  </p>
                  <p className="text-gray-900 font-medium">
                    {officer.email || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                    Role
                  </p>
                  <p className="text-gray-900 font-medium">
                    {officer.role || "Finance Officer"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                    Phone (Placeholder)
                  </p>
                  <p className="text-gray-900 font-medium">
                    {officer.phone || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                    User ID
                  </p>
                  <p className="text-gray-900 font-medium">{officer.id}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                    Created At
                  </p>
                  <p className="text-gray-900 font-medium">
                    {officer.created_at
                      ? new Date(officer.created_at).toLocaleDateString()
                      : "-"}
                  </p>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function StatCard({ label, value, icon: Icon, color = "blue" }: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

export default function AdminFinancialOfficerPage() {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Use the new protected API hook
  const { getAllUsers, updateUser } = useProtectedApi();

  const [currentOfficer, setCurrentOfficer] = useState({
    id: null as string | number | null,
    email: "",
    status: "Active",
    phone: "",
    created_at: new Date().toISOString(),
    firstName: "",
    lastName: "",
  });

  const FINANCIAL_OFFICER_ROLE_NAME = "Financial Officer";

  const fetchOfficers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Use the protected API hook to get all users
      const userData = await getAllUsers();

      // Filter for finance officers
      const financeOfficers: Officer[] = userData.filter(
        (user: Officer) => user.role === "finance_officer"
      );

      // Map DB response to UI model, adding the status field
      const mappedOfficers = financeOfficers.map((user) => ({
        ...user,
        email: user.email || `user-${user.id}@example.com`,
        status: "Active",
        phone: user.phone || "-",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      }));

      setOfficers(mappedOfficers);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error("Error fetching officers:", err);
    } finally {
      setLoading(false);
    }
  }, [getAllUsers]);

  useEffect(() => {
    fetchOfficers();
  }, [fetchOfficers]);

  // --- Calculations and Handlers ---

  const activeCount = officers.filter((o) => o.status === "Active").length;

  const filteredOfficers = officers.filter((o) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (o.email || "").toLowerCase().includes(searchLower) ||
      (o.id || "").toString().toLowerCase().includes(searchLower)
    );
  });

  const handleOpen = () => {
    setEditMode(false);
    setCurrentOfficer({
      id: null,
      email: "",
      status: "Active",
      phone: "",
      created_at: new Date().toISOString(),
      firstName: "",
      lastName: "",
    });
    setDialogOpen(true);
  };

  const handleEdit = (officer: Officer): void => {
    setEditMode(true);
    setCurrentOfficer({
      id: officer.id,
      email: officer.email,
      status: officer.status || "Active",
      phone: officer.phone || "",
      created_at: officer.created_at || new Date().toISOString(),
      firstName: officer.firstName || "",
      lastName: officer.lastName || "",
    });
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleSave = async () => {
    // Validation
    if (!editMode) {
      if (!currentOfficer.email) {
        alert("Email is required for a new officer.");
        return;
      }
      if (!currentOfficer.firstName || !currentOfficer.lastName) {
        alert("First name and last name are required.");
        return;
      }
    }

    if (!editMode) {
      // Add mode - you might want to implement user creation through admin API
      try {
        // For now, this would need a backend endpoint to create finance officer users
        // Since we don't have that endpoint defined, we'll just show a success message
        // and refresh the list

        alert("Finance officer creation not yet implemented in backend API");
        setDialogOpen(false);

        // Optionally refresh the list
        fetchOfficers();
      } catch (error) {
        console.error("Error creating officer:", error);
        alert(
          `Failed to create officer: ${
            error instanceof Error ? error.message : "An unknown error occurred"
          }`
        );
      }
    } else {
      // Edit mode - update existing officer using admin API
      try {
        if (!currentOfficer.id) {
          alert("Officer ID is required for update.");
          return;
        }

        await updateUser(String(currentOfficer.id), {
          email: currentOfficer.email,
          phone: currentOfficer.phone,
          // Add other updateable fields
        });

        // Update local state
        setOfficers(
          officers.map((o) =>
            o.id === currentOfficer.id
              ? { ...currentOfficer, id: currentOfficer.id! }
              : o
          )
        );
        setDialogOpen(false);
      } catch (error) {
        console.error("Error updating officer:", error);
        alert(
          `Failed to update officer: ${
            error instanceof Error ? error.message : "An unknown error occurred"
          }`
        );
      }
    }
  };

  interface HandleChangeParams {
    field: keyof Officer;
    value: string | number;
  }

  const handleChange = (field: keyof Officer, value: string | number): void => {
    setCurrentOfficer({ ...currentOfficer, [field]: value });
  };

  // --- Render ---
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Link
                href="/admin/dashboard"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <Briefcase size={28} className="text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                {FINANCIAL_OFFICER_ROLE_NAME} Management
              </h1>
            </div>
            <button
              onClick={handleOpen}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              <Plus size={20} />
              Add {FINANCIAL_OFFICER_ROLE_NAME.split(" ")[0]}
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <StatCard
              label="Total Officers"
              value={officers.length}
              icon={Users}
              color="blue"
            />
            <StatCard
              label="Active Officers"
              value={activeCount}
              icon={Briefcase}
              color="green"
            />
            <StatCard
              label="Inactive Officers"
              value={officers.length - activeCount}
              icon={AlertCircle}
              color="purple"
            />
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
            <div className="flex gap-3 items-center">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search by email or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 outline-none text-gray-900 placeholder-gray-500"
              />
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">
                <Download size={18} />
                Export
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 font-medium">Error: {error}</p>
              <button
                onClick={fetchOfficers}
                className="mt-2 text-red-600 hover:text-red-700 font-medium underline"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
              <div className="flex flex-col items-center justify-center gap-4">
                <Loader size={40} className="text-blue-600 animate-spin" />
                <p className="text-gray-600 font-medium">Loading officers...</p>
              </div>
            </div>
          ) : (
            /* Table */
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-4 text-left w-12"></th>
                    <th className="p-4 text-left font-semibold">Email</th>
                    <th className="p-4 text-left font-semibold">Phone</th>
                    <th className="p-4 text-left font-semibold">Status</th>
                    <th className="p-4 text-left font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOfficers.length > 0 ? (
                    filteredOfficers.map((officer) => (
                      <OfficerRow
                        key={officer.id}
                        officer={officer}
                        onEdit={handleEdit}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-gray-500">
                        {officers.length === 0
                          ? "No officers found."
                          : "No officers match your search."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Dialog */}
        {dialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editMode
                    ? "Edit Financial Officer"
                    : "Add New Financial Officer"}
                </h2>
              </div>

              <div className="p-6 space-y-4">
                {editMode ? (
                  // Existing fields for EDIT mode
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Email (Unique)
                      </label>
                      <input
                        type="email"
                        value={currentOfficer.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Phone (Placeholder)
                        </label>
                        <input
                          type="tel"
                          value={currentOfficer.phone}
                          onChange={(e) =>
                            handleChange("phone", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Status (Business Logic)
                        </label>
                        <select
                          value={currentOfficer.status}
                          onChange={(e) =>
                            handleChange("status", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </>
                ) : (
                  // New fields for ADD mode
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={currentOfficer.firstName}
                          onChange={(e) =>
                            handleChange("firstName", e.target.value)
                          }
                          placeholder="John"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={currentOfficer.lastName}
                          onChange={(e) =>
                            handleChange("lastName", e.target.value)
                          }
                          placeholder="Doe"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Email (Unique)
                      </label>
                      <input
                        type="email"
                        value={currentOfficer.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        placeholder="john.doe@rub.edu.bt"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={handleClose}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  {editMode ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
