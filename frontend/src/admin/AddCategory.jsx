import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AddCategory = () => {
  const token = localStorage.getItem("token");
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("❌ يجب إدخال اسم التصنيف");
      return;
    }

    try {
      await axios.post(
        `${BASE_URL}/api/admin/category/add`,
        { name },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("✅ تم إضافة التصنيف بنجاح!");
      setName("");
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("⚠️ انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى");
        navigate("/login");
        return;
      }
            const apiMessage =
              error.response?.data?.message ||
              error.response?.data ||
              "❌ فشل في إضافة التصنيف";
      
            toast.error(apiMessage);
      console.error("Error adding category:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-right"
        dir="rtl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">إضافة تصنيف جديد</h2>

        <div className="mb-4">
          <label htmlFor="name" className="block mb-1 font-medium text-gray-700">
            اسم التصنيف
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 font-semibold"
        >
          إضافة التصنيف
        </button>
      </form>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default AddCategory;
