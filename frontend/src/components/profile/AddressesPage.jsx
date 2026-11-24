import React, { useEffect, useState, useContext } from "react";
import api from "@/api/axiosInstance";
import { UserContext } from "@/context/AuthContext";
import FilterDropdown from "@/components/shared/FilterDropdown";

// Same list + option shape as OrderReview.jsx — keep these in sync
const CITIES = [
  "Cairo", "Giza", "Alexandria", "Dakahlia", "Red Sea", "Beheira", "Faiyum",
  "Gharbia", "Ismailia", "Menoufia", "Minya", "Qalyubia", "New Valley", "Suez",
  "Aswan", "Asyut", "Beni Suef", "Port Said", "Damietta", "Sharqia",
  "South Sinai", "Kafr El Sheikh", "Matrouh", "Luxor", "Qena", "North Sinai",
  "Sohag",
];
const CITY_OPTIONS = CITIES.map((c) => ({ value: c, label: c }));

const AddressesPage = () => {
  const { Token } = useContext(UserContext);

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({ city: "", description: "" });

  const fetchAddresses = async () => {
    try {
      const res = await api.get("/api/client/getAddresses");
      setAddresses(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching addresses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Token) fetchAddresses();
  }, [Token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.city || !form.description.trim()) {
      setError("Please pick a city and enter an address.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await api.post("/api/client/addAddress", {
        city: form.city,
        description: form.description.trim(),
      });
      setAddresses((prev) => [...prev, res.data]);
      setForm({ city: "", description: "" });
      setShowForm(false);
    } catch (err) {
      console.error("Error adding address:", err);
      setError("Failed to add address. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/api/client/deleteAddress/${id}`);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Error deleting address:", err);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-white border border-neutral-200 p-8 text-center text-neutral-400 text-sm tracking-wider">
        Loading addresses…
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-200 p-6 md:p-8">
      <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-6">
        <h1 className="text-xl font-light tracking-wide text-neutral-900">
          My Addresses
        </h1>
        <button
          onClick={() => {
            setShowForm((s) => !s);
            setError("");
          }}
          className="text-xs uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors"
        >
          {showForm ? "Cancel" : "Add New"}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <form
          onSubmit={handleAdd}
          className="mb-6 p-4 border border-neutral-200 bg-neutral-50 space-y-4"
        >
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
              City *
            </label>
            <FilterDropdown
              value={form.city}
              onChange={(v) => setForm((prev) => ({ ...prev, city: v }))}
              options={CITY_OPTIONS}
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
              Detailed Address
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border border-neutral-300 focus:border-neutral-900 focus:outline-none transition-colors text-sm resize-none"
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2 bg-neutral-900 text-white text-sm uppercase tracking-widest hover:bg-neutral-800 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Address"}
          </button>
        </form>
      )}

      {/* List */}
      {addresses.length === 0 ? (
        <p className="text-sm text-neutral-400 text-center py-8">
          You don't have any saved addresses yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {addresses.map((a) => (
            <li
              key={a.id}
              className="flex items-start justify-between p-4 border border-neutral-200"
            >
              <div>
                <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1">
                  {a.city || "—"}
                </p>
                <p className="text-sm text-neutral-800">
                  {a.description || "—"}
                </p>
              </div>
              <button
                onClick={() => handleDelete(a.id)}
                disabled={deletingId === a.id}
                className="text-[10px] uppercase tracking-widest text-neutral-400 hover:text-red-500 transition-colors disabled:opacity-40"
              >
                {deletingId === a.id ? "Deleting…" : "Delete"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressesPage;