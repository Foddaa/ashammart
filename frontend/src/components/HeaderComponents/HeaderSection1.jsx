import { useState, useEffect, useContext } from "react";
import { useCategorySidebar } from "@/context/CategorySidebarContext";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from "@/context/AuthContext";
import { getCartItemCount } from "@/components/shared/cartService";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function HeaderSection1() {
  const { toggleSidebar } = useCategorySidebar();  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [logoUrl, setLogoUrl] = useState(null);

  // 🛒 Native Cart State
  const [itemCount, setItemCount] = useState(0);

  // Get authentication state
  const { Token, role, logout } = useContext(UserContext);
  const isAdminOrExecutive = Token && (role === 'ADMIN' || role === 'EXECUTIVE');

  // Fetch dynamic logo from public endpoint
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/public/assets/logo`);
        if (response.ok) {
          const blob = await response.blob();
          const objectUrl = URL.createObjectURL(blob);
          setLogoUrl(objectUrl);
        } else {
          console.error("Logo fetch failed:", response.status);
        }
      } catch (err) {
        console.error("Failed to load dynamic logo:", err);
      }
    };
    fetchLogo();

    // Cleanup blob URL to avoid memory leaks
    return () => {
      if (logoUrl && logoUrl.startsWith("blob:")) {
        URL.revokeObjectURL(logoUrl);
      }
    };
  }, []);

  // 🛒 Cart Count Logic (Moved into Header)
  const updateCartCount = () => {
    const count = getCartItemCount();
    setItemCount(count);
  };

  useEffect(() => {
    updateCartCount();
    const handleCartUpdate = () => updateCartCount();
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const navigateToCart = () => navigate('/Cart');

  const submitSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") submitSearch();
  };

  // Function to toggle sidebar when on shop page
   const handleCategoriesClick = () => {
    toggleSidebar(); // ✅ Just toggle it! No navigate needed!
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // If admin/executive, render simplified header (white bg, black content)
  if (isAdminOrExecutive) {
    return (
      <header className="w-full bg-white border-b border-black/10 text-black">
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between h-[80px]">
          {/* Logo */}
          <Link to="/" className="flex items-center shrink-0">
            <img
              src={logoUrl || "/dodo-logo.png"}
              alt="Logo"
              className="h-6 md:h-8 w-auto object-contain"
            />
          </Link>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-black/20 hover:bg-black/5 transition-colors rounded text-sm"
          >
            Logout
          </button>
        </div>
      </header>
    );
  }

  // Default header for non‑admin users (white bg, black content)
  return (
    <header className="w-full bg-white border-b border-black/10 text-black" dir="ltr">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between h-[80px]">

        {/* Left Group: Hamburger Menu + Logo */}
        <div className="flex items-center gap-4 md:gap-6">

          {/* Hamburger */}
          <button
            onClick={handleCategoriesClick}
            className="flex items-center justify-center w-10 h-10 hover:bg-black/5 transition-colors duration-200 rounded-none"
            aria-label="Open Menu"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          {/* Logo — cropped tight to the wordmark, so height-based sizing centers correctly */}
          <Link to="/" className="flex items-center shrink-0">
            <img
              src={logoUrl || "/dodo-logo.png"}
              alt="DODO"
              className="h-6 xs:h-7 sm:h-8 md:h-9 lg:h-10 xl:h-11 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Right: Action Icons */}
        <div className="flex items-center gap-2 md:gap-4">

          {/* 1. User Account */}
          <Link
            to={Token ? "/profile" : "/login"}
            state={Token ? {} : { from: location.pathname }}
            className="flex items-center justify-center w-10 h-10 hover:bg-black/5 transition-colors duration-200"
            aria-label={Token ? "Profile" : "Sign In"}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15.5 6a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z"></path>
              <path d="M3 20s1.5-6 9-6 9 6 9 6"></path>
            </svg>
          </Link>

          {/* 2. Search */}
          <button
            onClick={submitSearch}
            className="flex items-center justify-center w-10 h-10 hover:bg-black/5 transition-colors duration-200"
            aria-label="Search"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>

          {/* 3. Favorites (Heart) with Badge - 🎯 Conditionally routed */}
          <div className="relative">
            <Link
              to={Token ? "/favorites" : "/login"}
              state={Token ? {} : { from: location.pathname }}
              className="flex items-center justify-center w-10 h-10 hover:bg-black/5 transition-colors duration-200"
              aria-label={Token ? "Favorites" : "Sign in to view favorites"}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
            </Link>
            {/* Badge number - border matches white background so it cuts out cleanly */}
            <span className="absolute -top-0.5 -right-0.5 bg-[#d56532] text-white text-[9px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-white">
              1
            </span>
          </div>

          {/* 4. Cart Widget (Native Icon, Not using CartWidget component SVG) */}
          <div className="relative">
            <button
              onClick={navigateToCart}
              className="flex items-center justify-center w-10 h-10 hover:bg-black/5 transition-colors duration-200"
              aria-label="Shopping Cart"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </button>
            
            {/* Cart Badge - styling matches Favorites badge */}
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#d56532] text-white text-[9px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center border-2 border-white">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}