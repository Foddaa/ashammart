import { logo } from '@/assets/images/index.js';
import { useState } from "react";
import CartWidget from './CartWidget';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import searchIcon from "@/assets/images/logos/search.ico";
import menuIcon from "@/assets/images/logos/menu.ico";

export default function HeaderSection1() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

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

        {/* Logo */}
        <Link to="/">
          <img
            src={logo}
            alt="Logo"
            className="w-[60px] h-[60px] object-cover"
          />
        </Link>

        {/* Search (Desktop) */}
        <div className="flex-1 mx-3 relative">
          <img
            src={searchIcon}
            alt="Search"
            onClick={submitSearch}
            className="absolute left-2 top-1/2 -translate-y-1/2 
              w-6 h-6 bg-gray-100 rounded-full 
              cursor-pointer opacity-70 hover:opacity-100"
          />

          <input
            type="text"
            placeholder="بتدور علي ايه ؟"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-2 pl-10 border rounded-lg text-right"
          />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
        {/* Cart */}
          <CartWidget />
          {/* Categories button */}
          <button
            onClick={handleCategoriesClick}
            className="flex items-center gap-1 px-3 py-1.5 
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