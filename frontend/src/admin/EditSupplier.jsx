import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/api/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditSupplier = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const res = await api.get(`/api/admin/supplier/byId?id=${id}`);
        setName(res.data.name);
        setCode(res.data.code);
        setAddress(res.data.address);
        setIsLoading(false);
      } catch (err) {
        const backendMessage = err.response?.data || "❌ Failed to load supplier data";
        toast.error(backendMessage);
        console.error(err);
        setIsLoading(false);
      }
    };

    if (id) fetchSupplier();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !code.trim()) {
      toast.error("❌ All fields are required");
      return;
    }

    try {
      await api.patch(`/api/admin/supplier/${id}/update`, { name, code, address });
      toast.success("✅ Supplier updated successfully!");
      setTimeout(() => navigate("/admin/suppliers"), 1500);
    } catch (err) {
      const backendMessage = err.response?.data || "❌ Failed to update supplier";
      toast.error(backendMessage);
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div dir="ltr" className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="bg-white border border-neutral-200 p-10 text-center max-w-md w-full">
          <div className="text-neutral-600 text-sm tracking-wider uppercase mb-2">Loading</div>
          <div className="w-full h-px bg-neutral-200 mt-4 animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div dir="ltr" className=" bg-neutral-50 p-4 md:p-8 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-neutral-200 w-full max-w-md p-6 md:p-8 transition-all duration-300"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200 pb-6 mb-8">
          <div>
            <h2 className="text-xl font-light tracking-wide text-neutral-900">
              Edit Supplier
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-1">
              Update supplier information
            </p>
          </div>
          <div className="flex items-center gap-2 mt-3 sm:mt-0 text-neutral-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          </div>
        </div>

        {/* Name */}
        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
            Supplier Name <span className="text-neutral-400">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-neutral-200 px-4 py-2.5 focus:outline-none focus:border-black bg-transparent text-sm placeholder:text-neutral-400"
          />
        </div>

        {/* Code */}
        <div className="flex flex-col gap-1.5 mb-4">
          <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
            Supplier Code <span className="text-neutral-400">*</span>
          </label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="w-full border border-neutral-200 px-4 py-2.5 focus:outline-none focus:border-black bg-transparent text-sm placeholder:text-neutral-400"
          />
        </div>

        {/* Address */}
        <div className="flex flex-col gap-1.5 mb-6">
          <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
            Supplier Address <span className="text-neutral-400">*</span>
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="w-full border border-neutral-200 px-4 py-2.5 focus:outline-none focus:border-black bg-transparent text-sm placeholder:text-neutral-400"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button
            type="submit"
            className="flex-1 bg-neutral-900 text-white py-3.5 hover:bg-neutral-800 transition-colors duration-200 border border-neutral-900 text-sm tracking-wide"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 bg-transparent text-neutral-500 border border-neutral-200 py-3.5 hover:text-black hover:border-black transition-colors duration-200 text-sm tracking-wide"
          >
            Cancel
          </button>
        </div>
      </form>

      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default EditSupplier;