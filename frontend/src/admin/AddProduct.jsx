import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AddProduct = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    price: "",
    canceledPrice: "",
    category: "",
    supplierCode: "",
  });

  const [images, setImages] = useState([]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ✅ Pre-validation constants
  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 2MB
  const MAX_TOTAL_SIZE = 12 * 1024 * 1024; // 10MB

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // Check if any single file exceeds the limit
    if (files.some((file) => file.size > MAX_FILE_SIZE)) {
      toast.error("⚠️ كل ملف يجب أن يكون أصغر من 2 ميجا.");
      fileInputRef.current.value = ""; // reset input
      return;
    }

    // Check total size with already selected + new files
    const totalSize =
      [...images, ...files].reduce((sum, file) => sum + file.size, 0);

    if (totalSize > MAX_TOTAL_SIZE) {
      toast.error("⚠️ إجمالي حجم الملفات يجب أن يكون أقل من 10 ميجا.");
      fileInputRef.current.value = ""; // reset input
      return;
    }

    // ✅ Safe to add
    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (indexToRemove) => {
    setImages((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    images.forEach((image) => {
      data.append("images", image);
    });
    if (images.length === 0) {
      data.append("images", "");
    }

    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      await axios.post(`${BASE_URL}/api/admin/product/add`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("✅ تم إضافة المنتج بنجاح!");

      setFormData({
        name: "",
        code: "",
        description: "",
        price: "",
        canceledPrice: "",
        category: "",
        supplierCode: "",
      });
      setImages([]);
      fileInputRef.current.value = "";
    } catch (error) {
      console.error("Error adding supplier:", error);
      if (error.response?.status === 401) {
        toast.error("⚠️ انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى");
        navigate("/login");
        return;
      }
      const apiMessage =
        error.response?.data?.message ||
        error.response?.data ||
        "❌ فشل اضافة المنتج";

      toast.error(apiMessage);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-100 p-4"
      dir="rtl"
    >
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          إضافة منتج جديد
        </h2>

        {[
          { name: "name", label: "اسم المنتج", type: "text" },
          { name: "code", label: "كود المنتج", type: "text" },
          { name: "price", label: "السعر", type: "number" },
          { name: "canceledPrice", label: "السعر قبل الخصم", type: "number" },
          { name: "category", label: "رقم الفئة", type: "text" },
          { name: "supplierCode", label: "كود المورد", type: "text" },
        ].map(({ name, label, type }) => (
          <div key={name} className="mb-4">
            <label
              htmlFor={name}
              className="block mb-1 font-medium text-gray-700"
            >
              {label}
            </label>
            <input
              type={type}
              name={name}
              id={name}
              value={formData[name]}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border rounded-md shadow-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        ))}

        <div className="mb-4">
          <label
            htmlFor="description"
            className="block mb-1 font-medium text-gray-700"
          >
            الوصف
          </label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded-md shadow-sm resize-y text-right focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows="4"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="images"
            className="block mb-2 font-medium text-gray-700"
          >
            رفع الصور
          </label>
          <input
            type="file"
            name="images"
            id="images"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="w-full border border-dashed border-gray-400 rounded-md p-2 text-gray-600 bg-gray-50"
          />

          {images.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mt-4">
              {images.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${index}`}
                    className="w-full h-24 object-cover rounded-lg shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 left-1 bg-red-600 text-white text-xs px-2 py-1 rounded-full hover:bg-red-700 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 font-semibold"
        >
          إضافة المنتج
        </button>
      </form>

      <ToastContainer position="top-center" autoClose={3000} rtl />
    </div>
  );
};

export default AddProduct;
