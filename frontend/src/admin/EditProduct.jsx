import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef();

  // New state for categories and suppliers
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

  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);

  // Fetch categories (same as AddProduct)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/category/all`);
        const categoriesData = Array.isArray(response.data) ? response.data : [];
        setCategories(categoriesData);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch suppliers (same as AddProduct)
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/supplier/all`);
        const suppliersData = Array.isArray(response.data) ? response.data : [];
        setSuppliers(suppliersData);
      } catch (err) {
        console.error("Error fetching suppliers:", err);
      }
    };
    fetchSuppliers();
  }, []);

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/product/byId?id=${id}`);
        const product = res.data;

        setFormData({
          name: product.name || "",
          code: product.code || "",
          description: product.description || "",
          price: product.price || "",
          canceledPrice: product.canceledPrice || "",
          category: product.categoryId || "",      // categoryId is a number
          supplierCode: product.supplierCode || "", // string code
        });

        const fixedImages = (product.images || []).map((img) => ({
          ...img,
          url: img.url.startsWith("http")
            ? img.url
            : `${BASE_URL}/api${img.url}`,
        }));

        setExistingImages(fixedImages);
      } catch (err) {
        toast.error("فشل تحميل بيانات المنتج");
        console.error(err);
      }
    };

    fetchProduct();
  }, [id]);

  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const filesArray = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...filesArray]);
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    const imageToRemove = existingImages[index];
    setDeletedImages((prev) => [...prev, imageToRemove]);
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    newImages.forEach((image) => {
      data.append("images", image);
    });

    data.append("name", formData.name);
    data.append("code", formData.code);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("canceledPrice", formData.canceledPrice);
    data.append("categoryId", formData.category);
    data.append("supplierCode", formData.supplierCode);

    if (deletedImages.length > 0) {
      data.append(
        "deletedImages",
        JSON.stringify(deletedImages.map((img) => img.id))
      );
    }

    try {
      await axios.patch(`${BASE_URL}/api/admin/product/${id}/update`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      toast.success("✅ تم تحديث المنتج بنجاح!");
      setTimeout(() => navigate("/admin/products"), 1500);
    } catch (err) {
      toast.error("❌ فشل تحديث المنتج");
      console.error("Update error:", err);
    }
  };

  // ------------------------------------------------------------
  // UI – same as AddProduct but with dropdowns for category/supplier
  // ------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 flex items-center justify-center" dir="rtl">
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 md:p-8 transition-all duration-300"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-700">✏️ تعديل المنتج</h2>
          <p className="text-gray-500 mt-1">قم بتحديث بيانات المنتج والصور</p>
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
                readOnly={name === "code"} // code remains readOnly
                className={`w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition ${
                  name === "code" ? "bg-gray-100 cursor-not-allowed" : ""
                }`}
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

        {/* Category & Supplier – now dropdowns (same as AddProduct) */}
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

        {/* Images section – existing + new */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            صور المنتج
          </label>

          {/* Custom file input for new images */}
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">انقر للرفع</span> أو اسحب الصور</p>
                <p className="text-xs text-gray-500">أضف صوراً جديدة (PNG, JPG, WEBP)</p>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                ref={fileInputRef}
                className="hidden"
              />
            </label>
          </div>

          {/* Existing images grid */}
          {existingImages.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">الصور الحالية</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {existingImages.map((img, index) => (
                  <div key={img.id} className="relative group">
                    <img
                      src={img.url}
                      alt={`existing-${index}`}
                      className="w-full h-28 object-cover rounded-lg border shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700 transition shadow-md"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New images preview grid */}
          {newImages.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">الصور الجديدة</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {newImages.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`new-${index}`}
                      className="w-full h-28 object-cover rounded-lg border shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
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

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition duration-200 shadow-md hover:shadow-lg text-lg"
          >
            تحديث المنتج
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

export default EditProduct;