// src/pages/admin/UpdatePrices.jsx
import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UpdatePrices = () => {
  const [type, setType] = useState("PERCENTAGE");
  const [value, setValue] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!value || isNaN(value)) {
      toast.error("❌ أدخل قيمة صحيحة");
      return;
    }

    if (Number(value) === 0) {
      toast.error("❌ لا يمكن أن تكون القيمة صفر");
      return;
    }

    if (!confirm) {
      toast.error("⚠️ يجب تأكيد العملية");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.put(
        `${BASE_URL}/api/admin/products/updatePrices`,
        {
          updatePricesType: type,
          value: Number(value)
            },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      toast.success(`✅ ${res.data}`);

      setTimeout(() => navigate("/admin"), 1500);

    } catch (err) {
      console.error(err);
      toast.error("❌ فشل تحديث الأسعار");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          تعديل أسعار المنتجات
        </h2>

        {/* Type Selection */}
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">
            نوع التعديل
          </label>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="PERCENTAGE">نسبة مئوية (%)</option>
            <option value="FIXED">قيمة ثابتة</option>
          </select>
        </div>

        {/* Value */}
        <div className="mb-4">
          <label className="block mb-2 font-medium text-gray-700">
            القيمة (ممكن تكون سالبة)
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="مثال: 10 أو -20"
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        {/* Warning */}
        <div className="mb-4 text-sm text-red-600 bg-red-100 p-3 rounded-md">
          هذا الإجراء سيؤثر على جميع المنتجات ولا يمكن التراجع عنه ⚠️
        </div>

        {/* Confirmation */}
        <div className="mb-4 flex items-center gap-2">
          <input
            type="checkbox"
            checked={confirm}
            onChange={(e) => setConfirm(e.target.checked)}
          />
          <label className="text-gray-700">
            أؤكد أنني أريد تنفيذ هذا التعديل
          </label>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            {loading ? "جاري التنفيذ..." : "تنفيذ التعديل"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 bg-gray-300 py-2 rounded-md"
          >
            إلغاء
          </button>
        </div>
      </form>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default UpdatePrices;