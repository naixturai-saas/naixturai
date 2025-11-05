"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Protected from "@/components/Protected";
import { useAuth } from "@/context/AuthContext";

export default function NotificationsPage() {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications/me");
      setNotifications(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/read/${id}`);
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) return <div className="p-6">Loading notifications...</div>;

  return (
    <Protected>
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Your Notifications</h1>
        <ul className="space-y-3">
          {notifications.map((n) => (
            <li
              key={n._id}
              className={`border rounded p-4 ${!n.isRead ? "bg-gray-50" : ""}`}
            >
              <p className="text-sm">
                <b>[{n.type}]</b> {n.message}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(n.createdAt).toLocaleString()}
              </p>
              {!n.isRead && (
                <button
                  onClick={() => markAsRead(n._id)}
                  className="mt-2 text-blue-600 underline text-xs"
                >
                  Mark as read
                </button>
              )}
            </li>
          ))}
          {notifications.length === 0 && (
            <p className="text-sm text-gray-600">No notifications yet.</p>
          )}
        </ul>
      </div>
    </Protected>
  );
}
