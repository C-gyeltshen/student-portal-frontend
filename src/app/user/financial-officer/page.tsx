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
} from "lucide-react";

// --- Components ---

function OfficerRow({ officer, onEdit }) {
  const [isOpen, setIsOpen] = useState(false);
  // Status check for styling
  const isActive = officer.status === "Active" || officer.isActive;

  return (
    <>
      <tr // FIX: Removed whitespace/newline before the next element for hydration safety
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
                    Role ID
                  </p>
                  <p className="text-gray-900 font-medium">
                    {officer.role_id || "-"}
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

function StatCard({ label, value, icon: Icon, color = "blue" }) {
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

export default function FinancialOfficerPage() {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // MODIFICATION: Added firstName and lastName to the state for the new form fields.
  const [currentOfficer, setCurrentOfficer] = useState({
    id: null, // UUID
    email: "", // from users table
    role_id: null, // from users table
    status: "Active", // Status is a frontend/business logic field, not in DB
    phone: "", // Placeholder for UI
    created_at: new Date().toISOString(),
    firstName: "", // NEW FIELD
    lastName: "", // NEW FIELD
  });

  const FINANCIAL_OFFICER_ROLE_NAME = "Financial Officer";
  const HARDCODED_ROLE_ID = 2; // FIX: Use the original hardcoded ID '2' to ensure the fetch endpoint works
  const API_BASE_URL = "http://localhost:8082";

  /**
   * FIX: Modified to use the original working endpoint to prevent the "Failed to find role" error.
   * This skips the two-step fetch (role name -> role id) and assumes role ID '2' is correct.
   */
  const fetchOfficers = useCallback(async () => {
    setLoading(true);
    setError(null);
    const roleId = HARDCODED_ROLE_ID;

    try {
      // Use the direct, assumed working endpoint: /users/role/2
      const usersResponse = await fetch(`${API_BASE_URL}/users/role/${roleId}`);

      if (!usersResponse.ok) {
        throw new Error(
          `Failed to fetch officers: ${usersResponse.statusText}`
        );
      }

      const userData = await usersResponse.json();

      // Map DB response to UI model, adding the status field
      const mappedOfficers = Array.isArray(userData)
        ? userData.map((user) => ({
            ...user,
            // Ensure email is present for the primary table column
            email: user.email || `user-${user.id}@example.com`,
            status: "Active",
            phone: user.phone || "-",
            role_id: roleId,
            firstName: "", // Initialize new fields for existing officers too
            lastName: "", // Initialize new fields for existing officers too
          }))
        : [];

      setOfficers(mappedOfficers);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching officers:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOfficers();
  }, [fetchOfficers]);

  // --- Calculations and Handlers ---

  const activeCount = officers.filter((o) => o.status === "Active").length;

  const filteredOfficers = officers.filter((o) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (o.email || "").toLowerCase().includes(searchLower) || // Search by email
      (o.id || "").toString().toLowerCase().includes(searchLower)
    ); // Search by ID
  });

  const handleOpen = () => {
    setEditMode(false);
    // MODIFICATION: Initialize new fields
    setCurrentOfficer({
      id: null,
      email: "",
      role_id: HARDCODED_ROLE_ID, // Pre-fill with the Financial Officer role ID
      status: "Active",
      phone: "",
      created_at: new Date().toISOString(),
      firstName: "", // INITIALIZE
      lastName: "", // INITIALIZE
    });
    setDialogOpen(true);
  };

  const handleEdit = (officer) => {
    setEditMode(true);
    // When editing, the new fields aren't explicitly in the current data,
    // but the email, phone, and status are the key editable fields.
    setCurrentOfficer({
      ...officer,
      // Ensure new fields are present for consistency, even if empty
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
      // Add mode - make POST request
      try {
        const payload = {
          firstName: currentOfficer.firstName,
          lastName: currentOfficer.lastName,
          email: currentOfficer.email,
        };

        const response = await fetch("/api/users/create/finance-officer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              `Failed to create officer: ${response.statusText}`
          );
        }

        const newOfficer = await response.json();

        // Add the new officer to the list with proper formatting
        const officerToAdd = {
          ...newOfficer,
          status: "Active",
          phone: newOfficer.phone || "-",
        };

        setOfficers([...officers, officerToAdd]);
        setDialogOpen(false);

        // Optionally refresh the list
        fetchOfficers();
      } catch (error) {
        console.error("Error creating officer:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        alert(`Failed to create officer: ${errorMessage}`);
      }
    } else {
      // Edit mode - update existing officer
      let officerToSave = {
        ...currentOfficer,
        modified_at: new Date().toISOString(),
        role_id: currentOfficer.role_id || HARDCODED_ROLE_ID,
      };

      setOfficers(
        officers.map((o) => (o.id === officerToSave.id ? officerToSave : o))
      );
      setDialogOpen(false);
    }
  };

  const handleChange = (field, value) => {
    // MODIFICATION: Handles the new fields as well
    setCurrentOfficer({ ...currentOfficer, [field]: value });
  };

  // --- Render ---
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
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
                        onChange={(e) => handleChange("phone", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Status (Business Logic)
                      </label>
                      <select
                        value={currentOfficer.status}
                        onChange={(e) => handleChange("status", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </>
              ) : (
                // MODIFICATION: New fields for ADD mode
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
                  {/* Note: phone and status fields are hidden in 'Add' mode as per task, but 'status' will default to Active on save. */}
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
  );
}
