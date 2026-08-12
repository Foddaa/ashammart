import React, { useEffect, useState } from "react";
import api from "@/api/axiosInstance";
import Pagination from "@mui/material/Pagination";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ITEMS_PER_PAGE = 10;

const RealLifePhotoList = () => {
  const [photos, setPhotos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // --- Minimal Luxury Popup State ---
  const [popup, setPopup] = useState({ open: false, message: "", type: "success" });

  const showPopup = (message, type = "success") => {
    setPopup({ open: true, message, type });
    // Auto dismiss after 3.5 seconds
    setTimeout(() => setPopup((prev) => ({ ...prev, open: false })), 3500);
  };

  const fetchPhotos = async () => {
    try {
      const res = await api.get("/api/product/realLife");
      const data = Array.isArray(res.data) ? res.data : [];

      let photoList = data;
      if (searchTerm) {
        photoList = photoList.filter((photo) =>
          String(photo.id).toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setPhotos(photoList);
      setTotalPages(Math.ceil(photoList.length / ITEMS_PER_PAGE) || 1);
    } catch (error) {
      console.error("Error fetching real-life photos:", error);
      showPopup("Failed to load photos", "error");
      setPhotos([]);
      setTotalPages(1);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this photo?");
    if (!confirmed) return;
    try {
      setDeletingId(id);
      await api.delete(`/api/admin/real-life-photos/${id}`);
      setPhotos((prev) => prev.filter((p) => p.id !== id));
      showPopup("Photo deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting photo:", error);
      showPopup("Failed to delete photo", "error");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  // Search reset to page 1
  useEffect(() => {
    setCurrentPage(1);
    fetchPhotos();
  }, [searchTerm]);

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedPhotos = photos.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-10" dir="ltr">
      
      {/* Minimal Luxury Floating Popup */}
      {popup.open && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 border border-neutral-700 shadow-2xl px-6 py-4 flex items-center justify-between gap-6 max-w-lg w-full animate-fade-in">
          <div className="flex items-center gap-3">
            {popup.type === "success" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            )}
            <span className="text-white text-sm tracking-wide font-light">{popup.message}</span>
          </div>
          <button 
            onClick={() => setPopup({ ...popup, open: false })}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white border border-neutral-200 p-6 md:p-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-neutral-200 pb-6 mb-6">
          <h2 className="text-xl font-light tracking-wide text-neutral-900">
            Real-Life Product Photos
          </h2>

          <div className="relative w-full md:w-72">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2.5 border-b border-neutral-300 focus:border-black outline-none transition-colors text-sm placeholder:text-neutral-400 bg-transparent text-left"
              placeholder="Search by ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-transparent">
              <tr>
                <th className="px-6 py-3 text-left text-[10px] uppercase tracking-wider text-neutral-400 font-medium">ID</th>
                <th className="px-6 py-3 text-left text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Image</th>
                <th className="px-6 py-3 text-center text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-neutral-100">
              {paginatedPhotos.length > 0 ? (
                paginatedPhotos.map((photo) => (
                  <tr key={photo.id} className="hover:bg-neutral-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 text-center font-mono">
                      {photo.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <img
                        src={`${BASE_URL}${photo.image}`}
                        alt={`Real life photo ${photo.id}`}
                        className="h-14 w-14 object-cover border border-neutral-200 bg-neutral-50"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm flex items-center justify-center gap-3">
                      {/* Minimal Delete Button */}
                      <button
                        onClick={() => handleDelete(photo.id)}
                        disabled={deletingId === photo.id}
                        className="inline-flex items-center gap-1.5 border border-red-400 px-4 py-1.5 text-red-500 hover:bg-red-500 hover:text-white transition-colors duration-200 text-xs tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                          <line x1="10" y1="11" x2="10" y2="17"></line>
                          <line x1="14" y1="11" x2="14" y2="17"></line>
                        </svg>
                        {deletingId === photo.id ? "Deleting..." : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-16 text-center text-neutral-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <span className="text-5xl font-light tracking-widest">✦</span>
                      <p className="text-lg font-light tracking-wide">No photos found</p>
                      {searchTerm && (
                        <p className="text-sm mt-1 opacity-70">
                          No results for "<span className="font-semibold text-neutral-600">{searchTerm}</span>"
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between text-sm text-neutral-500 gap-4">
          <span className="text-left">
            Showing <span className="font-medium text-neutral-800">{paginatedPhotos.length}</span> of <span className="font-medium text-neutral-800">{photos.length}</span> photos
          </span>

          {totalPages > 1 && (
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              siblingCount={1}
              boundaryCount={1}
              sx={{
                '& .MuiPaginationItem-root': {
                  color: '#444',
                  border: 'none',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  minWidth: '32px',
                  height: '32px',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    color: '#000',
                  },
                },
                '& .MuiPaginationItem-root.Mui-selected': {
                  backgroundColor: 'transparent',
                  borderBottom: '1.5px solid #1a1a1a',
                  borderRadius: '0px',
                  color: '#1a1a1a',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: 'transparent',
                    borderBottomColor: '#1a1a1a',
                    color: '#1a1a1a',
                  },
                },
                '& .MuiPagination-ul': {
                  gap: '2px',
                },
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RealLifePhotoList;