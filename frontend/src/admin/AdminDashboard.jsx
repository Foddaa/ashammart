import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(`${BASE_URL}/api/admin`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          setIsAdmin(true);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("فشل التحقق من المشرف:", error);
        navigate("/error");
      } finally {
        setIsLoading(false);
      }
    };

    verifyAdmin();
  }, [navigate]);

  if (isLoading) {
    return (
      <div dir="rtl" className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-gray-700">
          جاري التحقق من صلاحيات المشرف...
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div dir="rtl" className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="text-xl font-semibold text-red-600">
          تم رفض الوصول. جاري إعادة التوجيه...
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="flex min-h-screen bg-gray-100">
      {/* الشريط الجانبي */}
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6 text-gray-800">قائمة المشرف</h2>
        <nav className="flex flex-col gap-3">
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md text-right transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-blue-100"
              }`
            }
          >
            📦 جميع المنتجات
          </NavLink>
          <NavLink
            to="/admin/products/add"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md text-right transition-colors ${
                isActive
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-green-100"
              }`
            }
          >
            ➕ إضافة منتج
          </NavLink>
          <NavLink
            to="/admin/categories"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md text-right transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-blue-100"
              }`
            }
          >
            📂 جميع الفئات
          </NavLink>
          <NavLink
            to="/admin/categories/add"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md text-right transition-colors ${
                isActive
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-green-100"
              }`
            }
          >
            ➕ إضافة فئة
          </NavLink>
          <NavLink
            to="/admin/suppliers"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md text-right transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-blue-100"
              }`
            }
          >
            🏭 جميع الموردين
          </NavLink>
          <NavLink
            to="/admin/supplier/add"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md text-right transition-colors ${
                isActive
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-green-100"
              }`
            }
          >
            ➕ إضافة مورد
          </NavLink>
          <NavLink
            to="/admin/supplierRequests"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md text-right transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-blue-100"
              }`
            }
          >
            📋 طلبات الانضمام
          </NavLink>
          <NavLink
            to="/admin/update/prices"
            className={({ isActive }) =>
              `px-4 py-2 rounded-md text-right transition-colors ${
                isActive
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-800 hover:bg-red-100"
              }`
            }
          >
            💰 تعديل الأسعار
          </NavLink>
        </nav>
      </aside>

      {/* منطقة المحتوى */}
      <main className="flex-grow p-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">لوحة تحكم المشرف</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
