"use client";
import Protected from "@/components/Protected";
import api from "@/lib/api";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { isAuthenticated } = useAuth();
  const [data, setData] = useState({
    subscriptions: [],
    payments: [],
    meetings: [],
    notifications: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;
    async function fetchAll() {
      try {
        const [subs, pays, notifs] = await Promise.all([
          api.get("/subscription/me"),
          api.get("/payments/me"),
          api.get("/notifications/me"),
        ]);
        // Meetings listing endpoint for user could be customized; for now skip or add when ready
        setData((d) => ({
          ...d,
          subscriptions: subs.data || [],
          payments: pays.data || [],
          notifications: notifs.data || [],
        }));
      } catch (e) {
        // Handle silently
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [isAuthenticated]);

  return (
    <Protected>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Your Dashboard</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <section className="border rounded p-4">
              <h2 className="font-semibold mb-3">Subscriptions</h2>
              <ul className="space-y-2">
                {data.subscriptions.map((s) => (
                  <li key={s._id} className="text-sm">
                    Plan: <b>{s.plan}</b> — Status: {s.status} — Ends: {new Date(s.endDate).toLocaleDateString()}
                  </li>
                ))}
                {data.subscriptions.length === 0 && <li className="text-sm text-gray-600">No subscriptions yet.</li>}
              </ul>
            </section>

            <section className="border rounded p-4">
              <h2 className="font-semibold mb-3">Payments</h2>
              <ul className="space-y-2">
                {data.payments.map((p) => (
                  <li key={p._id} className="text-sm">
                    {p.amount} {p.currency} — {p.paymentMethod} — {p.status}
                  </li>
                ))}
                {data.payments.length === 0 && <li className="text-sm text-gray-600">No payments recorded.</li>}
              </ul>
            </section>

            <section className="border rounded p-4">
              <h2 className="font-semibold mb-3">Notifications</h2>
              <ul className="space-y-2">
                {data.notifications.map((n) => (
                  <li key={n._id} className="text-sm">
                    [{n.type}] {n.message} {n.isRead ? "" : "•"}
                  </li>
                ))}
                {data.notifications.length === 0 && <li className="text-sm text-gray-600">No notifications.</li>}
              </ul>
            </section>
          </div>
        )}
      </div>
    </Protected>
  );
}
