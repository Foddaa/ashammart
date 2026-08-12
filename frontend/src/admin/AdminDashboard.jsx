import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useContext } from "react";
import { UserContext } from "@/context/AuthContext";

const AdminDashboard = () => {
  const { Token, role, ready } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!ready) return; // wait for the initial silent-refresh check to finish
    if (!Token || role !== "ADMIN") {
      navigate("/login");
    }
  }, [ready, Token, role, navigate]);

  if (!ready) {
    return (
      <div dir="ltr" className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="bg-white border border-neutral-200 p-10 text-center max-w-md w-full">
          <div className="text-neutral-600 text-sm tracking-wider uppercase mb-2">Loading</div>
          <div className="w-full h-px bg-neutral-200 mt-4 animate-pulse"></div>
          <div className="mt-4 text-neutral-500 text-sm">Verifying admin privileges...</div>
        </div>
      </div>
    );
  }

  if (!Token || role !== "ADMIN") {
    return (
      <div dir="ltr" className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="bg-white border border-neutral-200 p-10 text-center max-w-md w-full">
          <div className="text-neutral-500 text-sm tracking-wider uppercase mb-2">Access Denied</div>
          <div className="mt-4 text-neutral-500 text-sm">Redirecting to login...</div>
        </div>
      </div>
    );
  }

  return (
    <div dir="ltr" className="flex min-h-screen bg-neutral-50">
      
      {/* Sidebar - Minimal Luxury Styling */}
      <aside className="w-72 bg-white border-r border-neutral-200 flex flex-col h-screen sticky top-0 p-6">
        <div className="pb-6 mb-6 border-b border-neutral-200">
          <h2 className="text-xl font-light tracking-wide text-neutral-900">
            Admin Dashboard
          </h2>
          <p className="text-[11px] uppercase tracking-widest text-neutral-400 mt-1">
            Store Management
          </p>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          <NavLink
            to="/admin/products"
            end
            className={({ isActive }) =>
              `flex items-center gap-4 px-3 py-3 text-sm transition-colors duration-200 border-l-2 ${
                isActive
                  ? "border-neutral-900 bg-neutral-100 text-neutral-900 font-medium"
                  : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-900"
              }`
            }
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
            Products
          </NavLink>

          <NavLink
            to="/admin/categories"
            end
            className={({ isActive }) =>
              `flex items-center gap-4 px-3 py-3 text-sm transition-colors duration-200 border-l-2 ${
                isActive
                  ? "border-neutral-900 bg-neutral-100 text-neutral-900 font-medium"
                  : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-900"
              }`
            }
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
            Categories
          </NavLink>

          <NavLink
            to="/admin/suppliers"
            end
            className={({ isActive }) =>
              `flex items-center gap-4 px-3 py-3 text-sm transition-colors duration-200 border-l-2 ${
                isActive
                  ? "border-neutral-900 bg-neutral-100 text-neutral-900 font-medium"
                  : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-900"
              }`
            }
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
            Suppliers
          </NavLink>

          <NavLink
            to="/admin/supplierRequests"
            className={({ isActive }) =>
              `flex items-center gap-4 px-3 py-3 text-sm transition-colors duration-200 border-l-2 ${
                isActive
                  ? "border-neutral-900 bg-neutral-100 text-neutral-900 font-medium"
                  : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-900"
              }`
            }
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              <path d="M9 12h6"></path>
              <path d="M9 16h6"></path>
            </svg>
            Supplier Requests
          </NavLink>

          <div className="border-t border-neutral-200 my-2"></div>

          <NavLink
            to="/admin/update/prices"
            className={({ isActive }) =>
              `flex items-center gap-4 px-3 py-3 text-sm transition-colors duration-200 border-l-2 ${
                isActive
                  ? "border-neutral-900 bg-neutral-100 text-neutral-900 font-medium"
                  : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-900"
              }`
            }
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="2" x2="12" y2="22"></line>
              <path d="M17 7.5C17 5 14.5 4 12 4S7 5 7 7.5C7 9.5 9.5 10 12 11s5 1.5 5 3.5c0 3-3.5 4-5 4s-5-1-5-4"></path>
            </svg>
            Update Prices
          </NavLink>

          <NavLink
            to="/admin/update/images"
            className={({ isActive }) =>
              `flex items-center gap-4 px-3 py-3 text-sm transition-colors duration-200 border-l-2 ${
                isActive
                  ? "border-neutral-900 bg-neutral-100 text-neutral-900 font-medium"
                  : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-900"
              }`
            }
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            Update Images & Media
          </NavLink>

          <div className="border-t border-neutral-200 my-2"></div>

          <NavLink
            to="/admin/realLifeImages/add"
            className={({ isActive }) =>
              `flex items-center gap-4 px-3 py-3 text-sm transition-colors duration-200 border-l-2 ${
                isActive
                  ? "border-neutral-900 bg-neutral-100 text-neutral-900 font-medium"
                  : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-900"
              }`
            }
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
              <circle cx="12" cy="13" r="4"></circle>
            </svg>
            Add Real-Life Image
          </NavLink>

          <NavLink
            to="/admin/realLifeImages"
            end
            className={({ isActive }) =>
              `flex items-center gap-4 px-3 py-3 text-sm transition-colors duration-200 border-l-2 ${
                isActive
                  ? "border-neutral-900 bg-neutral-100 text-neutral-900 font-medium"
                  : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-900"
              }`
            }
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            Real-Life Images
          </NavLink>
        </nav>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-neutral-200 text-[10px] uppercase tracking-widest text-neutral-400 text-center">
          Admin Dashboard
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminDashboard;