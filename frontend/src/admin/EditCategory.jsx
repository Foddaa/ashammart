import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/admin/category/byId?id=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setName(res.data.name);
        setIsLoading(false);
      } catch (err) {
        toast.error("❌ فشل تحميل الفئة");
        console.error(err);
        setIsLoading(false);
      }
    };

    if (id) fetchCategory();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("❌ اسم الفئة لا يمكن أن يكون فارغًا");
      return;
    }

    try {
      await axios.patch(
        `${BASE_URL}/api/admin/category/${id}/update`,
        { name },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("✅ تم تحديث الفئة بنجاح!");
      setTimeout(() => navigate("/admin/categories"), 1500);
    } catch (err) {
      toast.error("❌ فشل تحديث الفئة");
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div dir="rtl" className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-xl font-semibold text-gray-600">جاري تحميل الفئة...</div>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 md:p-8 transition-all duration-300"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-700">✏️ تعديل الفئة</h2>
          <p className="text-gray-500 mt-1">قم بتحديث اسم الفئة</p>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            اسم الفئة <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
          />
        </div>

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition duration-200 shadow-md hover:shadow-lg text-lg"
          >
            حفظ التعديلات
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

export default EditCategory;