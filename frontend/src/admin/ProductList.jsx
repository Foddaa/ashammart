import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/product/all`);
      setProducts(res.data);
    } catch (error) {
      console.error("خطأ في جلب المنتجات:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "هل أنت متأكد أنك تريد حذف هذا المنتج؟\nقد يكون مرتبطاً ببعض الطلبات!"
    );
    if (!confirmed) return;

    try {
      await axios.delete(`${BASE_URL}/api/product/delete?id=${id}`);
      fetchProducts(); // تحديث القائمة
    } catch (error) {
      console.error("خطأ في حذف المنتج:", error);
      alert("فشل حذف المنتج. ربما يكون مرتبطاً بالطلبات.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-6" dir="rtl">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header with title and search */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-5 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-2">
              <i className="fas fa-boxes text-2xl text-blue-600"></i>
              <h2 className="text-2xl font-bold text-gray-800">كل المنتجات</h2>
            </div>

            <div className="relative w-full md:w-80">
              <i className="fas fa-search absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input
                type="text"
                className="w-full pr-10 pl-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                placeholder="بحث بالاسم أو الكود..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Table - responsive wrapper */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  اسم المنتج
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الكود
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الوصف
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                      {p.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                      {p.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {p.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate" title={p.description}>
                      {p.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link
                      to={`edit/${p.id}`}
                      className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition shadow-sm ml-2"
                    >
                      <i className="fas fa-edit ml-1"></i>
                      تعديل
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="inline-flex items-center px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition shadow-sm"
                    >
                      <i className="fas fa-trash ml-1"></i>
                      حذف
                    </button>
                  </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <i className="fas fa-box-open text-5xl mb-3"></i>
                      <p className="text-lg font-medium">لا توجد منتجات</p>
                      {searchTerm && (
                        <p className="text-sm mt-1">
                          لا يوجد نتائج لـ "<span className="font-semibold">{searchTerm}</span>"
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer with count and refresh button */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="text-sm text-gray-600">
            عرض <span className="font-semibold text-gray-800">{filteredProducts.length}</span> من{" "}
            <span className="font-semibold text-gray-800">{products.length}</span> منتج
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ProductList;