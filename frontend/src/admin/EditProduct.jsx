import React, { useEffect, useState, useRef } from "react";
import api from "@/api/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import FilterDropdown from "@/components/shared/FilterDropdown";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Small colour swatch used inside colour options (same as AddProduct)
const Swatch = ({ hex }) =>
  hex ? (
    <span
      className="inline-block w-3 h-3 border border-neutral-300 shrink-0"
      style={{ backgroundColor: hex }}
    />
  ) : null;

const colorOptionContent = (c) => (
  <span className="flex items-center gap-2">
    <Swatch hex={c.hex} />
    <span className="truncate">{c.name}</span>
  </span>
);

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

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

  // Unified image list. Each item: { id, url, colorId, isNew, file, uid }
  const [images, setImages] = useState([]);
  const [deletedImageIds, setDeletedImageIds] = useState([]);

  // Lightbox preview
  const [previewImage, setPreviewImage] = useState(null);

  const [variants, setVariants] = useState([]);

  // --- Fetch initial data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, supRes, colRes, sizeRes] = await Promise.all([
          api.get("/api/category/all").catch(() => ({ data: [] })),
          api.get("/api/supplier/all").catch(() => ({ data: [] })),
          api.get("/api/admin/colors/all").catch(() => ({ data: [] })),
          api.get("/api/admin/sizes/all").catch(() => ({ data: [] })),
        ]);
        setCategories(Array.isArray(catRes.data) ? catRes.data : []);
        setSuppliers(Array.isArray(supRes.data) ? supRes.data : []);
        setColors(Array.isArray(colRes.data) ? colRes.data : []);
        setSizes(Array.isArray(sizeRes.data) ? sizeRes.data : []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
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
          category: product.categoryId ? String(product.categoryId) : "",
          supplierCode: product.supplierCode || "",
          freeDelivery: product.freeDelivery || false,
          fastDelivery: product.fastDelivery || false,
        });

        const existingImages = (product.images || []).map((img) => ({
          id: img.id,
          url: img.url.startsWith("http") ? img.url : `${BASE_URL}/api${img.url}`,
          colorId: img.color?.id || null,
          isNew: false,
          file: null,
          uid: `existing-${img.id}`,
        }));
        setImages(existingImages);

        if (product.variants && product.variants.length > 0) {
          setVariants(
            product.variants.map((v) => ({
              id: v.id,
              colorId: v.colorId ? String(v.colorId) : "",
              sizeId: v.sizeId ? String(v.sizeId) : "",
              price: v.price !== null ? v.price : "",
              canceledPrice: v.canceledPrice !== null ? v.canceledPrice : "",
              quantity: v.quantity,
            }))
          );
        } else {
          setVariants([
            { colorId: "", sizeId: "", price: "", canceledPrice: "", quantity: 1 },
          ]);
        }
      } catch (err) {
        toast.error("Failed to load product data");
        console.error(err);
      }
    };

    fetchProduct();
  }, [id]);

  // Close lightbox with Escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setPreviewImage(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // --- Dropdown options ---
  const categoryOptions = [
    { value: "", label: "Select category" },
    ...categories.map((c) => ({ value: String(c.id), label: c.name })),
  ];

  const supplierOptions = [
    { value: "", label: "Select supplier" },
    ...suppliers.map((s) => ({ value: String(s.code), label: s.name })),
  ];

  const colorOptions = [
    { value: "", label: "None" },
    ...colors.map((c) => ({
      value: String(c.id),
      label: c.name,
      content: colorOptionContent(c),
    })),
  ];

  const sizeOptions = [
    { value: "", label: "None" },
    ...sizes.map((s) => ({ value: String(s.id), label: s.name })),
  ];

  // --- Sync images with used colors ---
  const usedColorIds = React.useMemo(() => {
    const ids = variants
      .map((v) => v.colorId)
      .filter((id) => id && id !== "");
    return new Set(ids.map((id) => Number(id)));
  }, [variants]);

  useEffect(() => {
    const toRemove = images
      .map((img, idx) =>
        img.isNew && img.colorId !== null && !usedColorIds.has(img.colorId) ? idx : -1
      )
      .filter((idx) => idx !== -1)
      .sort((a, b) => b - a);

    if (toRemove.length > 0) {
      const newImages = [...images];
      toRemove.forEach((idx) => {
        newImages.splice(idx, 1);
      });
      setImages(newImages);
      toast.info(`Removed ${toRemove.length} new image(s) because their color is no longer used.`);
    }
  }, [usedColorIds, images]);

  // --- Handlers ---
  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // For custom dropdowns, which give us the value directly
  const setField = (name) => (value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const addVariant = () => {
    setVariants([
      ...variants,
      { colorId: "", sizeId: "", price: "", canceledPrice: "", quantity: 1 },
    ]);
  };

  const removeVariant = (index) => {
    if (variants.length <= 1) {
      toast.warning("You need at least one variant");
      return;
    }
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index, field, value) => {
    const updated = [...variants];
    updated[index][field] = value;
    setVariants(updated);
  };

  const hasDuplicate = () => {
    const pairs = variants.map((v) => `${v.colorId}-${v.sizeId}`);
    return new Set(pairs).size !== pairs.length;
  };

  // Image handlers
  const MAX_FILE_SIZE = 3 * 1024 * 1024;
  const MAX_TOTAL_SIZE = 12 * 1024 * 1024;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.some((file) => file.size > MAX_FILE_SIZE)) {
      toast.error("⚠️ Each file must be smaller than 2MB.");
      fileInputRef.current.value = "";
      return;
    }
    const totalSize = images
      .filter((img) => img.isNew)
      .reduce((sum, img) => sum + img.file.size, 0);
    const newTotal = [...files].reduce((sum, f) => sum + f.size, totalSize);
    if (newTotal > MAX_TOTAL_SIZE) {
      toast.error("⚠️ Total new file size must be less than 10MB.");
      fileInputRef.current.value = "";
      return;
    }

    const newImages = files.map((file) => ({
      id: null,
      url: URL.createObjectURL(file),
      file: file,
      colorId: null,
      isNew: true,
      uid: `new-${crypto.randomUUID()}`,
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = (index) => {
    const img = images[index];
    if (!img.isNew) {
      setDeletedImageIds((prev) => [...prev, img.id]);
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const updateImageColor = (index, colorId) => {
    const updated = [...images];
    updated[index].colorId = colorId === "" ? null : Number(colorId);
    setImages(updated);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(images);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setImages(items);
  };

  // --- Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.category) {
      toast.error("Please select a category.");
      return;
    }
    if (!formData.supplierCode) {
      toast.error("Please select a supplier.");
      return;
    }
    if (variants.some((v) => !v.quantity || v.quantity < 1)) {
      toast.error("All variants must have a positive quantity.");
      return;
    }
    if (hasDuplicate()) {
      toast.error("Duplicate color+size combination is not allowed.");
      return;
    }

    const data = new FormData();

    const newImageFiles = images.filter((img) => img.isNew).map((img) => img.file);
    newImageFiles.forEach((file) => data.append("images", file));

    data.append("name", formData.name);
    data.append("code", formData.code);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("canceledPrice", formData.canceledPrice);
    data.append("categoryId", formData.category);
    data.append("supplierCode", formData.supplierCode);
    data.append("freeDelivery", formData.freeDelivery ? "true" : "false");
    data.append("fastDelivery", formData.fastDelivery ? "true" : "false");

    if (deletedImageIds.length > 0) {
      data.append("deletedImages", JSON.stringify(deletedImageIds));
    }

    const variantsPayload = variants.map((v) => ({
      id: v.id || null,
      colorId: v.colorId || null,
      sizeId: v.sizeId || null,
      price: v.price !== "" ? parseFloat(v.price) : null,
      canceledPrice: v.canceledPrice !== "" ? parseFloat(v.canceledPrice) : null,
      quantity: parseInt(v.quantity, 10),
    }));
    data.append("variants", JSON.stringify(variantsPayload));

    // Color mappings for NEW images
    const colorMappings = [];
    const map = new Map();
    images.forEach((img) => {
      if (img.isNew && img.colorId !== null) {
        const newIndex = images.filter((i) => i.isNew).indexOf(img);
        if (!map.has(img.colorId)) map.set(img.colorId, []);
        map.get(img.colorId).push(newIndex);
      }
    });
    for (const [colorId, indices] of map) {
      colorMappings.push({ colorId: Number(colorId), imageIndices: indices });
    }
    if (colorMappings.length > 0) {
      data.append("colorImages", JSON.stringify(colorMappings));
    }

    // Color updates for EXISTING images
    const existingColorUpdates = images
      .filter((img) => !img.isNew && img.id !== null)
      .map((img) => ({ imageId: img.id, colorId: img.colorId }));
    if (existingColorUpdates.length > 0) {
      data.append("imageColorUpdates", JSON.stringify(existingColorUpdates));
    }

    // Full image order (existing by ID, new by upload index)
    let newCounter = 0;
    const imageOrder = images.map((img) =>
      img.isNew ? { newIndex: newCounter++ } : { existingId: img.id }
    );
    if (imageOrder.length > 0) {
      data.append("imageOrder", JSON.stringify(imageOrder));
    }

    try {
      await api.patch(`/api/admin/product/${id}/update`, data);
      toast.success("✅ Product updated successfully!");
      setTimeout(() => navigate("/admin/products"), 1500);
    } catch (err) {
      console.error("Update error:", err);
      toast.error(
        err.response?.data?.message ||
          err.response?.data ||
          "❌ Failed to update product"
      );
    }
  };

  // Allowed colors for dropdown (used colors + "General")
  const allowedColors = colors.filter((c) => usedColorIds.has(c.id));
  const imageColorOptions = [
    { value: "", label: "General" },
    ...allowedColors.map((c) => ({
      value: String(c.id),
      label: c.name,
      content: colorOptionContent(c),
    })),
  ];

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
            <h2 className="text-xl font-light tracking-wide text-neutral-900">Edit Product</h2>
            <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-1">Update product details and images</p>
          </div>
          <div className="flex items-center gap-2 mt-3 sm:mt-0 text-neutral-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </div>
        </div>

        {/* Basic Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">Product Name <span className="text-neutral-400">*</span></label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="w-full border border-neutral-200 px-4 py-2.5 focus:outline-none focus:border-black bg-transparent text-sm" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">Product Code <span className="text-neutral-400">*</span></label>
            <input type="text" name="code" value={formData.code} required readOnly className="w-full border border-neutral-200 px-4 py-2.5 bg-neutral-100 cursor-not-allowed text-sm text-neutral-500" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">Price (EGP) <span className="text-neutral-400">*</span></label>
            <input type="number" name="price" value={formData.price} onChange={handleInputChange} required className="w-full border border-neutral-200 px-4 py-2.5 focus:outline-none focus:border-black bg-transparent text-sm" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">Old Price (EGP)</label>
            <input type="number" name="canceledPrice" value={formData.canceledPrice} onChange={handleInputChange} className="w-full border border-neutral-200 px-4 py-2.5 focus:outline-none focus:border-black bg-transparent text-sm" />
          </div>
        </div>

        {/* Category & Supplier — now using FilterDropdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mt-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">Category <span className="text-neutral-400">*</span></label>
            <FilterDropdown
              value={formData.category}
              onChange={setField("category")}
              options={categoryOptions}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">Supplier <span className="text-neutral-400">*</span></label>
            <FilterDropdown
              value={formData.supplierCode}
              onChange={setField("supplierCode")}
              options={supplierOptions}
            />
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5 mt-6">
          <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">Description <span className="text-neutral-400">*</span></label>
          <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="4" className="w-full border border-neutral-200 px-4 py-2.5 focus:outline-none focus:border-black bg-transparent text-sm resize-y" />
        </div>

        {/* Delivery Options */}
        <div className="mt-6">
          <label className="block text-[11px] uppercase tracking-wider text-neutral-400 font-medium mb-3">Delivery Options</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="relative flex items-center cursor-pointer border border-neutral-200 p-4 hover:border-neutral-900 transition-colors bg-white">
              <input type="checkbox" name="freeDelivery" checked={formData.freeDelivery} onChange={handleToggle} className="peer h-4 w-4 cursor-pointer border border-neutral-300 bg-white checked:bg-neutral-900 checked:border-neutral-900 appearance-none" />
              <svg className="absolute left-[11px] top-[19px] opacity-0 peer-checked:opacity-100 pointer-events-none w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span className="ml-3 text-sm font-light tracking-wide text-neutral-700">Free Delivery</span>
            </label>
            <label className="relative flex items-center cursor-pointer border border-neutral-200 p-4 hover:border-neutral-900 transition-colors bg-white">
              <input type="checkbox" name="fastDelivery" checked={formData.fastDelivery} onChange={handleToggle} className="peer h-4 w-4 cursor-pointer border border-neutral-300 bg-white checked:bg-neutral-900 checked:border-neutral-900 appearance-none" />
              <svg className="absolute left-[11px] top-[19px] opacity-0 peer-checked:opacity-100 pointer-events-none w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span className="ml-3 text-sm font-light tracking-wide text-neutral-700">Fast Delivery</span>
            </label>
          </div>
        </div>

        {/* Variants */}
        <div className="mt-8 border-t border-neutral-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">Product Variants</label>
            <button type="button" onClick={addVariant} className="text-xs bg-neutral-900 text-white px-4 py-1.5 hover:bg-neutral-800 transition-colors">+ Add Variant</button>
          </div>

          {variants.map((variant, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-end mb-3 p-3 border border-neutral-100 bg-neutral-50">
              <div className="sm:col-span-1">
                <label className="text-[10px] text-neutral-400 block mb-1">Color</label>
                <FilterDropdown
                  compact
                  value={variant.colorId === "" ? "" : String(variant.colorId)}
                  onChange={(v) => updateVariant(index, "colorId", v)}
                  options={colorOptions}
                />
              </div>
              <div className="sm:col-span-1">
                <label className="text-[10px] text-neutral-400 block mb-1">Size</label>
                <FilterDropdown
                  compact
                  value={variant.sizeId === "" ? "" : String(variant.sizeId)}
                  onChange={(v) => updateVariant(index, "sizeId", v)}
                  options={sizeOptions}
                />
              </div>
              <div className="sm:col-span-1">
                <label className="text-[10px] text-neutral-400 block mb-1">Price (EGP)</label>
                <input type="number" value={variant.price} onChange={(e) => updateVariant(index, "price", e.target.value)} placeholder="inherit" className="w-full border border-neutral-200 px-2 py-1.5 text-sm focus:outline-none focus:border-black" />
              </div>
              <div className="sm:col-span-1">
                <label className="text-[10px] text-neutral-400 block mb-1">Old Price</label>
                <input type="number" value={variant.canceledPrice} onChange={(e) => updateVariant(index, "canceledPrice", e.target.value)} placeholder="inherit" className="w-full border border-neutral-200 px-2 py-1.5 text-sm focus:outline-none focus:border-black" />
              </div>
              <div className="sm:col-span-1">
                <label className="text-[10px] text-neutral-400 block mb-1">Qty *</label>
                <input type="number" min="0" value={variant.quantity} onChange={(e) => updateVariant(index, "quantity", e.target.value)} required className="w-full border border-neutral-200 px-2 py-1.5 text-sm focus:outline-none focus:border-black" />
              </div>
              <div className="sm:col-span-1 flex justify-end">
                <button type="button" onClick={() => removeVariant(index)} className="text-neutral-400 hover:text-red-500 text-xl leading-none" disabled={variants.length <= 1}>×</button>
              </div>
            </div>
          ))}
        </div>

        {/* ========== IMAGES ========== */}
        <div className="flex flex-col gap-1.5 mt-6">
          <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">Product Images</label>

          {/* Upload area */}
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border border-neutral-200 cursor-pointer bg-neutral-50 hover:bg-neutral-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-6 h-6 mb-2 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <p className="text-xs text-neutral-500 tracking-wide">Drag & drop or <span className="underline cursor-pointer">browse</span></p>
                <p className="text-[10px] text-neutral-400 mt-1">Add new images (PNG, JPG, WEBP)</p>
              </div>
              <input type="file" multiple accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
            </label>
          </div>

          {/* Draggable vertical list */}
          {images.length > 0 && (
            <div className="mt-4">
              <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-3">
                Images ({images.length}) – Drag to reorder · Click to preview
              </p>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="images">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="flex flex-col gap-3">
                      {images.map((img, idx) => (
                        <Draggable key={img.uid} draggableId={img.uid} index={idx}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`flex items-center gap-4 p-3 border ${
                                snapshot.isDragging ? "border-black shadow-lg" : "border-neutral-200"
                              } bg-white rounded transition-shadow`}
                            >
                              {/* Thumbnail — click to open lightbox */}
                              <button
                                type="button"
                                onClick={() => setPreviewImage(img.url)}
                                className="w-20 h-20 flex-shrink-0 group relative overflow-hidden border border-neutral-200 hover:border-black transition-colors cursor-zoom-in"
                                title="Click to preview"
                              >
                                <img
                                  src={img.url}
                                  alt={img.isNew ? "new" : "existing"}
                                  className="w-full h-full object-cover"
                                />
                                <span className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center transition-colors">
                                  <svg
                                    className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <circle cx="11" cy="11" r="8" />
                                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                                    <line x1="11" y1="8" x2="11" y2="14" />
                                    <line x1="8" y1="11" x2="14" y2="11" />
                                  </svg>
                                </span>
                              </button>

                              {/* Controls */}
                              <div className="flex-1 flex items-center gap-3">
                                {img.isNew ? (
                                  <span className="text-[10px] uppercase tracking-wider text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded-sm border border-neutral-200">
                                    New
                                  </span>
                                ) : (
                                  <span className="text-[10px] uppercase tracking-wider text-neutral-400 px-2 py-0.5 rounded-sm border border-neutral-200">
                                    Existing
                                  </span>
                                )}
                                <div className="flex-1 min-w-0">
                                  <FilterDropdown
                                    compact
                                    value={img.colorId != null ? String(img.colorId) : ""}
                                    onChange={(v) => updateImageColor(idx, v)}
                                    options={imageColorOptions}
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeImage(idx)}
                                  className="shrink-0 bg-neutral-900 text-white w-8 h-8 flex items-center justify-center hover:bg-neutral-700 transition-colors text-sm"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button type="submit" className="flex-1 bg-neutral-900 text-white py-3.5 hover:bg-neutral-800 transition-colors duration-200 border border-neutral-900 text-sm tracking-wide">Update Product</button>
          <button type="button" onClick={() => navigate(-1)} className="flex-1 bg-transparent text-neutral-500 border border-neutral-200 py-3.5 hover:text-black hover:border-black transition-colors duration-200 text-sm tracking-wide">Cancel</button>
        </div>
      </form>

      {/* ── Lightbox ── */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 cursor-zoom-out backdrop-blur-md transition-all"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            className="absolute top-6 right-6 text-white bg-transparent border border-white/30 px-4 py-2 hover:bg-white hover:text-black transition text-sm tracking-wide"
            onClick={() => setPreviewImage(null)}
          >
            Close
          </button>
        </div>
      )}

      <ToastContainer position="top-center" autoClose={4000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="light" />
    </div>
  );
};

export default EditProduct;