import React, { useState } from "react";
import api from "@/api/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("❌ Category name cannot be empty");
      return;
    }

    try {
      await api.post("/api/admin/category/add", { name });

      toast.success("✅ Category added successfully!");
      setName("");
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("⚠️ Session expired, please log in again");
        navigate("/login");
        return;
      }
      const apiMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "❌ Failed to add category";

      toast.error(apiMessage);
      console.error("Error adding category:", error);
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
              Add New Category
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-1">
              Enter a category name
            </p>
          </div>
          <div className="flex items-center gap-2 mt-3 sm:mt-0 text-neutral-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
        </div>

        {/* Form Input */}
        <div className="flex flex-col gap-1.5 mb-6">
          <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
            Category Name <span className="text-neutral-400">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full border border-neutral-200 px-4 py-2.5 focus:outline-none focus:border-black bg-transparent text-sm placeholder:text-neutral-400"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-neutral-900 text-white py-3.5 hover:bg-neutral-800 transition-colors duration-200 border border-neutral-900 text-sm tracking-wide"
        >
          Add Category
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

export default AddCategory;