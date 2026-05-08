import { useState, useEffect } from "react";
import CartWidget from './CartWidget';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import searchIcon from "@/assets/images/logos/search.ico";
import menuIcon from "@/assets/images/logos/menu.ico";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function HeaderSection1() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [logoUrl, setLogoUrl] = useState(null);

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
    if (location.pathname === '/shop') {
      // If already on shop page, toggle sidebar via state
      navigate('/shop', { 
        state: { 
          toggleSidebar: true,
          prevPath: location.pathname,
          prevSearch: location.search
        } 
      });
    } else {
      // If not on shop page, navigate to shop with sidebar open
      navigate('/shop', { 
        state: { 
          openSidebar: true 
        } 
      });
    }
  };

  return (
    <header className="container mx-auto bg-white px-2">
      <div className="flex items-center justify-between h-[80px]">

        {/* Logo - now dynamic from database */}
        <Link to="/">
          <img
            src={logoUrl || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 24 24' fill='none' stroke='gray' stroke-width='2'%3E%3Crect x='2' y='2' width='20' height='20'/%3E%3C/svg%3E"}
            alt="Logo"
            className="w-[80px] h-[80px] object-cover"
          />
        </Link>

        {/* Search (Desktop) */}
        <div className="flex-1 mx-1 relative">
          <img
            src={searchIcon}
            alt="Search"
            onClick={submitSearch}
            className="absolute left-1 top-1/2 -translate-y-1/2 
              w-5 h-5 bg-gray-100 rounded-full 
              cursor-pointer opacity-70 hover:opacity-100"
          />
          <input
            type="text"
            placeholder="بتدور علي ايه ؟"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-2 pl-8 border rounded-lg text-right placeholder:text-xs"
          />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Cart */}
          <CartWidget />
          {/* Categories button */}
          <button
            onClick={handleCategoriesClick}
            className="flex items-center gap-1 px-1 py-1.5 
                      bg-blue-600 text-white
                      rounded-md text-sm
                      hover:bg-blue-700 transition"
          >
            <span>الأقسام</span>
            <img
              src={menuIcon}
              alt="Menu"
              className="w-3 h-3"
            />
          </button>
        </div>
      </div>
    </header>
  );
}