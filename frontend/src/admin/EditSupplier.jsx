// src/pages/admin/EditSupplier.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditSupplier = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
  const fetchSupplier = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/admin/supplier/byId?id=${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setName(res.data.name);
      setCode(res.data.code);
      setAddress(res.data.address);
      setIsLoading(false);
    } catch (err) {
      const backendMessage =
        err.response?.data || "❌ فشل تحميل بيانات المورد";
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
    toast.error("❌ جميع الحقول مطلوبة");
    return;
  }

  try {
    await axios.patch(
      `${BASE_URL}/api/admin/supplier/${id}/update`,
      { name, code, address },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    toast.success("✅ تم تحديث بيانات المورد بنجاح");
    setTimeout(() => navigate("/admin/suppliers"), 1500);
  } catch (err) {
    const backendMessage =
      err.response?.data || "❌ فشل تحديث بيانات المورد";
    toast.error(backendMessage);
    console.error(err);
  }
};


  if (isLoading) {
    return (
      <div dir="rtl" className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-600">
          جاري تحميل بيانات المورد...
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">تعديل بيانات المورد</h2>

        <div className="mb-4">
          <label htmlFor="name" className="block mb-1 font-medium text-gray-700">
            اسم المورد
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="code" className="block mb-1 font-medium text-gray-700">
            كود المورد
          </label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="address" className="block mb-1 font-medium text-gray-700">
            عنوان المورد
          </label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex justify-between gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 font-semibold"
          >
            حفظ التعديلات
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 bg-gray-300 text-gray-800 py-2 rounded-md hover:bg-gray-400 transition-colors duration-200 font-semibold"
          >
            إلغاء
          </button>
        </div>
      </form>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
};

export default EditSupplier;
