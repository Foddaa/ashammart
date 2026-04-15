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
          value: Number(value),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
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
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 flex items-center justify-center"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 md:p-8 transition-all duration-300"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-700">💰 تعديل أسعار المنتجات</h2>
        </div>

        {/* Type Selection */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            نوع التعديل
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white transition"
          >
            <option value="PERCENTAGE">نسبة مئوية (%)</option>
            <option value="FIXED">قيمة ثابتة</option>
          </select>
        </div>

        {/* Value */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            القيمة (يمكن أن تكون سالبة)
          </label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="مثال: 10 أو -20"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          />
        </div>

        {/* Warning */}
        <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded-xl">
          ⚠️ هذا الإجراء سيؤثر على جميع المنتجات ولا يمكن التراجع عنه
        </div>

        {/* Confirmation */}
        <div className="mb-6 flex items-center gap-2">
          <input
            type="checkbox"
            id="confirmCheckbox"
            checked={confirm}
            onChange={(e) => setConfirm(e.target.checked)}
            className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="confirmCheckbox" className="text-gray-700 font-medium">
            أؤكد أنني أريد تنفيذ هذا التعديل
          </label>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition duration-200 shadow-md hover:shadow-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "جاري التنفيذ..." : "تنفيذ التعديل"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-xl transition duration-200 shadow-md hover:shadow-lg text-lg"
          >
            إلغاء
          </button>
        </div>
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

export default UpdatePrices;