import React, { useState, useRef, useEffect } from "react";
import api from "@/api/axiosInstance";           // ✅ your configured instance
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Asset configuration – maps frontend keys to backend field names and GET endpoints
const ASSETS = [
  {
    key: "logo",
    label: "Logo", // Translated for internal consistency
    icon: "🏷️",
    accept: "image/*,.ico",
    type: "image",
    backendField: "logo",
    getUrlEndpoint: "/api/admin/assets/logo",
    getUrlKey: "url",
  },
  {
    key: "heroImg1",
    label: "Slider Image 1",
    accept: "image/*",
    type: "image",
    backendField: "slider1",
    getUrlEndpoint: "/api/admin/assets/slider",
    getUrlKey: "1",
  },
  // ... (2-20 omitted for brevity, identical structure)
  {
    key: "heroImg2", label: "Slider Image 2", accept: "image/*", type: "image", backendField: "slider2", getUrlEndpoint: "/api/admin/assets/slider", getUrlKey: "2",
  },
  {
    key: "heroImg3", label: "Slider Image 3", accept: "image/*", type: "image", backendField: "slider3", getUrlEndpoint: "/api/admin/assets/slider", getUrlKey: "3",
  },
  {
    key: "heroImg4", label: "Slider Image 4", accept: "image/*", type: "image", backendField: "slider4", getUrlEndpoint: "/api/admin/assets/slider", getUrlKey: "4",
  },
  {
    key: "heroImg5", label: "Slider Image 5", accept: "image/*", type: "image", backendField: "slider5", getUrlEndpoint: "/api/admin/assets/slider", getUrlKey: "5",
  },
  {
    key: "heroImg6", label: "Slider Image 6", accept: "image/*", type: "image", backendField: "slider6", getUrlEndpoint: "/api/admin/assets/slider", getUrlKey: "6",
  },
  {
    key: "heroImg7", label: "Slider Image 7", accept: "image/*", type: "image", backendField: "slider7", getUrlEndpoint: "/api/admin/assets/slider", getUrlKey: "7",
  },
  {
    key: "heroImg8", label: "Slider Image 8", accept: "image/*", type: "image", backendField: "slider8", getUrlEndpoint: "/api/admin/assets/slider", getUrlKey: "8",
  },
  {
    key: "heroImg9", label: "Slider Image 9", accept: "image/*", type: "image", backendField: "slider9", getUrlEndpoint: "/api/admin/assets/slider", getUrlKey: "9",
  },
  {
    key: "heroImg10", label: "Slider Image 10", accept: "image/*", type: "image", backendField: "slider10", getUrlEndpoint: "/api/admin/assets/slider", getUrlKey: "10",
  },
  {
    key: "heroImg11", label: "Slider Image 11", accept: "image/*", type: "image", backendField: "slider11", getUrlEndpoint: "/api/admin/assets/slider", getUrlKey: "11",
  },
  {
    key: "heroImg12", label: "Slider Image 12", accept: "image/*", type: "image", backendField: "slider12", getUrlEndpoint: "/api/admin/assets/slider", getUrlKey: "12",
  },
  {
    key: "heroImg13", label: "Slider Image 13", accept: "image/*", type: "image", backendField: "slider13", getUrlEndpoint: "/api/admin/assets/slider", getUrlKey: "13",
  },
  {
    key: "heroImg14", label: "Slider Image 14", accept: "image/*", type: "image", backendField: "slider14", getUrlEndpoint: "/api/admin/assets/slider", getUrlKey: "14",
  },
  {
    key: "heroImg15", label: "Slider Image 15", accept: "image/*", type: "image", backendField: "slider15", getUrlEndpoint: "/api/admin/assets/slider", getUrlKey: "15",
  },
  {
    key: "heroImg16", label: "Slider Image 16", accept: "image/*", type: "image", backendField: "slider16", getUrlEndpoint: "/api/admin/assets/slider", getUrlKey: "16",
  },
  {
    key: "heroImg17", label: "Slider Image 17", accept: "image/*", type: "image", backendField: "slider17", getUrlEndpoint: "/api/admin/assets/slider", getUrlKey: "17",
  },
  {
    key: "heroImg18", label: "Slider Image 18", accept: "image/*", type: "image", backendField: "slider18", getUrlEndpoint: "/api/admin/assets/slider", getUrlKey: "18",
  },
  {
    key: "heroImg19", label: "Slider Image 19", accept: "image/*", type: "image", backendField: "slider19", getUrlEndpoint: "/api/admin/assets/slider", getUrlKey: "19",
  },
  {
    key: "heroImg20", label: "Slider Image 20", accept: "image/*", type: "image", backendField: "slider20", getUrlEndpoint: "/api/admin/assets/slider", getUrlKey: "20",
  },
  {
    key: "bestSeller1", label: "Best Seller 1", accept: "image/*", type: "image", backendField: "bestSeller1", getUrlEndpoint: "/api/admin/assets/best-seller", getUrlKey: "1",
  },
  {
    key: "bestSeller2", label: "Best Seller 2", accept: "image/*", type: "image", backendField: "bestSeller2", getUrlEndpoint: "/api/admin/assets/best-seller", getUrlKey: "2",
  },
  {
    key: "bestSeller3", label: "Best Seller 3", accept: "image/*", type: "image", backendField: "bestSeller3", getUrlEndpoint: "/api/admin/assets/best-seller", getUrlKey: "3",
  },
  {
    key: "mostRated1", label: "Most Rated 1", accept: "image/*", type: "image", backendField: "mostRated1", getUrlEndpoint: "/api/admin/assets/most-rated", getUrlKey: "1",
  },
  {
    key: "mostRated2", label: "Most Rated 2", accept: "image/*", type: "image", backendField: "mostRated2", getUrlEndpoint: "/api/admin/assets/most-rated", getUrlKey: "2",
  },
  {
    key: "mostRated3", label: "Most Rated 3", accept: "image/*", type: "image", backendField: "mostRated3", getUrlEndpoint: "/api/admin/assets/most-rated", getUrlKey: "3",
  },
  {
    key: "fastDelivery", label: "Fast Delivery Section", accept: "image/*", type: "image", backendField: "fastDelivery", getUrlEndpoint: "/api/admin/assets/fastDelivery", getUrlKey: "url",
  },
  {
    key: "realLife", label: "Real Life Photos Section", accept: "image/*", type: "image", backendField: "realLifePhotos", getUrlEndpoint: "/api/admin/assets/realLifePhotos", getUrlKey: "url",
  },
];

/* Helper: Sort assets by numeric suffix */
const sortByNumericSuffix = (assets) => {
  return [...assets].sort((a, b) => {
    const numA = parseInt(a.key.match(/\d+$/)?.[0] || "0", 10);
    const numB = parseInt(b.key.match(/\d+$/)?.[0] || "0", 10);
    return numA - numB;
  });
};

const AssetCard = ({ asset }) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const inputRef = useRef();

  // Helper: fetch the actual asset blob (image/video) using Authorization header
  const fetchAssetBlob = async () => {
    try {
      const metaRes = await api.get(asset.getUrlEndpoint);
      let relativeUrl = null;
      if (asset.getUrlKey === "url") {
        relativeUrl = metaRes.data.url;
      } else {
        relativeUrl = metaRes.data[asset.getUrlKey];
      }
      if (!relativeUrl) return null;

      const blobRes = await api.get(relativeUrl, { responseType: "blob" });
      return URL.createObjectURL(blobRes.data);
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
      toast.error("❌ Please choose a file first");
      return;
    }

    const formData = new FormData();
    formData.append(asset.backendField, file);

    try {
      setLoading(true);
      await api.put("/api/admin/update/assets", formData);
      toast.success(`✅ "${asset.label}" updated successfully`);
      setUploaded(true);

      const newBlobUrl = await fetchAssetBlob();
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(newBlobUrl);
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
    } catch (err) {
      console.error(err);
      toast.error(`❌ Failed to update "${asset.label}"`);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setUploaded(false);
    if (inputRef.current) inputRef.current.value = "";
    fetchAssetBlob().then((newBlobUrl) => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(newBlobUrl);
    });
  };

  return (
    <div className="bg-white border border-neutral-200 overflow-hidden transition-colors duration-200 flex flex-col h-full">
      
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 bg-neutral-50">
        <h3 className="text-sm font-medium tracking-wide text-neutral-800">
          {asset.label}
        </h3>
        {uploaded && (
          <span className="text-[10px] uppercase tracking-wider border border-neutral-900 px-2 py-0.5 text-neutral-900">
            Uploaded
          </span>
        )}
      </div>

      {/* Preview Area */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        <div className="border border-neutral-200 bg-neutral-50 flex items-center justify-center h-32 w-full relative">
          {previewUrl ? (
            asset.type === "video" ? (
              <video src={previewUrl} controls className="max-h-full max-w-full object-contain p-2" />
            ) : (
              <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain p-2" />
            )
          ) : (
            <div className="text-center p-2 text-neutral-300 text-xs uppercase tracking-wider">
              No file found
            </div>
          )}
        </div>

        {/* File name badge */}
        {file && (
          <div className="flex items-center justify-between border border-neutral-200 px-3 py-1.5 text-[10px] text-neutral-600 bg-white">
            <span className="truncate font-medium">{file.name}</span>
            <span className="text-neutral-400 ml-2">
              {(file.size / 1024).toFixed(0)} KB
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 pt-0 flex flex-col gap-2 mt-auto">
        <label
          htmlFor={`file-${asset.key}`}
          className={`flex items-center gap-2 justify-center w-full px-3 py-2 border border-neutral-300 text-neutral-600 text-xs uppercase tracking-wider hover:border-black hover:text-black transition-colors cursor-pointer`}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="17 8 12 3 7 8"></polyline>
            <line x1="12" y1="3" x2="12" y2="15"></line>
          </svg>
          {file ? "Change File" : "Choose File"}
        </label>
        <input
          id={`file-${asset.key}`}
          ref={inputRef}
          type="file"
          accept={asset.accept}
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex gap-2 mt-1">
          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="flex-1 bg-neutral-900 text-white py-2 text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors duration-200 border border-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-1">
                <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
                Uploading...
              </span>
            ) : (
              "Upload"
            )}
          </button>

          {file && (
            <button
              onClick={handleReset}
              className="px-3 py-2 bg-transparent border border-neutral-300 text-neutral-600 text-xs uppercase tracking-wider hover:border-black hover:text-black transition-colors"
              title="Cancel"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ─── Tab bar ─── */
const TABS_META = {
  other: {
    label: "Other Assets",
    hint: "Logo, Fast Delivery, Real Life Photos",
  },
  slider1: {
    label: "Slider (1-10)",
    hint: "Images 1 through 10",
  },
  slider2: {
    label: "Slider (11-20)",
    hint: "Images 11 through 20",
  },
  bestSellerSlider: {
    label: "Best Sellers",
    hint: "Images 21-23",
  },
  mostRatedSlider: {
    label: "Most Rated",
    hint: "Images 24-26",
  },
};

/* ─── Main Page with Tabs ─── */
const UpdateImages = () => {
  const [activeTab, setActiveTab] = useState("other");

  const matchesAnyPattern = (key, patterns) => patterns.some(pattern => pattern.test(key));

  const slider1Pattern = /^heroImg([1-9]|10)$/;
  const slider2Pattern = /^heroImg(1[1-9]|20)$/;
  const bestSellerPattern = /^bestSeller[1-3]$/;
  const mostRatedPattern = /^mostRated[1-3]$/;

  const slider1Assets = sortByNumericSuffix(ASSETS.filter(asset => matchesAnyPattern(asset.key, [slider1Pattern])));
  const slider2Assets = sortByNumericSuffix(ASSETS.filter(asset => matchesAnyPattern(asset.key, [slider2Pattern])));
  const bestSellerSliderAssets = sortByNumericSuffix(ASSETS.filter(asset => matchesAnyPattern(asset.key, [bestSellerPattern])));
  const mostRatedSliderAssets = sortByNumericSuffix(ASSETS.filter(asset => matchesAnyPattern(asset.key, [mostRatedPattern])));
  
  const otherAssets = ASSETS.filter(asset => {
    const key = asset.key;
    return !(
      matchesAnyPattern(key, [slider1Pattern]) ||
      matchesAnyPattern(key, [slider2Pattern]) ||
      matchesAnyPattern(key, [bestSellerPattern]) ||
      matchesAnyPattern(key, [mostRatedPattern])
    );
  });

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
    <div dir="ltr" className="min-h-screen bg-neutral-50 p-4 md:p-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200 pb-6 mb-8">
        <div>
          <h2 className="text-xl font-light tracking-wide text-neutral-900 flex items-center gap-3">
            Update Images & Media
          </h2>
          <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-1">
            Manage logos, sliders, and promotional assets
          </p>
        </div>
        <div className="flex items-center gap-2 mt-3 sm:mt-0 text-neutral-400">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </div>
      </div>

      {/* Warning */}
      <div className="mb-6 border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 flex items-start gap-3">
        <span className="shrink-0 pt-0.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </span>
        <p>Uploading files will immediately replace existing assets. Please ensure the correct file and dimensions are selected before uploading.</p>
      </div>

      {/* Minimal Tab Bar */}
      <div className="flex flex-wrap gap-6 mb-8 border-b border-neutral-200 pb-1 overflow-x-auto">
        {Object.entries(TABS_META).map(([id, meta]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`relative pb-2 border-b-2 transition-colors duration-200 text-[11px] uppercase tracking-widest whitespace-nowrap ${
              activeTab === id
                ? "border-black text-neutral-900 font-medium"
                : "border-transparent text-neutral-400 hover:text-neutral-700 hover:border-neutral-300"
            }`}
          >
            {meta.label}
            <span className={`ml-2 text-[10px] ${activeTab === id ? "text-neutral-600" : "text-neutral-400"}`}>
              ({GROUPS[id].length})
            </span>
          </button>
        ))}
      </div>

      {/* Active tab content */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] uppercase tracking-widest text-neutral-400">
            {currentMeta.hint}
          </span>
        </div>

        {currentAssets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
            {currentAssets.map((asset) => (
              <AssetCard key={asset.key} asset={asset} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-400 font-light tracking-wide">
            No items found in this section.
          </p>
        )}
      </section>

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

export default UpdateImages;