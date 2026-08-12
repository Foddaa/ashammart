import React, { useState } from "react";
import api from "@/api/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const AddSupplier = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, code, address } = formData;
    if (!name || !code || !address) {
      toast.error("❌ All fields are required");
      return;
    }

    try {
      await api.post("/api/admin/supplier/add", formData);

      toast.success("✅ Supplier added successfully!");
      setFormData({ name: "", code: "", address: "" });
    } catch (error) {
      console.error("Error adding supplier:", error);

      if (error.response?.status === 401) {
        toast.error("⚠️ Session expired, please log in again");
        navigate("/login");
        return;
      }
      const apiMessage =
        error.response?.data?.message || error.response?.data || "❌ Failed to add supplier";

      toast.error(apiMessage);
    }
  };

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
              Add New Supplier
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-1">
              Enter supplier details
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
            name="name"
            value={formData.name}
            onChange={handleChange}
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
            name="code"
            value={formData.code}
            onChange={handleChange}
            required
            className="w-full border border-neutral-200 px-4 py-2.5 focus:outline-none focus:border-black bg-transparent text-sm placeholder:text-neutral-400"
          />
        </div>

        {/* Address */}
        <div className="flex flex-col gap-1.5 mb-6">
          <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
            Supplier Address <span className="text-neutral-400">*</span>
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
            required
            className="w-full border border-neutral-200 px-4 py-2.5 focus:outline-none focus:border-black bg-transparent text-sm placeholder:text-neutral-400 resize-y"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-neutral-900 text-white py-3.5 hover:bg-neutral-800 transition-colors duration-200 border border-neutral-900 text-sm tracking-wide"
        >
          Add Supplier
        </button>
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

export default AddSupplier;