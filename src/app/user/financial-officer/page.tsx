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
  X,
  Check,
  Mail,
  Phone as PhoneIcon,
  Calendar,
  User,
} from "lucide-react";
import VerticalNav from "../component/VerticalNav";
import { usePathname } from "next/navigation";
import Image from "next/image";

// --- Components ---

function OfficerRow({ officer, onEdit }) {
  const [isOpen, setIsOpen] = useState(false);
  const isActive = officer.status === "Active" || officer.isActive;

  return (
    <>
      <tr className="border-b hover:bg-blue-50/50 transition-colors">
        <td className="p-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 hover:bg-blue-100 rounded-md transition-colors"
            aria-label={isOpen ? "Collapse details" : "Expand details"}
          >
            {isOpen ? (
              <ChevronUp size={18} className="text-blue-600" />
            ) : (
              <ChevronDown size={18} className="text-blue-600" />
            )}
          </button>
        </td>
        <td className="p-4">
          <div className="flex items-center gap-2">
            <Mail size={16} className="text-gray-400" />
            <span className="font-medium text-gray-900">
              {officer.email || "-"}
            </span>
          </div>
        </td>
        <td className="p-4">
          <div className="flex items-center gap-2">
            <PhoneIcon size={16} className="text-gray-400" />
            <span className="text-gray-700">{officer.phone || "-"}</span>
          </div>
        </td>
        <td className="p-4">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
              isActive
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                isActive ? "bg-green-500" : "bg-gray-500"
              }`}
            />
            {officer.status || (officer.isActive ? "Active" : "Inactive")}
          </span>
        </td>
        <td className="p-4">
          <button
            onClick={() => onEdit(officer)}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
            aria-label="Edit officer"
          >
            <Edit size={18} />
          </button>
        </td>
      </tr>
      {isOpen && (
        <tr className="bg-gradient-to-r from-blue-50 to-blue-50/50 border-b">
          <td colSpan={5} className="p-0">
            <div className="p-6 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-2 mb-4">
                <User size={20} className="text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">
                  Officer Details
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    User Email
                  </p>
                  <p className="text-gray-900 font-medium flex items-center gap-2">
                    <Mail size={16} className="text-blue-600" />
                    {officer.email || "-"}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Role ID
                  </p>
                  <p className="text-gray-900 font-medium">
                    {officer.role_id || "-"}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Phone Number
                  </p>
                  <p className="text-gray-900 font-medium flex items-center gap-2">
                    <PhoneIcon size={16} className="text-blue-600" />
                    {officer.phone || "-"}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    User ID
                  </p>
                  <p className="text-gray-900 font-medium font-mono text-sm">
                    {officer.id}
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200 md:col-span-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                    Created At
                  </p>
                  <p className="text-gray-900 font-medium flex items-center gap-2">
                    <Calendar size={16} className="text-blue-600" />
                    {officer.created_at
                      ? new Date(officer.created_at).toLocaleString()
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
    blue: "bg-blue-50 text-blue-600 border-blue-200",
    green: "bg-green-50 text-green-600 border-green-200",
    purple: "bg-purple-50 text-purple-600 border-purple-200",
  };

  return (
    <div className="bg-white rounded-xl p-6 border-2 border-gray-100 hover:border-gray-200 transition-all hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-xl border-2 ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );
}

export default function FinancialOfficerPage() {
  const pathname = usePathname();
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [saving, setSaving] = useState(false);

  const [currentOfficer, setCurrentOfficer] = useState({
    id: null,
    email: "",
    role_id: null,
    status: "Active",
    phone: "",
    created_at: new Date().toISOString(),
    firstName: "",
    lastName: "",
  });

  const FINANCIAL_OFFICER_ROLE_NAME = "Financial Officer";
  const HARDCODED_ROLE_ID = 2;
  const API_BASE_URL = "http://localhost:8080";

  const fetchOfficers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const usersResponse = await fetch(
        `${API_BASE_URL}/api/users/role/${HARDCODED_ROLE_ID}`
      );

      if (!usersResponse.ok) {
        throw new Error(
          `Failed to fetch officers: ${usersResponse.statusText}`
        );
      }

      const userData = await usersResponse.json();

      const mappedOfficers = Array.isArray(userData)
        ? userData.map((user) => ({
            ...user,
            email: user.email || `user-${user.id}@example.com`,
            status: "Active",
            phone: user.phone || "-",
            role_id: HARDCODED_ROLE_ID,
            firstName: user.firstName || "",
            lastName: user.lastName || "",
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

  const activeCount = officers.filter((o) => o.status === "Active").length;

  const filteredOfficers = officers.filter((o) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (o.email || "").toLowerCase().includes(searchLower) ||
      (o.id || "").toString().toLowerCase().includes(searchLower) ||
      (o.firstName || "").toLowerCase().includes(searchLower) ||
      (o.lastName || "").toLowerCase().includes(searchLower)
    );
  });

  const handleOpen = () => {
    setEditMode(false);
    setCurrentOfficer({
      id: null,
      email: "",
      role_id: HARDCODED_ROLE_ID,
      status: "Active",
      phone: "",
      created_at: new Date().toISOString(),
      firstName: "",
      lastName: "",
    });
    setDialogOpen(true);
  };

  const handleEdit = (officer) => {
    setEditMode(true);
    setCurrentOfficer({
      ...officer,
      firstName: officer.firstName || "",
      lastName: officer.lastName || "",
    });
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setSaving(false);
  };

  const handleSave = async () => {
    // Validation
    if (!editMode) {
      if (!currentOfficer.email.trim()) {
        alert("Email is required for a new officer.");
        return;
      }
      if (!currentOfficer.firstName.trim() || !currentOfficer.lastName.trim()) {
        alert("First name and last name are required.");
        return;
      }
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(currentOfficer.email)) {
        alert("Please enter a valid email address.");
        return;
      }
    }

    setSaving(true);

    if (!editMode) {
      try {
        const payload = {
          firstName: currentOfficer.firstName.trim(),
          lastName: currentOfficer.lastName.trim(),
          email: currentOfficer.email.trim(),
        };

        const response = await fetch(
          "http://localhost:8080/api/users/create/finance-officer",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message ||
              `Failed to create officer: ${response.statusText}`
          );
        }

        const newOfficer = await response.json();

        const officerToAdd = {
          ...newOfficer,
          status: "Active",
          phone: newOfficer.phone || "-",
        };

        setOfficers([...officers, officerToAdd]);
        setDialogOpen(false);
        fetchOfficers();
      } catch (error) {
        console.error("Error creating officer:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error occurred";
        alert(`Failed to create officer: ${errorMessage}`);
      } finally {
        setSaving(false);
      }
    } else {
      const officerToSave = {
        ...currentOfficer,
        modified_at: new Date().toISOString(),
        role_id: currentOfficer.role_id || HARDCODED_ROLE_ID,
      };

      setOfficers(
        officers.map((o) => (o.id === officerToSave.id ? officerToSave : o))
      );
      setDialogOpen(false);
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setCurrentOfficer({ ...currentOfficer, [field]: value });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 flex">
      {/* Sidebar with VerticalNav */}
      <div className="w-64 p-4 bg-gray-50 border-r border-gray-200">
        <VerticalNav currentPath={pathname} />
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-b rounded-xl flex items-center justify-center overflow-hidden">
                <Image
                  src="/image/1.png"
                  width={500}
                  height={500}
                  alt="Picture of the author"
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {FINANCIAL_OFFICER_ROLE_NAME} Management
                </h1>
                <p className="text-sm text-gray-500 hidden sm:block">
                  Manage and oversee financial officers
                </p>
              </div>
            </div>
            <button
              onClick={handleOpen}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-all font-medium text-sm sm:text-base shadow-sm hover:shadow-md"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Add Officer</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
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
          <div className="bg-white rounded-xl p-4 mb-6 border border-gray-200 shadow-sm">
            <div className="flex gap-3 items-center">
              <Search size={20} className="text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 outline-none text-gray-900 placeholder-gray-500"
              />
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium text-sm shadow-sm hover:shadow-md">
                <Download size={18} />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 shadow-sm">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-red-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-700 font-medium">Error: {error}</p>
                  <button
                    onClick={fetchOfficers}
                    className="mt-2 text-red-600 hover:text-red-700 font-medium underline"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
              <div className="flex flex-col items-center justify-center gap-4">
                <Loader size={40} className="text-blue-600 animate-spin" />
                <p className="text-gray-600 font-medium">Loading officers...</p>
              </div>
            </div>
          ) : (
            /* Table */
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <tr>
                      <th className="p-4 text-left w-12"></th>
                      <th className="p-4 text-left font-semibold text-sm sm:text-base">
                        Email
                      </th>
                      <th className="p-4 text-left font-semibold text-sm sm:text-base">
                        Phone
                      </th>
                      <th className="p-4 text-left font-semibold text-sm sm:text-base">
                        Status
                      </th>
                      <th className="p-4 text-left font-semibold text-sm sm:text-base">
                        Actions
                      </th>
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
                        <td colSpan={5} className="p-12 text-center">
                          <div className="flex flex-col items-center gap-3">
                            <Users size={48} className="text-gray-300" />
                            <p className="text-gray-500 font-medium">
                              {officers.length === 0
                                ? "No officers found. Add your first officer to get started."
                                : "No officers match your search criteria."}
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Dialog */}
        {dialogOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editMode
                      ? "Edit Financial Officer"
                      : "Add New Financial Officer"}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {editMode
                      ? "Update officer information"
                      : "Enter details for the new officer"}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close dialog"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {editMode ? (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="email"
                          value={currentOfficer.email}
                          onChange={(e) =>
                            handleChange("email", e.target.value)
                          }
                          className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <PhoneIcon
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                          />
                          <input
                            type="tel"
                            value={currentOfficer.phone}
                            onChange={(e) =>
                              handleChange("phone", e.target.value)
                            }
                            placeholder="Enter phone number"
                            className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Status
                        </label>
                        <select
                          value={currentOfficer.status}
                          onChange={(e) =>
                            handleChange("status", e.target.value)
                          }
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          First Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={currentOfficer.firstName}
                          onChange={(e) =>
                            handleChange("firstName", e.target.value)
                          }
                          placeholder="John"
                          className="w-full px-3 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Last Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={currentOfficer.lastName}
                          onChange={(e) =>
                            handleChange("lastName", e.target.value)
                          }
                          placeholder="Doe"
                          className="w-full px-3 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="email"
                          value={currentOfficer.email}
                          onChange={(e) =>
                            handleChange("email", e.target.value)
                          }
                          placeholder="john.doe@rub.edu.bt"
                          className="w-full pl-10 pr-3 py-2.5 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
                <button
                  onClick={handleClose}
                  disabled={saving}
                  className="px-5 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader size={18} className="animate-spin" />
                      {editMode ? "Updating..." : "Adding..."}
                    </>
                  ) : (
                    <>
                      <Check size={18} />
                      {editMode ? "Update Officer" : "Add Officer"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
