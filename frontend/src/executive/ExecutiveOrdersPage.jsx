import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../Context/AuthContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ;
const STATUSES = ["Pending", "Active", "delivered"];

// Translation maps
const paymentMethodMap = {
  CASH_ON_DELEVER: "الدفع عند الاستلام",
  INSTAPAY: "انستنباي",
  VODAFONE_CASH: "فودافون كاش",
};

const statusMap = {
  Pending: "قيد الانتظار",
  Active: "نشط",
  delivered: "تم التوصيل",
};

// Status badge component
const StatusBadge = ({ status }) => {
  const styles = {
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Active: "bg-blue-100 text-blue-800 border-blue-200",
    delivered: "bg-green-100 text-green-800 border-green-200",
  };
  const defaultStyle = "bg-gray-100 text-gray-800 border-gray-200";
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${styles[status] || defaultStyle}`}>
      {statusMap[status] || status}
    </span>
  );
};

// Loading skeleton
const LoadingSkeleton = () => (
  <div className="animate-pulse space-y-4">
    <div className="flex justify-center gap-4 mb-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-10 w-24 bg-gray-200 rounded-full"></div>
      ))}
    </div>
    <div className="space-y-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-16 bg-gray-100 rounded-lg"></div>
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
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchAuthorization = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/executive`, {
          headers: { Authorization: `Bearer ${Token}` },
        });

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
      const res = await axios.get(`${BASE_URL}/api/executive/allOrders`, {
        headers: { Authorization: `Bearer ${token}` },
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
      const res = await axios.get(`${BASE_URL}/api/executive/byId`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { id: orderId },
      });
      setSelectedOrderDetails(res.data);
    } catch (err) {
      alert("Failed to fetch order details.");
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.patch(`${BASE_URL}/api/executive/updateStatus`, null, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          id: selectedOrderDetails.orderId,
          status: newStatus,
        },
      });
      setSelectedOrderDetails(null);
      fetchOrders(activeTab);
    } catch (err) {
      alert("Failed to update order status.");
    }
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto p-4" dir="rtl">
      <LoadingSkeleton />
    </div>
  );
  
  if (error) return (
    <div className="max-w-7xl mx-auto p-4 flex justify-center items-center min-h-[60vh]" dir="rtl">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center max-w-md">
        <div className="text-red-500 text-5xl mb-4">⚠️</div>
        <p className="text-red-600 font-medium">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          إعادة المحاولة
        </button>
      </div>
    </div>
  );

  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" dir="rtl">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            لوحة تحليل الطلبات
          </h1>
          <p className="text-gray-500">إدارة ومتابعة جميع الطلبات في مكان واحد</p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-8">
          {STATUSES.map((status) => (
            <button
              key={status}
              className={`px-6 py-2.5 rounded-full font-medium transition-all duration-200 transform hover:scale-105 ${
                activeTab === status
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200"
                  : "bg-white text-gray-600 hover:bg-gray-50 shadow-sm border border-gray-200"
              }`}
              onClick={() => {
                setActiveTab(status);
                fetchOrders(status);
                setSelectedOrderDetails(null);
              }}
            >
              {status === "Pending" && "⏳ قيد الانتظار"}
              {status === "Active" && "🚀 نشط"}
              {status === "delivered" && "✅ تم التوصيل"}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-400 text-lg">لا يوجد طلبات في هذه الفئة</p>
            <p className="text-gray-300 text-sm mt-1">سيتم عرض الطلبات هنا عند توفرها</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="p-4 text-right text-sm font-semibold text-gray-600">رقم الطلب</th>
                    <th className="p-4 text-right text-sm font-semibold text-gray-600">العميل</th>
                    <th className="p-4 text-right text-sm font-semibold text-gray-600">المنتجات</th>
                    <th className="p-4 text-right text-sm font-semibold text-gray-600">المجموع</th>
                    <th className="p-4 text-right text-sm font-semibold text-gray-600">التوصيل</th>
                    <th className="p-4 text-right text-sm font-semibold text-gray-600">الإجمالي</th>
                    <th className="p-4 text-right text-sm font-semibold text-gray-600">الدفع</th>
                    <th className="p-4 text-right text-sm font-semibold text-gray-600">التاريخ</th>
                    <th className="p-4 text-right text-sm font-semibold text-gray-600">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <tr
                      key={order.orderId}
                      className="cursor-pointer hover:bg-blue-50/30 transition-colors duration-150 group"
                      onClick={() => handleOrderClick(order.orderId)}
                    >
                      <td className="p-4 text-sm font-mono text-gray-700">#{order.orderId}</td>
                      <td className="p-4 text-sm font-medium text-gray-800">{order.clientName}</td>
                      <td className="p-4 text-sm text-gray-600">
                        <ul className="list-disc pr-4 space-y-0.5">
                          {order.productNames.map((name, i) => (
                            <li key={i} className="text-gray-600">{name}</li>
                          ))}
                        </ul>
                      </td>
                      <td className="p-4 text-sm text-gray-700">{order.subtotal} ج.م</td>
                      <td className="p-4 text-sm text-gray-700">{order.deliveryCost} ج.م</td>
                      <td className="p-4 text-sm font-bold text-gray-900">{order.totalCost} ج.م</td>
                      <td className="p-4 text-sm">
                        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
                          {paymentMethodMap[order.paymentMethod] || order.paymentMethod}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-gray-500">{order.orderDate}</td>
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

        {/* Order Details Modal */}
        {selectedOrderDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
              {/* Modal Header */}
              <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h2 className="text-xl font-bold text-gray-800">
                  📋 تفاصيل الطلب #{selectedOrderDetails.orderId}
                </h2>
                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Modal Body */}
              <div className="overflow-y-auto p-6 space-y-6 max-h-[calc(90vh-180px)]">
                {/* Order Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <span className="text-lg">👤</span> <span>اسم العميل</span>
                    </div>
                    <p className="text-gray-800 font-medium pr-6">{selectedOrderDetails.clientName}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <span className="text-lg">📞</span> <span>رقم الهاتف</span>
                    </div>
                    <p className="text-gray-800 font-medium pr-6">{selectedOrderDetails.clientPhone}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <span className="text-lg">📍</span> <span>العنوان</span>
                    </div>
                    <p className="text-gray-800 font-medium pr-6">{selectedOrderDetails.deliveryAddress.description || "غير محدد"}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <span className="text-lg">🏙️</span> <span>المدينة</span>
                    </div>
                    <p className="text-gray-800 font-medium pr-6">{selectedOrderDetails.deliveryAddress?.city || "غير محدد"}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <span className="text-lg">📅</span> <span>تاريخ الطلب</span>
                    </div>
                    <p className="text-gray-800 font-medium pr-6">{selectedOrderDetails.orderDate}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <span className="text-lg">🚚</span> <span>موعد التسليم</span>
                    </div>
                    <p className="text-gray-800 font-medium pr-6">{selectedOrderDetails.estimatedDeliveryDate}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <span className="text-lg">💳</span> <span>طريقة الدفع</span>
                    </div>
                    <p className="text-gray-800 font-medium pr-6">
                      {paymentMethodMap[selectedOrderDetails.paymentMethod] || selectedOrderDetails.paymentMethod}
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 space-y-2 border border-blue-100">
                    <div className="flex items-center gap-2 text-blue-700 text-sm">
                      <span className="text-lg">💰</span> <span>الإجمالي النهائي</span>
                    </div>
                    <p className="text-blue-800 font-bold text-xl pr-6">{selectedOrderDetails.totalCost} ج.م</p>
                  </div>
                </div>

                {/* Products Table */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-700 flex items-center gap-2">
                    <span className="text-lg">🛒</span> المنتجات
                  </h3>
                  <div className="border border-gray-200 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="p-3 text-right text-sm font-semibold text-gray-600">المنتج</th>
                          <th className="p-3 text-center text-sm font-semibold text-gray-600 w-24">الكمية</th>
                          <th className="p-3 text-center text-sm font-semibold text-gray-600 w-32">المجموع</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {selectedOrderDetails.productNames.map((p, i) => {
                          const match = p.match(/^(.*?) x (\d+) = (\d+\.?\d*)$/);
                          const name = match?.[1] ?? p;
                          const qty = match?.[2] ?? "-";
                          const total = match?.[3] ?? "-";
                          return (
                            <tr key={i} className="hover:bg-gray-50 transition">
                              <td className="p-3 text-sm text-gray-700">{name}</td>
                              <td className="p-3 text-center text-sm text-gray-600">{qty}</td>
                              <td className="p-3 text-center text-sm font-medium text-gray-700">{total} ج.م</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <label className="font-semibold text-gray-700 text-sm">تغيير الحالة:</label>
                  <select
                    value={selectedOrderDetails.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none bg-white"
                  >
                    <option disabled>اختر حالة</option>
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s === "Pending" && "⏳ قيد الانتظار"}
                        {s === "Active" && "🚀 نشط"}
                        {s === "delivered" && "✅ تم التوصيل"}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => setSelectedOrderDetails(null)}
                  className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all shadow-sm hover:shadow-md"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}