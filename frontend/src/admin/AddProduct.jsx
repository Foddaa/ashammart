import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AddProduct = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/category/all`);
        const categoriesData = Array.isArray(response.data)
          ? response.data
          : [];
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/supplier/all`);
        const suppliersData = Array.isArray(response.data)
          ? response.data
          : [];
        setSuppliers(suppliersData);
      } catch (err) {
        console.error("Error fetching suppliers:", err);
      }
    };
    fetchSuppliers();
  }, []);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const MAX_FILE_SIZE = 3 * 1024 * 1024;
  const MAX_TOTAL_SIZE = 12 * 1024 * 1024;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.some((file) => file.size > MAX_FILE_SIZE)) {
      toast.error("⚠️ كل ملف يجب أن يكون أصغر من 2 ميجا.");
      fileInputRef.current.value = "";
      return;
    }

    const totalSize =
      [...images, ...files].reduce((sum, file) => sum + file.size, 0);

    if (totalSize > MAX_TOTAL_SIZE) {
      toast.error("⚠️ إجمالي حجم الملفات يجب أن يكون أقل من 10 ميجا.");
      fileInputRef.current.value = "";
      return;
    }

    setImages((prev) => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
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
      console.error(error);

      if (error.response?.status === 401) {
        toast.error("⚠️ انتهت صلاحية الجلسة");
        navigate("/login");
        return;
      }

      toast.error(
        error.response?.data?.message ||
          error.response?.data ||
          "❌ فشل اضافة المنتج"
      );
    }
  };

  // ------------------------------------------------------------
  // UI only – no logic changed
  // ------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 flex items-center justify-center" dir="rtl">
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 md:p-8 transition-all duration-300"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-700">➕ إضافة منتج جديد</h2>
          <p className="text-gray-500 mt-1">أدخل بيانات المنتج والصورة</p>
        </div>

        {/* Two‑column grid for basic fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[
            { name: "name", label: "اسم المنتج", type: "text", placeholder: "مثل: كرسي مكتبي" },
            { name: "code", label: "كود المنتج", type: "text", placeholder: "مثل: PROD-001" },
          ].map(({ name, label, type, placeholder }) => (
            <div key={name} className="mb-2">
              <label className="block text-gray-700 font-semibold mb-2">
                {label} <span className="text-red-500">*</span>
              </label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                required
                placeholder={placeholder}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              />
            </div>
          ))}

          {[
            { name: "price", label: "السعر (ج.م)", type: "number", placeholder: "0.00" },
            { name: "canceledPrice", label: "السعر قبل الخصم (ج.م)", type: "number", placeholder: "0.00" },
          ].map(({ name, label, type, placeholder }) => (
            <div key={name} className="mb-2">
              <label className="block text-gray-700 font-semibold mb-2">
                {label} {name === "price" && <span className="text-red-500">*</span>}
              </label>
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                required={name === "price"}
                placeholder={placeholder}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              />
            </div>
          ))}
        </div>

        {/* Category & Supplier – also two columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-3">
          <div className="mb-2">
            <label className="block text-gray-700 font-semibold mb-2">
              الفئة <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 bg-white"
            >
              <option value="">اختر الفئة</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-2">
            <label className="block text-gray-700 font-semibold mb-2">
              المورد <span className="text-red-500">*</span>
            </label>
            <select
              name="supplierCode"
              value={formData.supplierCode}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 bg-white"
            >
              <option value="">اختر المورد</option>
              {suppliers.map((sup) => (
                <option key={sup.id} value={sup.code}>
                  {sup.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="mb-5 mt-2">
          <label className="block text-gray-700 font-semibold mb-2">
            وصف المنتج <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows="4"
            placeholder="اكتب وصفاً مفصلاً للمنتج..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 resize-y"
          />
        </div>

        {/* Images section */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            صور المنتج <span className="text-red-500">*</span>
          </label>

          {/* Custom file input */}
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">انقر للرفع</span> أو اسحب الصور</p>
                <p className="text-xs text-gray-500">PNG, JPG, WEBP (حد أقصى 2 ميجا لكل صورة)</p>
              </div>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
              />
            </label>
          </div>

          {/* Image preview grid */}
          {images.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">
                الصور المختارة ({images.length} / الحد الأقصى للإجمالي 10 ميجا)
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {images.map((file, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview-${idx}`}
                      className="w-full h-28 object-cover rounded-lg border shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700 transition shadow-md"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition duration-200 shadow-md hover:shadow-lg text-lg"
        >
          إضافة المنتج
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

export default AddProduct;