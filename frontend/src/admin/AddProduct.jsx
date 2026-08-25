import React, { useState, useRef, useEffect } from "react";
import api from "@/api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const AddProduct = () => {
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

  const [images, setImages] = useState([]);
  const [imageColors, setImageColors] = useState([]);

  const [variants, setVariants] = useState([
    { colorId: "", sizeId: "", price: "", canceledPrice: "", quantity: 1 },
  ]);

  // --- Fetch initial data ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await api.get("/api/category/all").catch(() => ({ data: [] }));
        const supRes = await api.get("/api/supplier/all").catch(() => ({ data: [] }));
        const colRes = await api.get("/api/admin/colors/all").catch(() => ({ data: [] }));
        const sizeRes = await api.get("/api/admin/sizes/all").catch(() => ({ data: [] }));

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

  // --- Sync images with used colors ---
  const usedColorIds = React.useMemo(() => {
    const ids = variants
      .map((v) => v.colorId)
      .filter((id) => id && id !== "");
    return new Set(ids.map((id) => Number(id)));
  }, [variants]);

  // Remove images whose assigned color is no longer used (or keep them if null)
  useEffect(() => {
    const toRemove = imageColors
      .map((colorId, idx) => (colorId !== null && !usedColorIds.has(colorId) ? idx : -1))
      .filter((idx) => idx !== -1)
      .sort((a, b) => b - a); // remove from end to avoid index shift

    if (toRemove.length > 0) {
      const newImages = [...images];
      const newColors = [...imageColors];
      toRemove.forEach((idx) => {
        newImages.splice(idx, 1);
        newColors.splice(idx, 1);
      });
      setImages(newImages);
      setImageColors(newColors);
      toast.info(`Removed ${toRemove.length} image(s) because their color is no longer used.`);
    }
  }, [usedColorIds, images, imageColors]);

  // --- Handlers (form, variants, images) ---
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

  // Variant handlers
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
    const totalSize = [...images, ...files].reduce((sum, file) => sum + file.size, 0);
    if (totalSize > MAX_TOTAL_SIZE) {
      toast.error("⚠️ Total file size must be less than 10MB.");
      fileInputRef.current.value = "";
      return;
    }
    setImages((prev) => [...prev, ...files]);
    setImageColors((prev) => [...prev, ...files.map(() => null)]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImageColors((prev) => prev.filter((_, i) => i !== index));
  };

  const updateImageColor = (index, colorId) => {
    const updated = [...imageColors];
    updated[index] = colorId === "" ? null : Number(colorId);
    setImageColors(updated);
  };

  // Drag‑and‑drop reorder
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(images);
    const colors = Array.from(imageColors);
    const [reorderedItem] = items.splice(result.source.index, 1);
    const [reorderedColor] = colors.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    colors.splice(result.destination.index, 0, reorderedColor);
    setImages(items);
    setImageColors(colors);
  };

  // --- Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate variants
    if (variants.some((v) => !v.quantity || v.quantity < 1)) {
      toast.error("All variants must have a positive quantity.");
      return;
    }
    if (hasDuplicate()) {
      toast.error("Duplicate color+size combination is not allowed.");
      return;
    }

    const data = new FormData();
    images.forEach((image) => data.append("images", image));
    if (images.length === 0) data.append("images", "");

    // Basic product fields
    for (const key in formData) {
      if (typeof formData[key] === "boolean") {
        data.append(key, formData[key] ? "true" : "false");
      } else {
        data.append(key, formData[key]);
      }
    }

    // Variants payload
    const variantsPayload = variants.map((v) => ({
      colorId: v.colorId || null,
      sizeId: v.sizeId || null,
      price: v.price !== "" ? parseFloat(v.price) : null,
      canceledPrice: v.canceledPrice !== "" ? parseFloat(v.canceledPrice) : null,
      quantity: parseInt(v.quantity, 10),
    }));
    data.append("variants", JSON.stringify(variantsPayload));

    // Build color‑image mappings
    const colorMappings = [];
    const map = new Map();
    imageColors.forEach((colorId, index) => {
      if (colorId !== null) {
        if (!map.has(colorId)) map.set(colorId, []);
        map.get(colorId).push(index);
      }
    });
    for (const [colorId, indices] of map) {
      colorMappings.push({ colorId: Number(colorId), imageIndices: indices });
    }
    if (colorMappings.length > 0) {
      data.append("colorImages", JSON.stringify(colorMappings));
    }

    try {
      await api.post("/api/admin/product/add", data);
      toast.success("✅ Product added successfully!");
      // Reset form
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
      setImageColors([]);
      setVariants([{ colorId: "", sizeId: "", price: "", canceledPrice: "", quantity: 1 }]);
      fileInputRef.current.value = "";
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        toast.error("⚠️ Session expired");
        navigate("/login");
        return;
      }
      toast.error(
        error.response?.data?.message || error.response?.data || "❌ Failed to add product"
      );
    }
  };

  // Get allowed colors for image dropdown (used colors + "General")
  const allowedColors = colors.filter((c) => usedColorIds.has(c.id));

  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-8 flex items-center justify-center" dir="ltr">
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="bg-white border border-neutral-200 w-full max-w-4xl p-6 md:p-10 transition-all duration-300"
      >
        {/* Header (unchanged) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200 pb-6 mb-8">
          <div>
            <h2 className="text-xl font-light tracking-wide text-neutral-900">Add New Product</h2>
            <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-1">Enter product details and images</p>
          </div>
          <div className="flex items-center gap-2 mt-3 sm:mt-0 text-neutral-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
        </div>

        {/* Basic Fields Grid (unchanged) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">Product Name <span className="text-neutral-400">*</span></label>
            <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="e.g. Office Chair" className="w-full border border-neutral-200 px-4 py-2.5 focus:outline-none focus:border-black bg-transparent text-sm placeholder:text-neutral-400" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">Product Code <span className="text-neutral-400">*</span></label>
            <input type="text" name="code" value={formData.code} onChange={handleInputChange} required placeholder="e.g. PROD-001" className="w-full border border-neutral-200 px-4 py-2.5 focus:outline-none focus:border-black bg-transparent text-sm placeholder:text-neutral-400" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">Price (EGP) <span className="text-neutral-400">*</span></label>
            <input type="number" name="price" value={formData.price} onChange={handleInputChange} required placeholder="0.00" className="w-full border border-neutral-200 px-4 py-2.5 focus:outline-none focus:border-black bg-transparent text-sm placeholder:text-neutral-400" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">Old Price (EGP)</label>
            <input type="number" name="canceledPrice" value={formData.canceledPrice} onChange={handleInputChange} placeholder="0.00" className="w-full border border-neutral-200 px-4 py-2.5 focus:outline-none focus:border-black bg-transparent text-sm placeholder:text-neutral-400" />
          </div>
        </div>

        {/* Category & Supplier (unchanged) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6 mt-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">Category <span className="text-neutral-400">*</span></label>
            <select name="category" value={formData.category} onChange={handleInputChange} required className="w-full border border-neutral-200 px-4 py-2.5 focus:outline-none focus:border-black bg-white text-sm">
              <option value="">Select category</option>
              {categories.map((cat) => (<option key={cat.id} value={cat.id}>{cat.name}</option>))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">Supplier <span className="text-neutral-400">*</span></label>
            <select name="supplierCode" value={formData.supplierCode} onChange={handleInputChange} required className="w-full border border-neutral-200 px-4 py-2.5 focus:outline-none focus:border-black bg-white text-sm">
              <option value="">Select supplier</option>
              {suppliers.map((sup) => (<option key={sup.id} value={sup.code}>{sup.name}</option>))}
            </select>
          </div>
        </div>

        {/* Description (unchanged) */}
        <div className="flex flex-col gap-1.5 mt-6">
          <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">Description <span className="text-neutral-400">*</span></label>
          <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="4" placeholder="Provide a detailed description..." className="w-full border border-neutral-200 px-4 py-2.5 focus:outline-none focus:border-black bg-transparent text-sm placeholder:text-neutral-400 resize-y" />
        </div>

        {/* Delivery Options (unchanged) */}
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

        {/* Variants Section (unchanged) */}
        <div className="mt-8 border-t border-neutral-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">Product Variants (Colors & Sizes)</label>
            <button type="button" onClick={addVariant} className="text-xs bg-neutral-900 text-white px-4 py-1.5 hover:bg-neutral-800 transition-colors">+ Add Variant</button>
          </div>

          {variants.map((variant, index) => (
            <div key={index} className="grid grid-cols-1 sm:grid-cols-6 gap-3 items-end mb-3 p-3 border border-neutral-100 bg-neutral-50">
              <div className="sm:col-span-1">
                <label className="text-[10px] text-neutral-400 block">Color</label>
                <select
                  value={variant.colorId}
                  onChange={(e) => updateVariant(index, "colorId", e.target.value)}
                  className="w-full border border-neutral-200 px-2 py-1.5 text-sm bg-white focus:outline-none focus:border-black"
                >
                  <option value="">None</option>
                  {colors.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-1">
                <label className="text-[10px] text-neutral-400 block">Size</label>
                <select
                  value={variant.sizeId}
                  onChange={(e) => updateVariant(index, "sizeId", e.target.value)}
                  className="w-full border border-neutral-200 px-2 py-1.5 text-sm bg-white focus:outline-none focus:border-black"
                >
                  <option value="">None</option>
                  {sizes.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-1">
                <label className="text-[10px] text-neutral-400 block">Price (EGP)</label>
                <input
                  type="number"
                  value={variant.price}
                  onChange={(e) => updateVariant(index, "price", e.target.value)}
                  placeholder="inherit"
                  className="w-full border border-neutral-200 px-2 py-1.5 text-sm focus:outline-none focus:border-black"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="text-[10px] text-neutral-400 block">Old Price</label>
                <input
                  type="number"
                  value={variant.canceledPrice}
                  onChange={(e) => updateVariant(index, "canceledPrice", e.target.value)}
                  placeholder="inherit"
                  className="w-full border border-neutral-200 px-2 py-1.5 text-sm focus:outline-none focus:border-black"
                />
              </div>
              <div className="sm:col-span-1">
                <label className="text-[10px] text-neutral-400 block">Qty *</label>
                <input
                  type="number"
                  min="0"
                  value={variant.quantity}
                  onChange={(e) => updateVariant(index, "quantity", e.target.value)}
                  required
                  className="w-full border border-neutral-200 px-2 py-1.5 text-sm focus:outline-none focus:border-black"
                />
              </div>
              <div className="sm:col-span-1 flex justify-end">
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="text-neutral-400 hover:text-red-500 text-xl leading-none"
                  disabled={variants.length <= 1}
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ========== IMAGES SECTION WITH DRAG & DROP ========== */}
        <div className="flex flex-col gap-1.5 mt-6">
          <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
            Product Images <span className="text-neutral-400">*</span>
          </label>

          {/* Upload area (unchanged) */}
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border border-neutral-200 cursor-pointer bg-neutral-50 hover:bg-neutral-100 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-6 h-6 mb-2 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <p className="text-xs text-neutral-500 tracking-wide">Drag & drop or <span className="underline cursor-pointer">browse</span></p>
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

          {/* Draggable vertical list */}
          {images.length > 0 && (
            <div className="mt-4">
              <p className="text-[10px] uppercase tracking-wider text-neutral-400 mb-3">
                Selected images ({images.length}) – Drag to reorder
              </p>
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="images">
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex flex-col gap-3"
                    >
                      {images.map((file, idx) => (
                        <Draggable key={idx} draggableId={String(idx)} index={idx}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`flex items-center gap-4 p-3 border ${
                                snapshot.isDragging ? "border-black shadow-lg" : "border-neutral-200"
                              } bg-white rounded transition-shadow`}
                            >
                              {/* Thumbnail */}
                              <div className="w-20 h-20 flex-shrink-0">
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`preview-${idx}`}
                                  className="w-full h-full object-cover"
                                />
                              </div>

                              {/* Controls: color dropdown + delete button */}
                              <div className="flex-1 flex items-center gap-3">
                                <select
                                  value={imageColors[idx] ?? ""}
                                  onChange={(e) => updateImageColor(idx, e.target.value)}
                                  className="border border-neutral-200 px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-black flex-1"
                                >
                                  <option value="">General</option>
                                  {allowedColors.map((c) => (
                                    <option key={c.id} value={c.id}>
                                      {c.name}
                                    </option>
                                  ))}
                                </select>
                                <button
                                  type="button"
                                  onClick={() => removeImage(idx)}
                                  className="shrink-0 bg-neutral-900 text-white w-8 h-8 flex items-center justify-center hover:bg-neutral-700 transition-colors text-sm"
                                >
                                  ✕
                                </button>
                              </div>

                              {/* Optional: display assigned color name */}
                              {imageColors[idx] && (
                                <div className="text-xs text-neutral-500 ml-2">
                                  {colors.find((c) => c.id === imageColors[idx])?.name || "Color"}
                                </div>
                              )}
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