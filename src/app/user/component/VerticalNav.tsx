// --- NEW VerticalNav Component ---
import React from "react";
import {
  LayoutDashboard,
  DollarSign,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface NavItem {
  name: string;
  icon: React.ElementType;
  href: string;
  isActive: boolean;
}

interface VerticalNavProps {
  currentPath: string; // The currently active path/view
}

const VerticalNav: React.FC<VerticalNavProps> = ({ currentPath }) => {
  const router = useRouter();

  // Define the navigation items
  // Note: Paths are placeholders for demonstration purposes.
  const navItems: NavItem[] = [
    {
      name: "Admin Dashboard",
      icon: LayoutDashboard,
      href: "/user/dashboard",
      isActive: currentPath.includes("/dashboard/admin"),
    },
    {
      name: "Finance Office",
      icon: DollarSign,
      href: "/finance/dashboard",
      isActive: currentPath.includes("/dashboard/financial-officer"),
    },
    {
      name: "Student Records",
      icon: GraduationCap,
      // This includes the current view path and the root path if applicable
      href: "/finance-officerx",
      isActive:
        currentPath.includes("/dashboard/student-records") ||
        currentPath === "/",
    },
    {
      name: "Login as FO",
      icon: LayoutDashboard,
      href: "/user/login",
      isActive: currentPath.includes("/dashboard/admin"),
    },
  ];

  return (
    <div className="flex flex-col space-y-3 p-4 bg-white rounded-xl shadow-lg border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-1">
        Navigation
      </h3>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.name}
            onClick={() => router.push(item.href)}
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
  );
};

export default VerticalNav;
// --- End NEW VerticalNav Component ---
