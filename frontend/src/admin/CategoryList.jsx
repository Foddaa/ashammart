// src/pages/admin/CategoryList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/admin/category/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(res.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("هل أنت متأكد أنك تريد حذف هذه الفئة؟");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/api/admin/category/delete?id=${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchCategories(); // refresh list
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("فشل في حذف الفئة. قد تكون مرتبطة بمنتجات.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        <div className="card-header bg-white py-4 border-0">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <h3 className="mb-0 text-primary fw-bold">
              <i className="fas fa-tags me-2"></i>جميع الفئات
            </h3>
            <div className="position-relative w-100" style={{ maxWidth: "400px" }}>
              <input
                type="text"
                className="form-control form-control-lg border-2 border-primary rounded-pill ps-4 py-2"
                placeholder="ابحث بالاسم..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <i className="fas fa-search position-absolute top-50 end-0 translate-middle-y me-3 text-primary"></i>
            </div>
          </div>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive">
            <table className="table table-hover table-bordered align-middle mb-0">
              <thead className="bg-light">
                <tr>
                  <th className="py-3 px-4 text-secondary fw-medium text-center">ID</th>
                  <th className="py-3 px-4 text-secondary fw-medium text-center">اسم الفئة</th>
                  <th className="py-3 px-4 text-secondary fw-medium text-center">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat) => (
                    <tr key={cat.id}>
                      <td className="px-4 text-center">{cat.id}</td>
                      <td className="px-4 text-center">{cat.name}</td>
                      <td className="text-center">
                        <Link
                          to={`/admin/categories/edit/${cat.id}`}
                          className="btn btn-sm btn-primary me-2"
                        >
                          <i className="fas fa-edit me-1"></i>تعديل
                        </Link>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="btn btn-sm btn-danger"
                        >
                          <i className="fas fa-trash me-1"></i>حذف
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center py-5 text-muted">
                      <i className="fas fa-tag fa-2x mb-3"></i>
                      <p className="h5">لا توجد فئات</p>
                      {searchTerm && (
                        <p className="mt-2">
                          لا توجد نتائج لـ "<strong>{searchTerm}</strong>"
                        </p>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card-footer bg-white py-3 border-0">
          <div className="d-flex justify-content-between align-items-center">
            <div className="text-muted small">
              عرض <strong>{filteredCategories.length}</strong> من{" "}
              <strong>{categories.length}</strong> فئة
            </div>
            <button onClick={fetchCategories} className="btn btn-sm btn-outline-primary">
              <i className="fas fa-sync me-1"></i> تحديث القائمة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
