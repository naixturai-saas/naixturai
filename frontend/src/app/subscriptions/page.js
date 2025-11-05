"use client";
import { useState } from "react";
import api from "@/lib/api";
import Protected from "@/components/Protected";
import { useAuth } from "@/context/AuthContext";

const PLANS = [
  { key: "basic", title: "Basic", price: 499, desc: "Starter features" },
  { key: "premium", title: "Premium", price: 1499, desc: "Advanced features" },
  { key: "hero", title: "Hero", price: 2999, desc: "Everything unlocked" },
];

export default function SubscriptionsPage() {
  const { isAuthenticated } = useAuth();
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const subscribe = async (plan) => {
    setMsg("");
    setLoading(true);
    try {
      // Create subscription for 1 month
      const sub = await api.post("/subscription", { plan, durationInMonths: 1 });
      // Record payment (dummy success)
      await api.post("/payments", {
        subscriptionId: sub.data.subscription._id,
        amount: PLANS.find((p) => p.key === plan).price,
        paymentMethod: "upi",
      });
      setMsg(`Subscribed to ${plan} successfully!`);
    } catch (e) {
      setMsg(e?.response?.data?.msg || "Subscription failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Protected>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Choose your plan</h1>
        {msg && <p className="mb-4 text-sm">{msg}</p>}
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((p) => (
            <div key={p.key} className="border rounded p-4">
              <h2 className="font-semibold">{p.title}</h2>
              <p className="text-sm text-gray-600">{p.desc}</p>
              <p className="mt-2 font-medium">₹{p.price}/month</p>
              <button
                className="mt-3 rounded bg-black px-4 py-2 text-white disabled:opacity-60"
                disabled={loading}
                onClick={() => subscribe(p.key)}
              >
                {loading ? "Processing..." : `Subscribe ${p.title}`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </Protected>
  );
}
