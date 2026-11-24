import React, { useContext, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "@/context/AuthContext";

const LINKS = [
  { to: "/profile", label: "Profile Info", end: true },
  { to: "/profile/addresses", label: "My Addresses" },
  { to: "/profile/orders", label: "My Orders" },
];

const ProfileLayout = () => {
  const { Token, logout } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!Token) navigate("/login");
  }, [Token, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="bg-white border border-neutral-200 p-4 h-fit">
          <h2 className="text-[10px] uppercase tracking-widest text-neutral-400 mb-3 px-2">
            My Account
          </h2>
          <nav className="flex flex-col">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `px-2 py-2 text-sm tracking-wide border-l-2 transition-colors ${
                    isActive
                      ? "border-neutral-900 text-neutral-900"
                      : "border-transparent text-neutral-500 hover:text-neutral-900"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <button
              onClick={handleLogout}
              className="mt-3 px-2 py-2 text-left text-sm tracking-wide text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors border-l-2 border-transparent hover:border-red-500"
            >
              Logout
            </button>
          </nav>
        </aside>

        {/* Content */}
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ProfileLayout;