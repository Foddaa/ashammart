import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const RealLifePhotoList = () => {
  const [photos, setPhotos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchPhotos = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/product/realLife`);
      setPhotos(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching real-life photos:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("هل أنت متأكد أنك تريد حذف هذه الصورة؟");
    if (!confirmed) return;
    try {
      setDeletingId(id);
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/api/admin/real-life-photos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPhotos((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting photo:", error);
      alert("فشل في حذف الصورة.");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const filteredPhotos = photos.filter((photo) =>
    String(photo.id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6" dir="rtl">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <i className="fas fa-images text-2xl text-blue-600"></i>
              <h2 className="text-2xl font-bold text-gray-800">صور المنتجات على الطبيعة</h2>
            </div>
            <div className="relative w-full md:w-80">
              <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="ابحث بالرقم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الصورة
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredPhotos.length > 0 ? (
                filteredPhotos.map((photo) => (
                  <tr key={photo.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                      {photo.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <img
                        src={`${BASE_URL}${photo.image}`}
                        alt={`صورة ${photo.id}`}
                        className="h-16 w-16 object-cover rounded-lg border border-gray-200 mx-auto"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                      <button
                        onClick={() => handleDelete(photo.id)}
                        disabled={deletingId === photo.id}
                        className="inline-flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <i className="fas fa-trash ml-1"></i>
                        {deletingId === photo.id ? "جارٍ الحذف..." : "حذف"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <i className="fas fa-images text-5xl mb-3"></i>
                      <p className="text-lg font-medium">لا توجد صور</p>
                      {searchTerm && (
                        <p className="text-sm mt-1">
                          لا توجد نتائج لـ "<span className="font-semibold">{searchTerm}</span>"
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
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-sm text-gray-600">
            عرض <span className="font-semibold text-gray-800">{filteredPhotos.length}</span> من{" "}
            <span className="font-semibold text-gray-800">{photos.length}</span> صورة
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealLifePhotoList;
