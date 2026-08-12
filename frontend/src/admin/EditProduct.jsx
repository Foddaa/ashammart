import React, { useEffect, useState, useRef } from "react";
import api from "@/api/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const EditProduct = () => {
  const { id } = useParams();
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

  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [deletedImages, setDeletedImages] = useState([]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/api/category/all");
        setCategories(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();
  }, []);

  // Fetch suppliers
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await api.get("/api/supplier/all");
        setSuppliers(Array.isArray(response.data) ? response.data : []);
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
        const res = await api.get(`/api/product/byId?id=${id}`);
        const product = res.data;

        setFormData({
          name: product.name || "",
          code: product.code || "",
          description: product.description || "",
          price: product.price || "",
          canceledPrice: product.canceledPrice || "",
          category: product.categoryId || "",
          supplierCode: product.supplierCode || "",
          freeDelivery: product.freeDelivery || false,
          fastDelivery: product.fastDelivery || false,
        });

        const fixedImages = (product.images || []).map((img) => ({
          ...img,
          url: img.url.startsWith("http")
            ? img.url
            : `${import.meta.env.VITE_API_BASE_URL}/api${img.url}`,
        }));

        setExistingImages(fixedImages);
      } catch (err) {
        toast.error("Failed to load product data");
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

  const handleToggle = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
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

    newImages.forEach((image) => data.append("images", image));
    data.append("name", formData.name);
    data.append("code", formData.code);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("canceledPrice", formData.canceledPrice);
    data.append("categoryId", formData.category);
    data.append("supplierCode", formData.supplierCode);
    data.append("freeDelivery", formData.freeDelivery ? "true" : "false");
    data.append("fastDelivery", formData.fastDelivery ? "true" : "false");

    if (deletedImages.length > 0) {
      data.append(
        "deletedImages",
        JSON.stringify(deletedImages.map((img) => img.id))
      );
    }

    try {
      await api.patch(`/api/admin/product/${id}/update`, data);

      toast.success("✅ Product updated successfully!");
      setTimeout(() => navigate("/admin/products"), 1500);
    } catch (err) {
      toast.error("❌ Failed to update product");
      console.error("Update error:", err);
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
              Edit Product
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-1">
              Update product details and images
            </p>
          </div>
          <div className="flex items-center gap-2 mt-3 sm:mt-0 text-neutral-400">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
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
              required
              readOnly
              className="w-full border border-neutral-200 px-4 py-2.5 bg-neutral-100 cursor-not-allowed text-sm text-neutral-500"
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
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
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
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
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
            Product Images
          </label>

          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border border-neutral-200 cursor-pointer bg-neutral-50 hover:bg-neutral-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-6 h-6 mb-2 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <p className="text-xs text-neutral-500 tracking-wide">
                  Drag & drop or <span className="underline cursor-pointer">browse</span>
                </p>
                <p className="text-[10px] text-neutral-400 mt-1">
                  Add new images (PNG, JPG, WEBP)
                </p>
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
              <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-3">
                Current Images
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {existingImages.map((img, index) => (
                  <div key={img.id} className="relative group border border-neutral-200 bg-neutral-50">
                    <img
                      src={img.url}
                      alt={`existing-${index}`}
                      className="w-full h-24 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute -top-1 -right-1 bg-neutral-900 text-white w-5 h-5 flex items-center justify-center hover:bg-neutral-700 transition-colors text-[10px]"
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
              <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-3">
                New Images
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {newImages.map((file, index) => (
                  <div key={index} className="relative group border border-neutral-200 bg-neutral-50">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`new-${index}`}
                      className="w-full h-24 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
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

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            type="submit"
            className="flex-1 bg-neutral-900 text-white py-3.5 hover:bg-neutral-800 transition-colors duration-200 border border-neutral-900 text-sm tracking-wide"
          >
            Update Product
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex-1 bg-transparent text-neutral-500 border border-neutral-200 py-3.5 hover:text-black hover:border-black transition-colors duration-200 text-sm tracking-wide"
          >
            Cancel
          </button>
        </div>
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

export default EditProduct;