import React, { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom"; // 👈 Added Link
import api from "@/api/axiosInstance";
import { UserContext } from "@/context/AuthContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const STATUS_STYLES = {
  pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
  processing: "bg-blue-50 text-blue-700 border-blue-200",
  shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
  delivered: "bg-green-50 text-green-700 border-green-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
};

const getStatusStyle = (status) =>
  STATUS_STYLES[(status || "").toLowerCase()] ||
  "bg-neutral-50 text-neutral-600 border-neutral-200";

const formatDate = (val) => {
  if (!val) return "—";
  const d = new Date(val);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Helper for image URLs
const getImageUrl = (image) => {
  if (!image) return "/default-image.jpg";
  
  let imageUrl = image.url || image;
  if (typeof imageUrl !== "string") return "/default-image.jpg";
  
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  
  const cleanUrl = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
  
  if (cleanUrl.startsWith("/api")) {
    return `${BASE_URL}${cleanUrl}`;
  }
  
  return `${BASE_URL}/api${cleanUrl}`;
};

// ── Inline Details Component ──
const OrderInlineDetails = ({ order }) => {
  const items = order.items || [];

  return (
    <div className="pt-4 pb-2 border-t border-neutral-100 mt-4 text-sm">
      {/* Address & Payment Details */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Payment</p>
          <p className="text-neutral-800 font-medium">
            {order.paymentMethod?.replace(/_/g, " ") || "—"}
          </p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Shipping To</p>
          <p className="text-neutral-800">{order.address?.city || "—"}</p>
        </div>
        <div className="col-span-2">
          <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1">Detailed Address</p>
          <p className="text-neutral-800">{order.address?.description || "—"}</p>
        </div>
      </div>

      {/* Items List - Small Cards */}
      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-3">Order Items</p>
        
        {items.length === 0 ? (
          <p className="text-xs text-neutral-400 py-4 text-center border border-neutral-100">
            No items found in this order.
          </p>
        ) : (
          <div className="space-y-3">
            {items.map((item, idx) => {
              const imageUrl = getImageUrl(item.image);
              // Use productId if available, otherwise fallback to variantId
              const targetLink = `/product/${item.id || item.variantId}`;

              return (
                <Link
                  to={targetLink}
                  key={item.id ?? item.variantId ?? idx} 
                  className="flex items-center gap-4 p-3 border border-neutral-200 bg-white hover:border-neutral-400 hover:shadow-sm transition-all group"
                >
                  {/* Image */}
                  <div className="w-16 h-16 shrink-0 bg-neutral-100 border border-neutral-200 overflow-hidden flex items-center justify-center">
                    <img
                      src={imageUrl}
                      alt={item.name || "Product"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = "https://placehold.co/100x100?text=No+Image"; 
                      }}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate group-hover:text-neutral-600 transition-colors">
                      {item.name || `Item ${idx + 1}`}
                    </p>
                    
                    <div className="flex items-center gap-3 mt-1 text-xs text-neutral-500">
                      {item.size && (
                        <span className="flex items-center gap-1">
                          Size: <span className="font-medium text-neutral-700">{item.size}</span>
                        </span>
                      )}
                      {item.color && (
                        <span className="flex items-center gap-1">
                          Color: <span className="font-medium text-neutral-700">{item.color}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        Qty: <span className="font-medium text-neutral-700">{item.quantity}</span>
                      </span>
                    </div>
                  </div>

                  {/* Price & Arrow */}
                  <div className="text-right shrink-0 flex items-center gap-4">
                    <div>
                      <p className="text-sm font-medium text-neutral-900">
                        {Number(item.price ?? 0).toLocaleString()} EGP
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-[10px] text-neutral-400 mt-0.5">
                          {Number(item.price * item.quantity).toLocaleString()} total
                        </p>
                      )}
                    </div>
                    {/* Subtle Arrow Icon appearing on hover */}
                    <svg 
                      className="w-4 h-4 text-neutral-300 group-hover:text-neutral-900 transition-colors" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor" 
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Summary Totals */}
      <div className="space-y-2 max-w-xs ml-auto">
        <div className="flex justify-between text-neutral-500 text-xs">
          <span>Subtotal</span>
          <span>{Number(order.subtotal ?? 0).toLocaleString()} EGP</span>
        </div>
        <div className="flex justify-between text-neutral-500 text-xs">
          <span>Delivery Cost</span>
          <span>{Number(order.deliveryCost ?? 0).toLocaleString()} EGP</span>
        </div>
        <div className="flex justify-between text-sm font-medium text-neutral-900 pt-2 border-t border-neutral-200 mt-1">
          <span className="font-light">Total</span>
          <span>{Number(order.totalCost ?? 0).toLocaleString()} EGP</span>
        </div>
      </div>
    </div>
  );
};

const OrdersPage = () => {
  const { Token } = useContext(UserContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    if (!Token) return;

    const fetchOrders = async () => {
      try {
        const res = await api.get("/api/client/getOrders");
        setOrders(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [Token]);

  const toggleAccordion = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  if (loading) {
    return (
      <div className="bg-white border border-neutral-200 p-8 text-center text-neutral-400 text-sm tracking-wider">
        Loading orders…
      </div>
    );
  }

  return (
    <div className="bg-white border border-neutral-200 p-6 md:p-8">
      <div className="border-b border-neutral-200 pb-4 mb-2">
        <h1 className="text-xl font-light tracking-wide text-neutral-900">
          My Orders
        </h1>
      </div>

      {orders.length === 0 ? (
        <p className="text-sm text-neutral-400 text-center py-8">
          You haven't placed any orders yet.
        </p>
      ) : (
        <ul className="divide-y divide-neutral-200">
          {orders.map((o) => {
            const isOpen = expandedOrderId === o.id;

            return (
              <li key={o.id} className="py-4">
                {/* Order Summary Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-neutral-900">
                      Order #{o.id}
                    </p>
                    <p className="text-[11px] text-neutral-500 mt-1 flex flex-wrap items-center gap-1.5">
                      <span>{formatDate(o.orderDate)}</span>
                      <span className="text-neutral-300">•</span>
                      <span>{o.address?.city || "No City"}</span>
                      <span className="text-neutral-300">•</span>
                      <span className="font-medium text-neutral-700">
                        {Number(o.totalCost || 0).toLocaleString()} EGP
                      </span>
                    </p>
                    <p className="text-[10px] text-neutral-400 mt-1">
                      Est. Delivery: {formatDate(o.estimatedDeliveryDate)}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 sm:justify-end">
                    <span
                      className={`text-[10px] uppercase tracking-widest px-2.5 py-1 border ${getStatusStyle(
                        o.status
                      )}`}
                    >
                      {o.status || "—"}
                    </span>
                    <button
                      onClick={() => toggleAccordion(o.id)}
                      className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-neutral-400 hover:text-neutral-900 transition-colors pb-0.5 border-b border-transparent hover:border-neutral-900"
                    >
                      {isOpen ? "Hide" : "Details"}
                      <svg
                        className={`w-3 h-3 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Sliding Accordion Content */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden min-h-0">
                    <OrderInlineDetails order={o} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default OrdersPage;