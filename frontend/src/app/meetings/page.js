"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import Protected from "@/components/Protected";
import { useAuth } from "@/context/AuthContext";

export default function MeetingsPage() {
  const { isAuthenticated } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", description: "", date: "", duration: 30 });
  const [msg, setMsg] = useState("");

  const fetchMeetings = async () => {
    try {
      const res = await api.get("/meetings"); // Admin only, so for user we can filter later
      setMeetings(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await api.post("/meetings", form);
      setMsg("✅ Meeting scheduled successfully");
      setForm({ title: "", description: "", date: "", duration: 30 });
      fetchMeetings();
    } catch (err) {
      setMsg(err?.response?.data?.msg || "❌ Failed to schedule meeting");
    }
  };

  const cancelMeeting = async (id) => {
    try {
      await api.put(`/meetings/cancel/${id}`);
      fetchMeetings();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Protected>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Meetings</h1>

        {/* Create Meeting Form */}
        <form onSubmit={onSubmit} className="border rounded p-4 mb-6 space-y-3">
          <h2 className="font-semibold">Schedule a Meeting</h2>
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            placeholder="Meeting title"
            className="w-full border rounded px-3 py-2"
            required
          />
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            placeholder="Meeting description"
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="datetime-local"
            name="date"
            value={form.date}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
            required
          />
          <input
            type="number"
            name="duration"
            value={form.duration}
            onChange={onChange}
            className="w-full border rounded px-3 py-2"
            placeholder="Duration (minutes)"
            required
          />
          <button type="submit" className="bg-black text-white px-4 py-2 rounded">
            Schedule
          </button>
          {msg && <p className="text-sm mt-2">{msg}</p>}
        </form>

        {/* Meetings List */}
        {loading ? (
          <p>Loading meetings...</p>
        ) : (
          <ul className="space-y-3">
            {meetings.map((m) => (
              <li key={m._id} className="border rounded p-4">
                <h3 className="font-semibold">{m.title}</h3>
                <p className="text-sm text-gray-600">{m.description}</p>
                <p className="text-xs text-gray-500">
                  {new Date(m.date).toLocaleString()} — {m.duration} mins
                </p>
                <p className="text-xs">Status: {m.status}</p>
                {m.status === "scheduled" && (
                  <button
                    onClick={() => cancelMeeting(m._id)}
                    className="mt-2 text-red-600 underline text-sm"
                  >
                    Cancel
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Protected>
  );
}
