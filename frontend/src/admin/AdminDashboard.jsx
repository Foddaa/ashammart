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
            Authorization: `Bearer ${token}`,
          },
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
      <div dir="rtl" className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-xl font-semibold text-gray-600">جاري التحقق من صلاحيات المشرف...</div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div dir="rtl" className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-xl font-semibold text-red-600">تم رفض الوصول. جاري إعادة التوجيه...</div>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="flex min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* الشريط الجانبي - تصميم حديث */}
      <aside className="w-72 bg-white shadow-xl rounded-l-2xl m-4 ml-0 p-5 flex flex-col">
        <div className="mb-8 pr-2">
          <h2 className="text-2xl font-bold text-blue-700 border-r-4 border-blue-600 pr-3">لوحة المشرف</h2>
          <p className="text-gray-500 text-sm mt-1 pr-3">إدارة المتجر</p>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
              }`
            }
          >
            <span className="text-xl">📦</span>
            <span className="font-medium">جميع المنتجات</span>
          </NavLink>

          <NavLink
            to="/admin/products/add"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-green-50 hover:text-green-700"
              }`
            }
          >
            <span className="text-xl">➕</span>
            <span className="font-medium">إضافة منتج</span>
          </NavLink>

          <div className="border-t border-gray-200 my-3"></div>

          <NavLink
            to="/admin/categories"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
              }`
            }
          >
            <span className="text-xl">📂</span>
            <span className="font-medium">جميع الفئات</span>
          </NavLink>

          <NavLink
            to="/admin/categories/add"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-green-50 hover:text-green-700"
              }`
            }
          >
            <span className="text-xl">➕</span>
            <span className="font-medium">إضافة فئة</span>
          </NavLink>

          <div className="border-t border-gray-200 my-3"></div>

          <NavLink
            to="/admin/suppliers"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
              }`
            }
          >
            <span className="text-xl">🏭</span>
            <span className="font-medium">جميع الموردين</span>
          </NavLink>

          <NavLink
            to="/admin/supplier/add"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-green-50 hover:text-green-700"
              }`
            }
          >
            <span className="text-xl">➕</span>
            <span className="font-medium">إضافة مورد</span>
          </NavLink>

          <div className="border-t border-gray-200 my-3"></div>

          <NavLink
            to="/admin/supplierRequests"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
              }`
            }
          >
            <span className="text-xl">📋</span>
            <span className="font-medium">طلبات الانضمام</span>
          </NavLink>

          <NavLink
            to="/admin/update/prices"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-red-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-red-50 hover:text-red-700"
              }`
            }
          >
            <span className="text-xl">💰</span>
            <span className="font-medium">تعديل الأسعار</span>
          </NavLink>
        </nav>

        {/* Optional footer in sidebar */}
        <div className="mt-8 pt-4 border-t border-gray-200 text-xs text-gray-400 text-center">
          لوحة تحكم المشرف
        </div>
      </aside>

      {/* منطقة المحتوى - بدون حاوية إضافية لتجنب تداخل التصميمات */}
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;