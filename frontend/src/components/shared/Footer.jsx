import React from "react";
import { Link, useNavigate } from "react-router-dom";

// Simple SVG icons (you can replace with react-icons or your own)
const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const PinterestIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.739a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
  </svg>
);

const NewsletterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const Footer = () => {
  const navigate = useNavigate();

  const quickLinks = [
    { label: "About Us", path: "/aboutUs" },
    { label: "Contact", path: "/contact" },
    { label: "FAQ", path: "/FAQ" },
    { label: "Shipping Info", path: "/shippingInfo" },
    { label: "Returns & Exchanges", path: "/returningAndreplacing" },
    { label: "Privacy Policy", path: "/privacyRules" },
    { label: "Terms of Service", path: "/termsOfService" },
  ];

  const categories = [
    { label: "Men's New Arrivals", path: "/shop?section=new-arrivals&gender=men" },
    { label: "Women's New Arrivals", path: "/shop?section=new-arrivals&gender=women" },
    { label: "Best Sellers", path: "/shop?section=best-sellers" },
    { label: "Sale", path: "/shop?sale=true" },
    { label: "T-Shirts", path: "/shop?category=tshirts" },
    { label: "Jeans", path: "/shop?category=jeans" },
    { label: "Dresses", path: "/shop?category=dresses" },
    { label: "Accessories", path: "/shop?category=accessories" },
  ];

  const customerService = [
    { label: "Help Center", path: "/help-center" },
    { label: "Order Tracking", path: "/order-tracking" },
    { label: "Size Guide", path: "/sizeGuide" },
    { label: "Payment Methods", path: "/payment-methods" },
  ];

  return (
    <footer className="bg-white border-t border-neutral-200 text-neutral-700">
      {/* Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">

          {/* Brand Column */}
          <div className="col-span-1 lg:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-light tracking-widest text-neutral-900">OTP</span>
            </Link>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-xs">
              Casual clothing for men and women. Modern, comfortable, and sustainably made.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" aria-label="Facebook" className="text-neutral-400 hover:text-neutral-900 transition-colors">
                <FacebookIcon />
              </a>
              <a href="#" aria-label="Instagram" className="text-neutral-400 hover:text-neutral-900 transition-colors">
                <InstagramIcon />
              </a>
              <a href="#" aria-label="Twitter" className="text-neutral-400 hover:text-neutral-900 transition-colors">
                <TwitterIcon />
              </a>
              <a href="#" aria-label="Pinterest" className="text-neutral-400 hover:text-neutral-900 transition-colors">
                <PinterestIcon />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-[10px] uppercase tracking-widest font-medium text-neutral-400 mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <button
                    onClick={() => navigate(link.path)}
                    className="hover:text-neutral-900 transition-colors"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-[10px] uppercase tracking-widest font-medium text-neutral-400 mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              {categories.map((cat) => (
                <li key={cat.path}>
                  <button
                    onClick={() => navigate(cat.path)}
                    className="hover:text-neutral-900 transition-colors"
                  >
                    {cat.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-[10px] uppercase tracking-widest font-medium text-neutral-400 mb-4">Customer Service</h3>
            <ul className="space-y-2 text-sm">
              {customerService.map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => navigate(item.path)}
                    className="hover:text-neutral-900 transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1 lg:col-span-1">
            <h3 className="text-[10px] uppercase tracking-widest font-medium text-neutral-400 mb-4">Stay in the Loop</h3>
            <p className="text-sm text-neutral-500 mb-3">
              Subscribe for exclusive offers and new arrivals.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // handle newsletter signup
                alert("Newsletter subscription (demo)");
              }}
              className="flex flex-col sm:flex-row gap-2"
            >
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 text-sm border border-neutral-300 bg-white focus:outline-none focus:border-neutral-600 transition-colors"
                required
              />
              <button
                type="submit"
                className="px-4 py-2 text-sm bg-neutral-900 text-white hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
              >
                <NewsletterIcon />
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Payment & Divider */}
      <div className="border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 text-sm text-neutral-500">
            <span>We accept</span>
            <div className="flex gap-2">
              {/* Payment icons - you can replace with actual SVG or images */}
              <span className="px-2 py-1 border border-neutral-300 text-xs">Visa</span>
              <span className="px-2 py-1 border border-neutral-300 text-xs">Mastercard</span>
              <span className="px-2 py-1 border border-neutral-300 text-xs">PayPal</span>
              <span className="px-2 py-1 border border-neutral-300 text-xs">Apple Pay</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-neutral-400">
            <span>© {new Date().getFullYear()} DODO. All rights reserved.</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="hover:text-neutral-900 transition-colors"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;