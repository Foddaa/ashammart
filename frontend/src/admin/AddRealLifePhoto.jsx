import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AddRealLifePhoto = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const inputRef = useRef();

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [photos, setPhotos] = useState([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // Same 401 handling pattern as AddSupplier
  const handleAuthError = (error) => {
    if (error.response?.status === 401) {
      toast.error("⚠️ انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى");
      navigate("/login");
      return true;
    }
    return false;
  };

  const fetchPhotos = async () => {
    setLoadingPhotos(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/product/realLife`);
      setPhotos(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching real-life photos:", error);
      toast.error("❌ فشل في جلب الصور الحالية");
    } finally {
      setLoadingPhotos(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(selected));
  };

  const clearSelection = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("❌ يرجى اختيار صورة أولاً");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      await axios.post(`${BASE_URL}/api/admin/real-life-photos`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("✅ تم رفع الصورة بنجاح!");
      clearSelection();
      fetchPhotos();
    } catch (error) {
      console.error("Error uploading photo:", error);

      if (handleAuthError(error)) return;

      const apiMessage =
        error.response?.data?.message || error.response?.data || "❌ فشل رفع الصورة";
      toast.error(apiMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await axios.delete(`${BASE_URL}/api/admin/real-life-photos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("🗑️ تم حذف الصورة");
      setPhotos((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting photo:", error);

      if (handleAuthError(error)) return;

      toast.error("❌ فشل حذف الصورة");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 flex flex-col items-center"
      dir="rtl"
    >
      {/* Upload Card — same shell as AddSupplier */}
      <form
        onSubmit={handleUpload}
        className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 md:p-8 transition-all duration-300 mt-8"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-blue-700">🖼️ إضافة صورة على الطبيعة</h2>
          <p className="text-gray-500 mt-1">قم برفع صورة جديدة لمعرض "المنتجات على الطبيعة"</p>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            الصورة <span className="text-red-500">*</span>
          </label>

          <div
            className="relative w-full rounded-xl overflow-hidden border-2 border-dashed border-blue-200 bg-blue-50 flex items-center justify-center"
            style={{ minHeight: "180px" }}
          >
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="معاينة"
                className="max-h-56 max-w-full object-contain rounded-lg"
              />
            ) : (
              <div className="text-center p-6">
                <p className="text-4xl mb-2 opacity-30">🖼️</p>
                <p className="text-gray-400 text-sm">لم يتم اختيار صورة بعد</p>
              </div>
            )}
          </div>

          {file && (
            <div className="mt-2 text-xs bg-blue-100 text-blue-700 rounded-lg px-3 py-1.5 flex items-center justify-between gap-2">
              <span className="truncate font-medium">{file.name}</span>
              <span className="text-gray-500 shrink-0">
                {(file.size / 1024).toFixed(0)} KB
              </span>
            </div>
          )}

          <label
            htmlFor="real-life-photo-input"
            className="cursor-pointer flex items-center justify-center gap-2 w-full mt-3 px-4 py-2.5 border-2 border-blue-200 text-blue-700 font-semibold rounded-xl transition hover:bg-blue-50 text-sm"
          >
            <span>📁</span>
            <span>{file ? "تغيير الصورة" : "اختر صورة"}</span>
          </label>
          <input
            id="real-life-photo-input"
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!file || uploading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition duration-200 shadow-md hover:shadow-lg text-lg disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                جاري الرفع...
              </span>
            ) : (
              "⬆️ رفع الصورة"
            )}
          </button>

          {file && (
            <button
              type="button"
              onClick={clearSelection}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition"
              title="إلغاء الاختيار"
            >
              ✕
            </button>
          )}
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

export default AddRealLifePhoto;
