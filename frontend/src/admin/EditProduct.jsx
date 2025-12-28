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
          category: product.categoryId || "",
          supplierCode: product.supplierCode || "",
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4" dir="rtl">
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">تعديل المنتج</h2>

        <div className="mb-4">
          <label htmlFor="name" className="block mb-1 font-medium text-gray-700">
            اسم المنتج
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="code" className="block mb-1 font-medium text-gray-700">
            كود المنتج
          </label>
          <input
            type="text"
            name="code"
            id="code"
            value={formData.code}
            readOnly
            className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-600 cursor-not-allowed shadow-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="price" className="block mb-1 font-medium text-gray-700">
            السعر
          </label>
          <input
            type="number"
            name="price"
            id="price"
            value={formData.price}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="canceledPrice" className="block mb-1 font-medium text-gray-700">
            السعر قبل الخصم
          </label>
          <input
            type="number"
            name="canceledPrice"
            id="canceledPrice"
            value={formData.canceledPrice}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="block mb-1 font-medium text-gray-700">
            رقم الفئة
          </label>
          <input
            type="text"
            name="category"
            id="category"
            value={formData.category}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="supplierCode" className="block mb-1 font-medium text-gray-700">
            كود المورد
          </label>
          <input
            type="text"
            name="supplierCode"
            id="supplierCode"
            value={formData.supplierCode}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block mb-1 font-medium text-gray-700">
            الوصف
          </label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border rounded-md shadow-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows="4"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="images" className="block mb-2 font-medium text-gray-700">
            رفع صور جديدة
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
        </div>

        {existingImages.length > 0 && (
          <div className="mb-6">
            <p className="font-medium text-gray-700 mb-2">الصور الحالية</p>
            <div className="grid grid-cols-3 gap-4">
              {existingImages.map((img, index) => (
                <div key={img.id} className="relative group">
                  <img
                    src={img.url}
                    alt={`existing-${index}`}
                    className="w-full h-24 object-cover rounded-lg shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingImage(index)}
                    className="absolute top-1 left-1 bg-red-600 text-white text-xs px-2 py-1 rounded-full hover:bg-red-700 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {newImages.length > 0 && (
          <div className="mb-6">
            <p className="font-medium text-gray-700 mb-2">الصور الجديدة</p>
            <div className="grid grid-cols-3 gap-4">
              {newImages.map((file, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`new-${index}`}
                    className="w-full h-24 object-cover rounded-lg shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute top-1 left-1 bg-red-600 text-white text-xs px-2 py-1 rounded-full hover:bg-red-700 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 font-semibold"
          >
            تحديث المنتج
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

      <ToastContainer position="top-center" autoClose={3000} rtl />
    </div>
  );
};

export default EditProduct;
