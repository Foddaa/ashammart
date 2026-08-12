import React, { useState, useRef, useEffect } from "react";
import api from "@/api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddProduct = () => {
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
    freeDelivery: false,
    fastDelivery: false,
  });

  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/category/all");
        const categoriesData = Array.isArray(response.data) ? response.data : [];
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
        const response = await api.get("/api/supplier/all");
        const suppliersData = Array.isArray(response.data) ? response.data : [];
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

  const handleToggle = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const MAX_FILE_SIZE = 3 * 1024 * 1024;
  const MAX_TOTAL_SIZE = 12 * 1024 * 1024;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.some((file) => file.size > MAX_FILE_SIZE)) {
      toast.error("⚠️ Each file must be smaller than 2MB.");
      fileInputRef.current.value = "";
      return;
    }

    const totalSize = [...images, ...files].reduce((sum, file) => sum + file.size, 0);

    if (totalSize > MAX_TOTAL_SIZE) {
      toast.error("⚠️ Total file size must be less than 10MB.");
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
      if (typeof formData[key] === "boolean") {
        data.append(key, formData[key] ? "true" : "false");
      } else {
        data.append(key, formData[key]);
      }
    }

    try {
      await api.post("/api/admin/product/add", data);

      toast.success("✅ Product added successfully!");

      setFormData({
        name: "",
        code: "",
        description: "",
        price: "",
        canceledPrice: "",
        category: "",
        supplierCode: "",
        freeDelivery: false,
        fastDelivery: false,
      });

      setImages([]);
      fileInputRef.current.value = "";
    } catch (error) {
      console.error(error);

      if (error.response?.status === 401) {
        toast.error("⚠️ Session expired");
        navigate("/login");
        return;
      }

      toast.error(
        error.response?.data?.message ||
          error.response?.data ||
          "❌ Failed to add product"
      );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-8 flex items-center justify-center" dir="ltr">
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="bg-white border border-neutral-200 w-full max-w-4xl p-6 md:p-10 transition-all duration-300"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200 pb-6 mb-8">
          <div>
            <h2 className="text-xl font-light tracking-wide text-neutral-900">
              Add New Product
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-1">
              Enter product details and images
            </p>
          </div>
          <div className="flex items-center gap-2 mt-3 sm:mt-0 text-neutral-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
        </div>

        {/* Basic Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
              Product Name <span className="text-neutral-400">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              placeholder="e.g. Office Chair"
              className="w-full border border-neutral-200 px-4 py-2.5 focus:outline-none focus:border-black bg-transparent text-sm placeholder:text-neutral-400"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
              Product Code <span className="text-neutral-400">*</span>
            </label>
            <input
              type="text"
              name="code"
              value={formData.code}
              onChange={handleInputChange}
              required
              placeholder="e.g. PROD-001"
              className="w-full border border-neutral-200 px-4 py-2.5 focus:outline-none focus:border-black bg-transparent text-sm placeholder:text-neutral-400"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
              Price (EGP) <span className="text-neutral-400">*</span>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              placeholder="0.00"
              className="w-full border border-neutral-200 px-4 py-2.5 focus:outline-none focus:border-black bg-transparent text-sm placeholder:text-neutral-400"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
              Old Price (EGP)
            </label>
            <input
              type="number"
              name="canceledPrice"
              value={formData.canceledPrice}
              onChange={handleInputChange}
              placeholder="0.00"
              className="w-full border border-neutral-200 px-4 py-2.5 focus:outline-none focus:border-black bg-transparent text-sm placeholder:text-neutral-400"
            />
          </div>
        </div>

        {/* Category & Supplier Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mt-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
              Category <span className="text-neutral-400">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              required
              className="w-full border border-neutral-200 px-4 py-2.5 focus:outline-none focus:border-black bg-white text-sm"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
              Supplier <span className="text-neutral-400">*</span>
            </label>
            <select
              name="supplierCode"
              value={formData.supplierCode}
              onChange={handleInputChange}
              required
              className="w-full border border-neutral-200 px-4 py-2.5 focus:outline-none focus:border-black bg-white text-sm"
            >
              <option value="">Select supplier</option>
              {suppliers.map((sup) => (
                <option key={sup.id} value={sup.code}>
                  {sup.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5 mt-6">
          <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
            Description <span className="text-neutral-400">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows="4"
            placeholder="Provide a detailed description..."
            className="w-full border border-neutral-200 px-4 py-2.5 focus:outline-none focus:border-black bg-transparent text-sm placeholder:text-neutral-400 resize-y"
          />
        </div>

        {/* Delivery Options - Minimal Checkboxes */}
        <div className="mt-6">
          <label className="block text-[11px] uppercase tracking-wider text-neutral-400 font-medium mb-3">
            Delivery Options
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Free Delivery Checkbox */}
            <label className="relative flex items-center cursor-pointer border border-neutral-200 p-4 hover:border-neutral-900 transition-colors bg-white">
              <input
                type="checkbox"
                name="freeDelivery"
                checked={formData.freeDelivery}
                onChange={handleToggle}
                className="peer h-4 w-4 cursor-pointer border border-neutral-300 bg-white checked:bg-neutral-900 checked:border-neutral-900 appearance-none"
              />
              <svg 
                className="absolute left-[11px] top-[19px] opacity-0 peer-checked:opacity-100 pointer-events-none w-3 h-3 text-white" 
                fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span className="ml-3 text-sm font-light tracking-wide text-neutral-700">
                Free Delivery
              </span>
            </label>

            {/* Fast Delivery Checkbox */}
            <label className="relative flex items-center cursor-pointer border border-neutral-200 p-4 hover:border-neutral-900 transition-colors bg-white">
              <input
                type="checkbox"
                name="fastDelivery"
                checked={formData.fastDelivery}
                onChange={handleToggle}
                className="peer h-4 w-4 cursor-pointer border border-neutral-300 bg-white checked:bg-neutral-900 checked:border-neutral-900 appearance-none"
              />
              <svg 
                className="absolute left-[11px] top-[19px] opacity-0 peer-checked:opacity-100 pointer-events-none w-3 h-3 text-white" 
                fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span className="ml-3 text-sm font-light tracking-wide text-neutral-700">
                Fast Delivery
              </span>
            </label>

          </div>
        </div>

        {/* Images section */}
        <div className="flex flex-col gap-1.5 mt-6">
          <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
            Product Images <span className="text-neutral-400">*</span>
          </label>

          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border border-neutral-200 cursor-pointer bg-neutral-50 hover:bg-neutral-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-6 h-6 mb-2 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <p className="text-xs text-neutral-500 tracking-wide">
                  Drag & drop or <span className="underline cursor-pointer">browse</span>
                </p>
                <p className="text-[10px] text-neutral-400 mt-1">PNG, JPG, WEBP (Max 2MB per file)</p>
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

          {images.length > 0 && (
            <div className="mt-4">
              <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-3">
                Selected images ({images.length})
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {images.map((file, idx) => (
                  <div key={idx} className="relative group border border-neutral-200 bg-neutral-50">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview-${idx}`}
                      className="w-full h-24 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute -top-1 -right-1 bg-neutral-900 text-white w-5 h-5 flex items-center justify-center hover:bg-neutral-700 transition-colors text-[10px]"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-neutral-900 text-white py-3.5 mt-8 hover:bg-neutral-800 transition-colors duration-200 border border-neutral-900 text-sm tracking-wide"
        >
          Add Product
        </button>
      </form>

      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default AddProduct;