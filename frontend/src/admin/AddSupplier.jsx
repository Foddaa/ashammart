import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AddSupplier = () => {
  const token = localStorage.getItem("token");
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
      toast.error("❌ جميع الحقول مطلوبة");
      return;
    }

    try {
      await axios.post(`${BASE_URL}/api/admin/supplier/add`, formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("✅ تم إضافة المورد بنجاح!");
      setFormData({ name: "", code: "", address: "" });
    } catch (error) {
      console.error("Error adding supplier:", error);

      if (error.response?.status === 401) {
        toast.error("⚠️ انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى");
        navigate("/login");
        return;
      } const apiMessage =
        error.response?.data?.message || error.response?.data || "❌ Failed to add supplier";

      toast.error(apiMessage);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4" dir="rtl">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md text-right"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">إضافة مورد جديد</h2>

        <div className="mb-4">
          <label htmlFor="name" className="block mb-1 font-medium text-gray-700">
            اسم المورد
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="code" className="block mb-1 font-medium text-gray-700">
            كود المورد
          </label>
          <input
            type="text"
            id="code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="mb-6">
          <label htmlFor="address" className="block mb-1 font-medium text-gray-700">
            عنوان المورد
          </label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors duration-200 font-semibold"
        >
          إضافة المورد
        </button>
      </form>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default AddSupplier;
