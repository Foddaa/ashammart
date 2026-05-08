// src/pages/admin/UpdateImages.jsx
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Asset configuration – maps frontend keys to backend field names and GET endpoints
const ASSETS = [
  {
    key: "logo",
    label: "الشعار (Logo)",
    icon: "🏷️",
    accept: "image/*,.ico",
    type: "image",
    color: "blue",
    backendField: "logo",
    getUrlEndpoint: "/api/admin/assets/logo",
    getUrlKey: "url",
  },
  {
    key: "heroImg1",
    label: "صورة السلايدر 1",
    icon: "🖼️",
    accept: "image/*",
    type: "image",
    color: "indigo",
    backendField: "slider1",
    getUrlEndpoint: "/api/admin/assets/slider",
    getUrlKey: "1",
  },
  {
    key: "heroImg2",
    label: "صورة السلايدر 2",
    icon: "🖼️",
    accept: "image/*",
    type: "image",
    color: "indigo",
    backendField: "slider2",
    getUrlEndpoint: "/api/admin/assets/slider",
    getUrlKey: "2",
  },
  {
    key: "heroImg3",
    label: "صورة السلايدر 3",
    icon: "🖼️",
    accept: "image/*",
    type: "image",
    color: "indigo",
    backendField: "slider3",
    getUrlEndpoint: "/api/admin/assets/slider",
    getUrlKey: "3",
  },
  {
    key: "heroVideo",
    label: "فيديو الهيرو",
    icon: "🎬",
    accept: "video/*",
    type: "video",
    color: "purple",
    backendField: "heroVideo",
    getUrlEndpoint: "/api/admin/assets/hero-video",
    getUrlKey: "url",
  },
  {
    key: "bestSellerHero",
    label: "صورة الأكثر مبيعاً",
    icon: "⭐",
    accept: "image/*",
    type: "image",
    color: "amber",
    backendField: "bestSeller",
    getUrlEndpoint: "/api/admin/assets/best-seller",
    getUrlKey: "url",
  },
  {
    key: "mostRatedHero",
    label: "صورة الأعلى تقييماً",
    icon: "🏆",
    accept: "image/*",
    type: "image",
    color: "emerald",
    backendField: "mostRated",
    getUrlEndpoint: "/api/admin/assets/most-rated",
    getUrlKey: "url",
  },
];

const COLOR_VARIANTS = {
  blue:    { border: "border-blue-200",   bg: "bg-blue-50",   badge: "bg-blue-100 text-blue-700",   btn: "bg-blue-600 hover:bg-blue-700",   ring: "focus:ring-blue-400",   label: "text-blue-700" },
  indigo:  { border: "border-indigo-200", bg: "bg-indigo-50", badge: "bg-indigo-100 text-indigo-700", btn: "bg-indigo-600 hover:bg-indigo-700", ring: "focus:ring-indigo-400", label: "text-indigo-700" },
  purple:  { border: "border-purple-200", bg: "bg-purple-50", badge: "bg-purple-100 text-purple-700", btn: "bg-purple-600 hover:bg-purple-700", ring: "focus:ring-purple-400", label: "text-purple-700" },
  amber:   { border: "border-amber-200",  bg: "bg-amber-50",  badge: "bg-amber-100 text-amber-700",  btn: "bg-amber-500 hover:bg-amber-600",  ring: "focus:ring-amber-400",  label: "text-amber-700" },
  emerald: { border: "border-emerald-200",bg: "bg-emerald-50",badge: "bg-emerald-100 text-emerald-700",btn: "bg-emerald-600 hover:bg-emerald-700",ring: "focus:ring-emerald-400",label: "text-emerald-700" },
};

const AssetCard = ({ asset }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const inputRef = useRef();
  const c = COLOR_VARIANTS[asset.color];

  // Helper: fetch the actual asset blob (image/video) using Authorization header
  const fetchAssetBlob = async () => {
    try {
      const token = localStorage.getItem("token");
      // Step 1: get the data endpoint URL (e.g., "/api/admin/assets/data/logo")
      const res = await axios.get(`${BASE_URL}${asset.getUrlEndpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let dataUrl = null;
      if (asset.getUrlKey === "url") {
        dataUrl = res.data.url;
      } else {
        dataUrl = res.data[asset.getUrlKey];
      }
      if (!dataUrl) return null;

      // Step 2: fetch the actual binary data with token
      const response = await fetch(`${BASE_URL}${dataUrl}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    } catch (err) {
      console.error(`Failed to fetch ${asset.label}`, err);
      return null;
    }
  };

  // Load preview on mount and when asset changes
  useEffect(() => {
    let isMounted = true;
    const loadPreview = async () => {
      const blobUrl = await fetchAssetBlob();
      if (isMounted) {
        // Revoke old blob URL if it exists
        if (previewUrl && previewUrl.startsWith("blob:")) {
          URL.revokeObjectURL(previewUrl);
        }
        setPreviewUrl(blobUrl);
      }
    };
    loadPreview();
    return () => {
      isMounted = false;
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [asset.key]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setUploaded(false);

    // Local preview for the selected file (before upload)
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    if (asset.type === "image") {
      const reader = new FileReader();
      reader.onload = (ev) => setPreviewUrl(ev.target.result);
      reader.readAsDataURL(selected);
    } else if (asset.type === "video") {
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("❌ يرجى اختيار ملف أولاً");
      return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append(asset.backendField, file);

    try {
      setLoading(true);
      await axios.put(`${BASE_URL}/api/admin/update/assets`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success(`✅ تم تحديث "${asset.label}" بنجاح`);
      setUploaded(true);

      // Reload the actual asset from backend (new blob)
      const newBlobUrl = await fetchAssetBlob();
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(newBlobUrl);
      // Clear the selected file reference so the card shows the newly uploaded asset
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      console.error(err);
      toast.error(`❌ فشل تحديث "${asset.label}"`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setUploaded(false);
    if (inputRef.current) inputRef.current.value = "";
    // Reload the current asset from backend (revert to stored version)
    fetchAssetBlob().then((newBlobUrl) => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(newBlobUrl);
    });
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-md border ${c.border} overflow-hidden transition-all duration-300 hover:shadow-lg`}
    >
      {/* Card Header */}
      <div className={`${c.bg} px-5 py-4 flex items-center justify-between border-b ${c.border}`}>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{asset.icon}</span>
          <h3 className={`font-bold text-lg ${c.label}`}>{asset.label}</h3>
        </div>
        {uploaded && (
          <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
            ✅ تم الرفع
          </span>
        )}
      </div>

      {/* Preview Area */}
      <div className="p-4">
        <div
          className={`relative w-full rounded-xl overflow-hidden border-2 border-dashed ${c.border} ${c.bg} flex items-center justify-center`}
          style={{ minHeight: "140px" }}
        >
          {previewUrl ? (
            asset.type === "video" ? (
              <video
                src={previewUrl}
                controls
                className="w-full max-h-40 object-cover rounded-lg"
              />
            ) : (
              <img
                src={previewUrl}
                alt="معاينة"
                className="max-h-40 max-w-full object-contain rounded-lg"
              />
            )
          ) : (
            <div className="text-center p-4">
              <p className="text-4xl mb-2 opacity-30">
                {asset.type === "video" ? "🎬" : "🖼️"}
              </p>
              <p className="text-gray-400 text-sm">لم يتم العثور على ملف</p>
            </div>
          )}
        </div>

        {/* File name badge */}
        {file && (
          <div className={`mt-2 text-xs ${c.badge} rounded-lg px-3 py-1.5 flex items-center justify-between gap-2`}>
            <span className="truncate font-medium">{file.name}</span>
            <span className="text-gray-500 shrink-0">
              {(file.size / 1024).toFixed(0)} KB
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex flex-col gap-2">
        <label
          htmlFor={`file-${asset.key}`}
          className={`cursor-pointer flex items-center justify-center gap-2 w-full px-4 py-2.5 border-2 ${c.border} ${c.label} font-semibold rounded-xl transition hover:${c.bg} text-sm`}
        >
          <span>📁</span>
          <span>{file ? "تغيير الملف" : "اختر ملفاً"}</span>
        </label>
        <input
          id={`file-${asset.key}`}
          ref={inputRef}
          type="file"
          accept={asset.accept}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex gap-2">
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className={`flex-1 ${c.btn} text-white font-bold py-2.5 rounded-xl text-sm transition-all duration-200 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-1">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                جاري الرفع...
              </span>
            ) : (
              "⬆️ رفع الملف"
            )}
          </button>

          {file && (
            <button
              onClick={handleReset}
              className="px-3 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm transition"
              title="إلغاء الاختيار"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Main Page ─── */
const UpdateImages = () => {
  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 md:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
          🖼️ تعديل الصور والوسائط
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          قم باختيار الملف الجديد ثم اضغط "رفع الملف" لكل عنصر على حدة
        </p>
      </div>

      <div className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 text-amber-800 text-sm">
        <span className="text-xl shrink-0">⚠️</span>
        <p>
          سيؤدي رفع الملفات إلى استبدال الملفات الحالية مباشرةً. تأكد من اختيار الملف الصحيح بالأبعاد المناسبة قبل الرفع.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {ASSETS.map((asset) => (
          <AssetCard key={asset.key} asset={asset} />
        ))}
      </div>

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

export default UpdateImages;