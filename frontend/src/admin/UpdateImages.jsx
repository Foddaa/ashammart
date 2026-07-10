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
    key: "heroImg4",
    label: "صورة السلايدر 4",
    icon: "🖼️",
    accept: "image/*",
    type: "image",
    color: "indigo",
    backendField: "slider4",
    getUrlEndpoint: "/api/admin/assets/slider",
    getUrlKey: "4",
  },
  {
    key: "heroImg5",
    label: "صورة السلايدر 5",
    icon: "🖼️",
    accept: "image/*",
    type: "image",
    color: "indigo",
    backendField: "slider5",
    getUrlEndpoint: "/api/admin/assets/slider",
    getUrlKey: "5",
  },
  {
    key: "heroImg6",
    label: "صورة السلايدر 6",
    icon: "🖼️",
    accept: "image/*",
    type: "image",
    color: "indigo",
    backendField: "slider6",
    getUrlEndpoint: "/api/admin/assets/slider",
    getUrlKey: "6",
  },
  {
    key: "heroImg7",
    label: "صورة السلايدر 7",
    icon: "🖼️",
    accept: "image/*",
    type: "image",
    color: "indigo",
    backendField: "slider7",
    getUrlEndpoint: "/api/admin/assets/slider",
    getUrlKey: "7",
  },
  {
    key: "heroImg8",
    label: "صورة السلايدر 8",
    icon: "🖼️",
    accept: "image/*",
    type: "image",
    color: "indigo",
    backendField: "slider8",
    getUrlEndpoint: "/api/admin/assets/slider",
    getUrlKey: "8",
  },
  {
    key: "heroImg9",
    label: "صورة السلايدر 9",
    icon: "🖼️",
    accept: "image/*",
    type: "image",
    color: "indigo",
    backendField: "slider9",
    getUrlEndpoint: "/api/admin/assets/slider",
    getUrlKey: "9",
  },
  {
    key: "heroImg10",
    label: "صورة السلايدر 10",
    icon: "🖼️",
    accept: "image/*",
    type: "image",
    color: "indigo",
    backendField: "slider10",
    getUrlEndpoint: "/api/admin/assets/slider",
    getUrlKey: "10",
  },
  {
    key: "heroImg11",
    label: "صورة السلايدر 1",
    icon: "🖼️",
    accept: "image/*",
    type: "image",
    color: "indigo",
    backendField: "slider11",
    getUrlEndpoint: "/api/admin/assets/slider",
    getUrlKey: "11",
  },
  {
    key: "heroImg12",
    label: "صورة السلايدر 2",
    icon: "🖼️",
    accept: "image/*",
    type: "image",
    color: "indigo",
    backendField: "slider12",
    getUrlEndpoint: "/api/admin/assets/slider",
    getUrlKey: "12",
  },
  {
    key: "heroImg13",
    label: "صورة السلايدر 3",
    icon: "🖼️",
    accept: "image/*",
    type: "image",
    color: "indigo",
    backendField: "slider13",
    getUrlEndpoint: "/api/admin/assets/slider",
    getUrlKey: "13",
  },
  {
    key: "heroImg14",
    label: "صورة السلايدر 4",
    icon: "🖼️",
    accept: "image/*",
    type: "image",
    color: "indigo",
    backendField: "slider14",
    getUrlEndpoint: "/api/admin/assets/slider",
    getUrlKey: "14",
  },
  {
    key: "heroImg15",
    label: "صورة السلايدر 5",
    icon: "🖼️",
    accept: "image/*",
    type: "image",
    color: "indigo",
    backendField: "slider15",
    getUrlEndpoint: "/api/admin/assets/slider",
    getUrlKey: "15",
  },
  {
    key: "heroImg16",
    label: "صورة السلايدر 6",
    icon: "🖼️",
    accept: "image/*",
    type: "image",
    color: "indigo",
    backendField: "slider16",
    getUrlEndpoint: "/api/admin/assets/slider",
    getUrlKey: "16",
  },
  {
    key: "heroImg17",
    label: "صورة السلايدر 7",
    icon: "🖼️",
    accept: "image/*",
    type: "image",
    color: "indigo",
    backendField: "slider17",
    getUrlEndpoint: "/api/admin/assets/slider",
    getUrlKey: "17",
  },
  {
    key: "heroImg18",
    label: "صورة السلايدر 8",
    icon: "🖼️",
    accept: "image/*",
    type: "image",
    color: "indigo",
    backendField: "slider18",
    getUrlEndpoint: "/api/admin/assets/slider",
    getUrlKey: "18",
  },
  {
    key: "heroImg19",
    label: "صورة السلايدر 9",
    icon: "🖼️",
    accept: "image/*",
    type: "image",
    color: "indigo",
    backendField: "slider19",
    getUrlEndpoint: "/api/admin/assets/slider",
    getUrlKey: "19",
  },
  {
    key: "heroImg20",
    label: "صورة السلايدر 10",
    icon: "🖼️",
    accept: "image/*",
    type: "image",
    color: "indigo",
    backendField: "slider20",
    getUrlEndpoint: "/api/admin/assets/slider",
    getUrlKey: "20",
  },
  {
    key: "bestSeller1",
    label: "صورة الأكثر مبيعاً 1",
    icon: "⭐",
    accept: "image/*",
    type: "image",
    color: "amber",
    backendField: "bestSeller1",
    getUrlEndpoint: "/api/admin/assets/best-seller",
    getUrlKey: "1",
  },
  {
    key: "bestSeller2",
    label: "صورة الأكثر مبيعاً 2",
    icon: "⭐",
    accept: "image/*",
    type: "image",
    color: "amber",
    backendField: "bestSeller2",
    getUrlEndpoint: "/api/admin/assets/best-seller",
    getUrlKey: "2",
  },
    {
    key: "bestSeller3",
    label: "صورة الأكثر مبيعا 3",
    icon: "⭐",
    accept: "image/*",
    type: "image",
    color: "amber",
    backendField: "bestSeller3",
    getUrlEndpoint: "/api/admin/assets/best-seller",
    getUrlKey: "3",
  },
  {
    key: "mostRated1",
    label: "صورة الأعلى تقييماً 1",
    icon: "🏆",
    accept: "image/*",
    type: "image",
    color: "emerald",
    backendField: "mostRated1",
    getUrlEndpoint: "/api/admin/assets/most-rated",
    getUrlKey: "1",
  },
  {
    key: "mostRated2",
    label: "صورة الأعلى تقييماً 2",
    icon: "🏆",
    accept: "image/*",
    type: "image",
    color: "emerald",
    backendField: "mostRated2",
    getUrlEndpoint: "/api/admin/assets/most-rated",
    getUrlKey: "2",
  },
  {
    key: "mostRated3",
    label: "صورة الأعلى تقييماً 3",
    icon: "🏆",
    accept: "image/*",
    type: "image",
    color: "emerald",
    backendField: "mostRated3",
    getUrlEndpoint: "/api/admin/assets/most-rated",
    getUrlKey: "3",
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

/* Helper: Sort assets by numeric suffix (e.g., heroImg1, heroImg2) */
const sortByNumericSuffix = (assets) => {
  return [...assets].sort((a, b) => {
    const numA = parseInt(a.key.match(/\d+$/)?.[0] || "0", 10);
    const numB = parseInt(b.key.match(/\d+$/)?.[0] || "0", 10);
    return numA - numB;
  });
};

/* ─── Tab bar ─── */
const TABS_META = {
  other: {
    label: "اللوجو",
    hint: "شعار، صور مميزة",
    accent: "blue",
    tip: null,
  },
  slider1: {
    label: "سلايدر 1",
    hint: "1 – 10",
    accent: "indigo",
    tip: "يُفضل أن تكون أبعاد الصور 1920×1080 بكسل (نسبة 16:9) للحصول على أفضل عرض.",
  },
  slider2: {
    label: "سلايدر 2",
    hint: "11 – 20",
    accent: "purple",
    tip: "يُفضل أن تكون أبعاد الصور 1920×1080 بكسل (نسبة 16:9) للحصول على أفضل عرض.",
  },
  bestSellerSlider: {
    label: "سلايدر الاكثر مبيعا",
    hint: "21 - 23",
    accent: "amber",
    tip: "يُفضل أن تكون أبعاد الصور 1920×1080 بكسل (نسبة 16:9) للحصول على أفضل عرض.",
  },
  mostRatedSlider: {
    label: "سلايدر الاعلي تقييما",
    hint: "24 – 26",
    accent: "emerald",
    tip: "يُفضل أن تكون أبعاد الصور 1920×1080 بكسل (نسبة 16:9) للحصول على أفضل عرض.",
  }
};

const TAB_ACCENTS = {
  blue:   { activeBg: "bg-blue-600",   activeText: "text-white", idleText: "text-blue-700",   idleBg: "bg-blue-50 hover:bg-blue-100",     dot: "bg-blue-500" },
  indigo: { activeBg: "bg-indigo-600", activeText: "text-white", idleText: "text-indigo-700", idleBg: "bg-indigo-50 hover:bg-indigo-100", dot: "bg-indigo-500" },
  purple: { activeBg: "bg-purple-600", activeText: "text-white", idleText: "text-purple-700", idleBg: "bg-purple-50 hover:bg-purple-100", dot: "bg-purple-500" },
  amber:  { activeBg: "bg-amber-600",  activeText: "text-white", idleText: "text-amber-700",  idleBg: "bg-amber-50 hover:bg-amber-100",   dot: "bg-amber-500" },
  emerald:{ activeBg: "bg-emerald-600",activeText: "text-white", idleText: "text-emerald-700",idleBg: "bg-emerald-50 hover:bg-emerald-100", dot: "bg-emerald-500" },
};

const TabButton = ({ id, meta, count, active, onClick }) => {
  const a = TAB_ACCENTS[meta.accent];
  return (
    <button
      onClick={() => onClick(id)}
      className={`relative flex-1 min-w-[180px] flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-200 ${
        active ? `${a.activeBg} ${a.activeText} shadow-md` : `${a.idleBg} ${a.idleText}`
      }`}
    >
      <span className={`h-2 w-2 rounded-full ${active ? "bg-white" : a.dot}`}></span>
      <span>{meta.label}</span>
      <span
        className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
          active ? "bg-white/20" : "bg-white text-gray-500"
        }`}
      >
        {count}
      </span>
    </button>
  );
};

/* ─── Main Page with Tabs ─── */
const UpdateImages = () => {
  const [activeTab, setActiveTab] = useState("other");

  // Group assets
  const slider1Assets = sortByNumericSuffix(
    ASSETS.filter(asset => {
      const match = asset.key.match(/heroImg(\d+)/);
      if (!match) return false;
      const num = parseInt(match[1], 10);
      return num >= 1 && num <= 10;
    })
  );

  const slider2Assets = sortByNumericSuffix(
    ASSETS.filter(asset => {
      const match = asset.key.match(/heroImg(\d+)/);
      if (!match) return false;
      const num = parseInt(match[1], 10);
      return num >= 11 && num <= 20;
    })
  );

const bestSellerSliderAssets = sortByNumericSuffix(
  ASSETS.filter(asset => {
    const match = asset.key.match(/bestSeller(\d+)/);
    if (!match) return false;
    const num = parseInt(match[1], 10);
    return num >= 1 && num <= 3; 
  })
);

const mostRatedSliderAssets = sortByNumericSuffix(
  ASSETS.filter(asset => {
    const match = asset.key.match(/mostRated(\d+)/);
    if (!match) return false;
    const num = parseInt(match[1], 10); 
    return num >= 1 && num <= 3; 
  })
);
  const otherAssets = ASSETS.filter(asset => asset.key.startsWith('logo'));

  const GROUPS = {
    other: otherAssets,
    slider1: slider1Assets,
    slider2: slider2Assets,
    bestSellerSlider: bestSellerSliderAssets,
    mostRatedSlider: mostRatedSliderAssets
  };

  const currentAssets = GROUPS[activeTab];
  const currentMeta = TABS_META[activeTab];

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

      {/* Tab bar */}
      <div className="flex flex-wrap gap-2 mb-6 bg-white/60 backdrop-blur border border-gray-200 rounded-2xl p-2 sticky top-2 z-10 shadow-sm">
        {Object.entries(TABS_META).map(([id, meta]) => (
          <TabButton
            key={id}
            id={id}
            meta={meta}
            count={GROUPS[id].length}
            active={activeTab === id}
            onClick={setActiveTab}
          />
        ))}
      </div>

      {/* Active tab content */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className={`h-8 w-1 ${TAB_ACCENTS[currentMeta.accent].dot} rounded-full`}></div>
          <h2 className="text-xl font-bold text-gray-800">{currentMeta.label}</h2>
          <span className="text-sm text-gray-400">({currentMeta.hint})</span>
        </div>

        {currentMeta.tip && (
          <div className="bg-white/70 border border-gray-200 rounded-2xl p-4 mb-4 text-sm text-gray-700">
            <p className="flex items-center gap-2">💡 <span>{currentMeta.tip}</span></p>
          </div>
        )}

        {currentAssets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {currentAssets.map((asset) => (
              <AssetCard key={asset.key} asset={asset} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">لا توجد عناصر في هذا القسم.</p>
        )}
      </section>

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