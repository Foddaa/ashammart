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
    <div className="container mt-4" dir="rtl">
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        {/* العنوان و البحث */}
        <div className="card-header bg-white py-4 border-0">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <h3 className="mb-0 text-primary fw-bold">
              <i className="fas fa-boxes ms-2"></i>كل المنتجات
            </h3>

            <div
              className="position-relative w-100"
              style={{ maxWidth: "400px" }}
            >
              <input
                type="text"
                className="form-control form-control-lg border-2 border-primary rounded-pill pe-4 py-2"
                placeholder="بحث بالاسم أو الكود..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="fas fa-search position-absolute top-50 start-0 translate-middle-y ms-3 text-primary"></i>
            </div>
          </div>
        </div>

        {/* جدول المنتجات */}
        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-bordered align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="py-3 px-4 text-secondary fw-medium text-center">
                    #
                  </th>
                  <th className="py-3 px-4 text-secondary fw-medium text-center">
                    اسم المنتج
                  </th>
                  <th className="py-3 px-4 text-secondary fw-medium text-center">
                    الكود
                  </th>
                  <th className="py-3 px-4 text-secondary fw-medium text-center">
                    الوصف
                  </th>
                  <th className="py-3 px-4 text-secondary fw-medium text-center">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => (
                    <tr key={p.id} className="border-top">
                      <td className="px-4 fw-medium text-center">{p.id}</td>
                      <td className="px-4 fw-semibold">{p.name}</td>
                      <td>
                        <span className="badge bg-info">{p.code}</span>
                      </td>
                      <td className="px-4" style={{ maxWidth: "300px" }}>
                        <div className="text-truncate" title={p.description}>
                          {p.description}
                        </div>
                      </td>
                      <td className="text-center">
                        <Link
                          to={`edit/${p.id}`}
                          className="btn btn-sm btn-primary ms-2 px-3 py-2"
                        >
                          <i className="fas fa-edit ms-1"></i>تعديل
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="btn btn-sm btn-danger px-3 py-2"
                        >
                          <i className="fas fa-trash ms-1"></i>حذف
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      <i className="fas fa-box-open fa-2x mb-3"></i>
                      <p className="h5">لا توجد منتجات</p>
                      {searchTerm && (
                        <p className="mt-2">
                          لا يوجد نتائج لـ "<strong>{searchTerm}</strong>"
                        </p>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* الفوتر */}
        <div className="card-footer bg-white py-3 border-0">
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-muted small">
              عرض <strong>{filteredProducts.length}</strong> من{" "}
              <strong>{products.length}</strong> منتج
            </div>
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={fetchProducts}
            >
              <i className="fas fa-sync ms-1"></i> تحديث القائمة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
