import React, { useEffect, useRef, useState } from "react";
import api from "@/api/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AddRealLifePhoto = () => {
  const navigate = useNavigate();
  const inputRef = useRef();

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [photos, setPhotos] = useState([]);
  const [loadingPhotos, setLoadingPhotos] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const handleAuthError = (error) => {
    if (error.response?.status === 401) {
      toast.error("⚠️ Session expired, please log in again");
      navigate("/login");
      return true;
    }
    return false;
  };

  const fetchPhotos = async () => {
    setLoadingPhotos(true);
    try {
      const res = await api.get("/api/product/realLife");
      setPhotos(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching real-life photos:", error);
      toast.error("❌ Failed to load current photos");
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
      toast.error("❌ Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      await api.post("/api/admin/real-life-photos", formData);

      toast.success("✅ Image uploaded successfully!");
      clearSelection();
      fetchPhotos();
    } catch (error) {
      console.error("Error uploading photo:", error);

      if (handleAuthError(error)) return;

      const apiMessage =
        error.response?.data?.message || error.response?.data || "❌ Failed to upload image";
      toast.error(apiMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeletingId(id);
      await api.delete(`/api/admin/real-life-photos/${id}`);
      toast.success("🗑️ Photo deleted");
      setPhotos((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting photo:", error);

      if (handleAuthError(error)) return;

      toast.error("❌ Failed to delete photo");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div dir="ltr" className="min-h-screen bg-neutral-50 p-4 md:p-8 flex flex-col items-center">
      
      {/* Upload Card */}
      <form
        onSubmit={handleUpload}
        className="bg-white border border-neutral-200 w-full max-w-xl p-6 md:p-8 transition-all duration-300 mt-4"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200 pb-6 mb-8">
          <div>
            <h2 className="text-xl font-light tracking-wide text-neutral-900">
              Add Real-Life Photo
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-1">
              Upload a new image to the "Real-Life Photos" gallery
            </p>
          </div>
          <div className="flex items-center gap-2 mt-3 sm:mt-0 text-neutral-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
          </div>
        </div>

        {/* Image Input Area */}
        <div className="flex flex-col gap-1.5 mb-6">
          <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
            Image <span className="text-neutral-400">*</span>
          </label>

          <div className="border border-neutral-200 bg-neutral-50 flex items-center justify-center w-full min-h-[180px] relative">
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="max-h-48 max-w-full object-contain p-2 bg-white" />
            ) : (
              <div className="text-center p-6">
                <svg className="w-10 h-10 mx-auto text-neutral-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <p className="text-neutral-400 text-xs tracking-wider">No image selected</p>
              </div>
            )}
          </div>

          {file && (
            <div className="flex items-center justify-between border border-neutral-200 px-3 py-1.5 mt-1 text-[10px] text-neutral-600 bg-white">
              <span className="truncate font-medium">{file.name}</span>
              <span className="text-neutral-400 ml-2">
                {(file.size / 1024).toFixed(0)} KB
              </span>
            </div>
          )}

          <label
            htmlFor="real-life-photo-input"
            className="flex items-center gap-2 justify-center w-full mt-2 px-3 py-2 border border-neutral-300 text-neutral-600 text-xs uppercase tracking-wider hover:border-black hover:text-black transition-colors cursor-pointer"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            {file ? "Change Image" : "Choose Image"}
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

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={!file || uploading}
            className="flex-1 bg-neutral-900 text-white py-3 text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors duration-200 border border-neutral-900 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Uploading...
              </span>
            ) : (
              "Upload Image"
            )}
          </button>

          {file && (
            <button
              type="button"
              onClick={clearSelection}
              className="px-4 py-3 bg-transparent border border-neutral-300 text-neutral-600 text-xs uppercase tracking-wider hover:border-black hover:text-black transition-colors"
              title="Cancel"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Existing Photos Table (Minimal, LTR) */}
      <div className="w-full max-w-xl mt-8 bg-white border border-neutral-200 p-6">
        <h3 className="text-sm font-light tracking-wide text-neutral-900 border-b border-neutral-200 pb-4 mb-4">
          Current Gallery
        </h3>
        {loadingPhotos ? (
          <p className="text-center text-neutral-400 text-xs tracking-wider py-4">Loading...</p>
        ) : photos.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-100">
              <tbody className="bg-white divide-y divide-neutral-100">
                {photos.slice(0, 5).map((photo) => (
                  <tr key={photo.id} className="hover:bg-neutral-50 transition-colors duration-150">
                    <td className="py-3 pr-4 text-sm text-neutral-500 text-left font-mono">
                      #{photo.id}
                    </td>
                    <td className="py-3 px-2">
                      <img
                        src={`${BASE_URL}${photo.image}`}
                        alt={`${photo.id}`}
                        className="h-10 w-10 object-cover border border-neutral-200 bg-neutral-50"
                      />
                    </td>
                    <td className="py-3 text-left">
                      <button
                        onClick={() => handleDelete(photo.id)}
                        disabled={deletingId === photo.id}
                        className="inline-flex items-center gap-1.5 border border-red-400 px-3 py-1 text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-200 text-[10px] tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                        {deletingId === photo.id ? "..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {photos.length > 5 && (
              <p className="text-[10px] text-neutral-400 mt-2 text-right">
                and {photos.length - 5} more...
              </p>
            )}
          </div>
        ) : (
          <p className="text-center text-neutral-400 text-xs tracking-wider py-4">No photos yet.</p>
        )}
      </div>

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

export default AddRealLifePhoto;