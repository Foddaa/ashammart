// src/pages/admin/SupplierList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SupplierList = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSuppliers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/api/admin/supplier/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuppliers(res.data);
    } catch (error) {
      console.error("Error fetching suppliers:", error);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("هل أنت متأكد أنك تريد حذف هذا المورد؟");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${BASE_URL}/api/admin/supplier/delete?id=${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSuppliers();
    } catch (error) {
      console.error("Error deleting supplier:", error);
      alert("فشل في حذف المورد. ربما يكون مرتبطًا بمنتجات.");
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const filteredSuppliers = suppliers.filter((sup) =>
    sup.name.toLowerCase().includes(searchTerm.toLowerCase())||sup.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mt-4">
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        <div className="card-header bg-white py-4 border-0">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
            <h3 className="mb-0 text-primary fw-bold">
              <i className="fas fa-industry me-2"></i>جميع الموردين
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
                  <th className="py-3 px-4 text-secondary fw-medium text-center">اسم المورد</th>
                  <th className="py-3 px-4 text-secondary fw-medium text-center">الكود</th>
                  <th className="py-3 px-4 text-secondary fw-medium text-center">العنوان</th>
                  <th className="py-3 px-4 text-secondary fw-medium text-center">اوامر</th>
                </tr>
              </thead>
              <tbody>
                {filteredSuppliers.length > 0 ? (
                  filteredSuppliers.map((sup) => (
                    <tr key={sup.id}>
                      <td className="px-4 text-center">{sup.id}</td>
                      <td className="px-4 text-center">{sup.name}</td>
                      <td className="px-4 text-center">{sup.code}</td>
                      <td className="px-4 text-center">{sup.address}</td>

                      <td className="text-center">
                        <Link
                          to={`/admin/supplier/edit/${sup.id}`}
                          className="btn btn-sm btn-primary me-2"
                        >
                          <i className="fas fa-edit me-1"></i>تعديل
                        </Link>
                        <button
                          onClick={() => handleDelete(sup.id)}
                          className="btn btn-sm btn-danger"
                        >
                          <i className="fas fa-trash me-1"></i>حذف
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      <i className="fas fa-industry fa-2x mb-3"></i>
                      <p className="h5">لا توجد موردين</p>
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
              عرض <strong>{filteredSuppliers.length}</strong> من{" "}
              <strong>{suppliers.length}</strong> مورد
            </div>
            <button onClick={fetchSuppliers} className="btn btn-sm btn-outline-primary">
              <i className="fas fa-sync me-1"></i> تحديث القائمة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupplierList;
