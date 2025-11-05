"use client";
import Protected from "@/components/Protected";
import { useAuth } from "@/context/AuthContext";

export default function AdminDashboardPage() {
  const { isAuthenticated } = useAuth();
  // Add actual CRUD sections as needed (blogs, projects, offers, payments, meetings)
  return (
    <Protected roles={["admin", "owner"]}>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>
        <p className="text-sm text-gray-700">
          Manage content & operations: blogs, portfolio, offers, meetings, payments, notifications.
        </p>
        {/* Add forms and tables that call your backend routes */}
      </div>
    </Protected>
  );
}
