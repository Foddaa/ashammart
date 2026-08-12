import { useContext, useEffect, useState } from "react";
import api from "@/api/axiosInstance";
import { UserContext } from "../context/AuthContext";

const STATUSES = ["Pending", "Active", "delivered"];

const paymentMethodMap = {
  CASH_ON_DELEVER: "Cash on Delivery",
  INSTAPAY: "Instapay",
  VODAFONE_CASH: "Vodafone Cash",
};

const statusMap = {
  Pending: "Pending",
  Active: "Active",
  delivered: "Delivered",
};

// Minimal Status Badge
const StatusBadge = ({ status }) => {
  const styles = {
    Pending: "border-amber-400 text-amber-700",
    Active: "border-blue-400 text-blue-700",
    delivered: "border-emerald-400 text-emerald-700",
  };
  const defaultStyle = "border-neutral-300 text-neutral-600";
  return (
    <span className={`inline-block border px-2.5 py-0.5 text-[10px] uppercase tracking-widest ${styles[status] || defaultStyle}`}>
      {statusMap[status] || status}
    </span>
  );
};

// Minimal Loading Skeleton
const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="flex justify-center gap-4 mb-6 border-b border-neutral-200 pb-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-8 w-24 bg-neutral-100 border border-neutral-200"></div>
      ))}
    </div>
    <div className="space-y-2 bg-white border border-neutral-200 p-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-14 bg-neutral-100 border border-neutral-200"></div>
      ))}
    </div>
  </div>
);

export default function ExecutiveOrdersPage() {
  const [authorized, setAuthorized] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("Pending");
  const { Token } = useContext(UserContext);

  // Minimal Luxury Popup State
  const [popup, setPopup] = useState({ open: false, message: "", type: "success" });

  const showPopup = (message, type = "success") => {
    setPopup({ open: true, message, type });
    setTimeout(() => setPopup((prev) => ({ ...prev, open: false })), 3500);
  };

  useEffect(() => {
    const fetchAuthorization = async () => {
      try {
        const res = await api.get("/api/executive");
        if (res.data === "success") {
          setAuthorized(true);
          fetchOrders("Pending");
        } else {
          setError("Unauthorized access.");
          setLoading(false);
        }
      } catch (err) {
        setError("Authorization failed.");
        setLoading(false);
      }
    };

    fetchAuthorization();
  }, []);

  const fetchOrders = async (status) => {
    setLoading(true);
    try {
      const res = await api.get("/api/executive/allOrders", {
        params: { status },
      });
      setOrders(res.data);
    } catch (err) {
      setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleOrderClick = async (orderId) => {
    try {
      const res = await api.get("/api/executive/byId", {
        params: { id: orderId },
      });
      setSelectedOrderDetails(res.data);
    } catch (err) {
      showPopup("Failed to fetch order details.", "error");
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await api.patch("/api/executive/updateStatus", null, {
        params: {
          id: selectedOrderDetails.orderId,
          status: newStatus,
        },
      });
      setSelectedOrderDetails(null);
      fetchOrders(activeTab);
      showPopup("Order status updated successfully!", "success");
    } catch (err) {
      showPopup("Failed to update order status.", "error");
    }
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto p-4" dir="ltr">
      <LoadingSkeleton />
    </div>
  );
  
  if (error) return (
    <div className="max-w-7xl mx-auto p-4 flex justify-center items-center min-h-[60vh]" dir="ltr">
      <div className="bg-white border border-neutral-200 p-8 text-center max-w-md">
        <div className="text-neutral-400 text-5xl mb-4 tracking-widest">✦</div>
        <p className="text-neutral-800 font-medium tracking-wide">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-6 py-2 bg-neutral-900 text-white hover:bg-neutral-800 transition-colors text-xs tracking-wider uppercase"
        >
          Retry
        </button>
      </div>
    </div>
  );

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-neutral-50" dir="ltr">
      
      {/* Minimal Luxury Floating Popup */}
      {popup.open && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-50 bg-neutral-900 border border-neutral-700 shadow-2xl px-6 py-4 flex items-center justify-between gap-6 max-w-lg w-full animate-fade-in">
          <div className="flex items-center gap-3">
            {popup.type === "success" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            )}
            <span className="text-white text-sm tracking-wide font-light">{popup.message}</span>
          </div>
          <button 
            onClick={() => setPopup({ ...popup, open: false })}
            className="text-neutral-400 hover:text-white transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200 pb-6 mb-8">
          <div>
            <h1 className="text-2xl font-light tracking-wide text-neutral-900">
              Orders Dashboard
            </h1>
            <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-1">
              Manage and monitor all orders in one place
            </p>
          </div>
        </div>

        {/* Minimal Tabs */}
        <div className="flex flex-wrap gap-6 mb-8 border-b border-neutral-200 pb-1">
          {STATUSES.map((status) => (
            <button
              key={status}
              className={`relative pb-2 border-b-2 transition-colors duration-200 text-[11px] uppercase tracking-widest whitespace-nowrap ${
                activeTab === status
                  ? "border-black text-neutral-900 font-medium"
                  : "border-transparent text-neutral-400 hover:text-neutral-700 hover:border-neutral-300"
              }`}
              onClick={() => {
                setActiveTab(status);
                fetchOrders(status);
                setSelectedOrderDetails(null);
              }}
            >
              {statusMap[status] || status}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        {orders.length === 0 ? (
          <div className="bg-white border border-neutral-200 p-12 text-center">
            <div className="text-4xl text-neutral-300 mb-4 tracking-widest">✦</div>
            <p className="text-neutral-500 text-sm tracking-wide">No orders found in this category</p>
          </div>
        ) : (
          <div className="bg-white border border-neutral-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="p-4 text-left text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Order ID</th>
                    <th className="p-4 text-left text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Customer</th>
                    <th className="p-4 text-left text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Items</th>
                    <th className="p-4 text-left text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Subtotal</th>
                    <th className="p-4 text-left text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Delivery</th>
                    <th className="p-4 text-left text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Total</th>
                    <th className="p-4 text-left text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Payment</th>
                    <th className="p-4 text-left text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Date</th>
                    <th className="p-4 text-left text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {orders.map((order) => (
                    <tr
                      key={order.orderId}
                      className="cursor-pointer hover:bg-neutral-50 transition-colors duration-150"
                      onClick={() => handleOrderClick(order.orderId)}
                    >
                      <td className="p-4 text-sm font-mono text-neutral-500">#{order.orderId}</td>
                      <td className="p-4 text-sm font-medium text-neutral-800">{order.clientName}</td>
                      <td className="p-4 text-sm text-neutral-600">
                        <ul className="list-disc pl-4 space-y-0.5">
                          {order.productNames.map((name, i) => (
                            <li key={i} className="text-neutral-500">{name}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="p-4 text-sm text-neutral-700">{order.subtotal} EGP</td>
                      <td className="p-4 text-sm text-neutral-700">{order.deliveryCost} EGP</td>
                      <td className="p-4 text-sm font-medium text-neutral-900">{order.totalCost} EGP</td>
                      <td className="p-4 text-sm">
                        <span className="inline-block border border-neutral-300 px-2 py-0.5 text-[10px] uppercase tracking-widest text-neutral-600">
                          {paymentMethodMap[order.paymentMethod] || order.paymentMethod}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-neutral-400">{order.orderDate}</td>
                      <td className="p-4">
                        <StatusBadge status={order.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Order Details Modal (Minimal Luxury) */}
        {selectedOrderDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-white border border-neutral-200 w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
              
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-neutral-200 bg-neutral-50">
                <h2 className="text-lg font-light tracking-wide text-neutral-900">
                  Order Details <span className="text-neutral-400 font-mono ml-2">#{selectedOrderDetails.orderId}</span>
                </h2>
                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  className="text-neutral-400 hover:text-neutral-900 transition-colors p-1"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="overflow-y-auto p-6 space-y-6 flex-1">
                
                {/* Order Info Cards (Sharp Edges) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-neutral-200 p-4 space-y-1 bg-white">
                    <div className="flex items-center gap-2 text-neutral-400 text-[10px] uppercase tracking-wider">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      Customer Name
                    </div>
                    <p className="text-neutral-800 font-medium pl-6">{selectedOrderDetails.clientName}</p>
                  </div>
                  <div className="border border-neutral-200 p-4 space-y-1 bg-white">
                    <div className="flex items-center gap-2 text-neutral-400 text-[10px] uppercase tracking-wider">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      Phone
                    </div>
                    <p className="text-neutral-800 font-medium pl-6">{selectedOrderDetails.clientPhone}</p>
                  </div>
                  <div className="border border-neutral-200 p-4 space-y-1 bg-white">
                    <div className="flex items-center gap-2 text-neutral-400 text-[10px] uppercase tracking-wider">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      Address
                    </div>
                    <p className="text-neutral-800 font-medium pl-6">{selectedOrderDetails.deliveryAddress.description || "N/A"}</p>
                  </div>
                  <div className="border border-neutral-200 p-4 space-y-1 bg-white">
                    <div className="flex items-center gap-2 text-neutral-400 text-[10px] uppercase tracking-wider">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                        <line x1="12" y1="22.08" x2="12" y2="12"></line>
                      </svg>
                      City
                    </div>
                    <p className="text-neutral-800 font-medium pl-6">{selectedOrderDetails.deliveryAddress?.city || "N/A"}</p>
                  </div>
                  <div className="border border-neutral-200 p-4 space-y-1 bg-white">
                    <div className="flex items-center gap-2 text-neutral-400 text-[10px] uppercase tracking-wider">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      Order Date
                    </div>
                    <p className="text-neutral-800 font-medium pl-6">{selectedOrderDetails.orderDate}</p>
                  </div>
                  <div className="border border-neutral-200 p-4 space-y-1 bg-white">
                    <div className="flex items-center gap-2 text-neutral-400 text-[10px] uppercase tracking-wider">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                      </svg>
                      Est. Delivery
                    </div>
                    <p className="text-neutral-800 font-medium pl-6">{selectedOrderDetails.estimatedDeliveryDate}</p>
                  </div>
                  <div className="border border-neutral-200 p-4 space-y-1 bg-white">
                    <div className="flex items-center gap-2 text-neutral-400 text-[10px] uppercase tracking-wider">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                        <line x1="1" y1="10" x2="23" y2="10"></line>
                      </svg>
                      Payment Method
                    </div>
                    <p className="text-neutral-800 font-medium pl-6">
                      {paymentMethodMap[selectedOrderDetails.paymentMethod] || selectedOrderDetails.paymentMethod}
                    </p>
                  </div>
                  <div className="border border-neutral-900 p-4 space-y-1 bg-neutral-100">
                    <div className="flex items-center gap-2 text-neutral-600 text-[10px] uppercase tracking-wider">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="1" x2="12" y2="23"></line>
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                      </svg>
                      Final Total
                    </div>
                    <p className="text-neutral-900 font-bold text-xl pl-6">{selectedOrderDetails.totalCost} EGP</p>
                  </div>
                </div>

                {/* Products Table Inside Modal */}
                <div className="space-y-3">
                  <h3 className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="9" cy="21" r="1"></circle>
                      <circle cx="20" cy="21" r="1"></circle>
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    Products
                  </h3>
                  <div className="border border-neutral-200 overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-neutral-50 border-b border-neutral-200">
                        <tr>
                          <th className="p-3 text-left text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Product</th>
                          <th className="p-3 text-center text-[10px] uppercase tracking-wider text-neutral-400 font-medium w-20">Qty</th>
                          <th className="p-3 text-right text-[10px] uppercase tracking-wider text-neutral-400 font-medium w-28">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {selectedOrderDetails.productNames.map((p, i) => {
                          const match = p.match(/^(.*?) x (\d+) = (\d+\.?\d*)$/);
                          const name = match?.[1] ?? p;
                          const qty = match?.[2] ?? "-";
                          const total = match?.[3] ?? "-";
                          return (
                            <tr key={i} className="hover:bg-neutral-50 transition">
                              <td className="p-3 text-sm text-neutral-700">{name}</td>
                              <td className="p-3 text-center text-sm text-neutral-600">{qty}</td>
                              <td className="p-3 text-right text-sm font-medium text-neutral-700">{total} EGP</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-neutral-200 bg-neutral-50 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Update Status:</label>
                  <select
                    value={selectedOrderDetails.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="border border-neutral-300 px-3 py-1.5 text-sm focus:outline-none focus:border-black bg-white"
                  >
                    <option disabled>Select status</option>
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {statusMap[s] || s}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  className="px-6 py-2 bg-transparent text-neutral-500 border border-neutral-200 hover:text-black hover:border-black transition-colors text-xs uppercase tracking-wider"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}