import React, { useState } from "react";
import api from "@/api/axiosInstance";           // ✅ your configured instance
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const AddCategory = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("❌ يجب إدخال اسم التصنيف");
      return;
    }

    try {
      // ✅ api.post – no manual headers or token
      await api.post("/api/admin/category/add", { name });

      toast.success("✅ تم إضافة التصنيف بنجاح!");
      setName("");
    } catch (error) {
      // The interceptor handles token refresh; if it fails, we get a 401.
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 flex items-center justify-center" dir="rtl">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 md:p-8 transition-all duration-300"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-700">➕ إضافة تصنيف جديد</h2>
          <p className="text-gray-500 mt-1">أدخل اسم التصنيف</p>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            اسم التصنيف <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition duration-200 shadow-md hover:shadow-lg text-lg"
        >
          إضافة التصنيف
        </button>
      </form>

      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default AddCategory;