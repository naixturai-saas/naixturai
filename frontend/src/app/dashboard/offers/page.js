"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Protected from "@/components/Protected";
import { useAuth } from "@/context/AuthContext";

export default function AdminOffersPage() {
  const { isAuthenticated } = useAuth();
  const [offers, setOffers] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    discountPercent: 10,
    validUntil: "",
  });
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const fetchOffers = async () => {
    try {
      const res = await api.get("/offers");
      setOffers(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const createOffer = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await api.post("/offers", form);
      setMsg("✅ Offer created successfully");
      setForm({ title: "", description: "", discountPercent: 10, validUntil: "" });
      fetchOffers();
    } catch (err) {
      setMsg(err?.response?.data?.msg || "❌ Failed to create offer");
    }
  };

  const deleteOffer = async (id) => {
    try {
      await api.delete(`/offers/${id}`);
      fetchOffers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Protected roles={["admin", "owner"]}>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Manage Offers</h1>

        {/* Create Offer Form */}
        <form onSubmit={createOffer} className="border rounded p-4 mb-6 space-y-3">
          <h2 className="font-semibold">Create New Offer</h2>
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            placeholder="Offer title"
            className="w-full border rounded px-3 py-2"
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            placeholder="Offer description"
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="number"
            name="discountPercent"
            value={form.discountPercent}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Discount %"
            required
          />
          <input
            type="date"
            name="validUntil"
            value={form.validUntil}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          <button type="submit" className="bg-black text-white px-4 py-2 rounded">
            Create Offer
          </button>
          {msg && <p className="text-sm mt-2">{msg}</p>}
        </form>

        {/* Offers List */}
        {loading ? (
          <p>Loading offers...</p>
        ) : (
          <ul className="space-y-3">
            {offers.map((o) => (
              <li key={o._id} className="border rounded p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{o.title}</h3>
                  <p className="text-sm">{o.description}</p>
                  <p className="text-xs text-gray-500">
                    {o.discountPercent}% off — Valid until {new Date(o.validUntil).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => deleteOffer(o._id)}
                  className="text-red-600 underline text-sm"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Protected>
  );
}
