import React from "react";
import { Link, useNavigate } from "react-router-dom";
import useMerchantConfig from "@/hooks/useMerchantConfig";

// --- SVG Icons ---
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

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const NewsletterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

// Maps the field name used in the component -> the key stored in the database
const FOOTER_KEYS = {
  brand_name: "merchant_brand_name",
  phone_1: "merchant_contact_phone_1",
  phone_2: "merchant_contact_phone_2",
  facebook_url: "merchant_facebook_url",
  instagram_url: "merchant_instagram_url",
  twitter_url: "merchant_twitter_url",
  tiktok_url: "merchant_tiktok_url",
  whatsapp_number: "merchant_whatsapp_number",
};

const Footer = () => {
  const navigate = useNavigate();

  const { config } = useMerchantConfig(FOOTER_KEYS);

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
              <span className="text-2xl font-light tracking-widest text-neutral-900 uppercase">
                {config.brand_name}
              </span>
            </Link>
            <p className="text-sm text-neutral-500 leading-relaxed max-w-xs">
              Casual clothing for men and women. Modern, comfortable, and sustainably made.
            </p>

            {/* Social Media Links (shown only when a value exists) */}
            <div className="flex gap-3 mt-4">
              {config.facebook_url && (
                <a href={config.facebook_url} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-neutral-400 hover:text-neutral-900 transition-colors">
                  <FacebookIcon />
                </a>
              )}
              {config.instagram_url && (
                <a href={config.instagram_url} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-neutral-400 hover:text-neutral-900 transition-colors">
                  <InstagramIcon />
                </a>
              )}
              {config.twitter_url && (
                <a href={config.twitter_url} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-neutral-400 hover:text-neutral-900 transition-colors">
                  <TwitterIcon />
                </a>
              )}
              {config.tiktok_url && (
                <a href={config.tiktok_url} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-neutral-400 hover:text-neutral-900 transition-colors">
                  <TikTokIcon />
                </a>
              )}
              {config.whatsapp_number && (
                <a
                  href={`https://wa.me/${config.whatsapp_number.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="text-neutral-400 hover:text-neutral-900 transition-colors"
                >
                  <WhatsAppIcon />
                </a>
              )}
            </div>

            {/* Contact Phones */}
            {(config.phone_1 || config.phone_2) && (
              <div className="mt-4 space-y-1 text-sm text-neutral-500">
                {[config.phone_1, config.phone_2].filter(Boolean).map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone.replace(/[^\d+]/g, "")}`}
                    className="block hover:text-neutral-900 transition-colors"
                  >
                    {phone}
                  </a>
                ))}
              </div>
            )}
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
              <span className="px-2 py-1 border border-neutral-300 text-xs">Visa</span>
              <span className="px-2 py-1 border border-neutral-300 text-xs">Mastercard</span>
              <span className="px-2 py-1 border border-neutral-300 text-xs">PayPal</span>
              <span className="px-2 py-1 border border-neutral-300 text-xs">Apple Pay</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs text-neutral-400">
            <span>© {new Date().getFullYear()} {config.brand_name}. All rights reserved.</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="hover:text-neutral-900 transition-colors"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </div>

      {/* Developer Credit */}
      <div className="border-t border-neutral-200 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 text-xs text-neutral-500">
          <span>
            Website developed by <span className="font-medium text-neutral-700">Fady Osama</span>
          </span>
          <span className="hidden sm:inline text-neutral-300">|</span>
          <span>Need a software service? Get in touch:</span>
          <div className="flex items-center gap-3">
            <a
              href="mailto:ofady405@gmail.com"
              className="hover:text-neutral-900 transition-colors underline underline-offset-2"
            >
              ofady405@gmail.com
            </a>
            <a
              href="tel:+201091791339"
              className="hover:text-neutral-900 transition-colors underline underline-offset-2"
            >
              01091791339
            </a>
            <a
              href="https://wa.me/201091791339"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-900 transition-colors underline underline-offset-2"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
