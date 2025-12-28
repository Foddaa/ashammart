import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../Context/AuthContext";

const BASE_URL = import.meta.env.VITE_API_BASE_URL ;
const STATUSES = ["Pending", "Active", "delivered"];

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

  if (loading) return <p className="text-center text-blue-500">جارٍ التحميل...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-7xl mx-auto p-4" dir="rtl">
      <h1 className="text-2xl font-bold mb-6 text-center">الاوردرات</h1>

      {/* Tabs */}
      <div className="flex justify-center gap-4 mb-6">
        {STATUSES.map((status) => (
          <button
            key={status}
            className={`px-4 py-2 rounded ${
              activeTab === status
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-black"
            }`}
            onClick={() => {
              setActiveTab(status);
              fetchOrders(status);
              setSelectedOrderDetails(null);
            }}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      {orders.length === 0 ? (
        <p className="text-center text-gray-500">لا يوجد طلبات.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 rounded-lg text-right">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">ID</th>
                <th className="p-2">العميل</th>
                <th className="p-2">المنتجات</th>
                <th className="p-2">المجموع</th>
                <th className="p-2">التوصيل</th>
                <th className="p-2">الإجمالي</th>
                <th className="p-2">الدفع</th>
                <th className="p-2">التاريخ</th>
                <th className="p-2">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.orderId}
                  className="border-t cursor-pointer hover:bg-gray-100 transition"
                  onClick={() => handleOrderClick(order.orderId)}
                >
                  <td className="p-2">{order.orderId}</td>
                  <td className="p-2">{order.clientName}</td>
                  <td className="p-2">
                    <ul className="list-disc pr-4">
                      {order.productNames.map((name, i) => (
                        <li key={i}>{name}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-2">{order.subtotal} ج.م</td>
                  <td className="p-2">{order.deliveryCost} ج.م</td>
                  <td className="p-2 font-bold">{order.totalCost} ج.م</td>
                  <td className="p-2">{order.paymentMethod}</td>
                  <td className="p-2">{order.orderDate}</td>
                  <td className="p-2">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white w-full max-w-3xl p-6 rounded shadow-lg overflow-y-auto max-h-[90vh]" dir="rtl">
            <h2 className="text-xl font-bold mb-4 text-center">
              تفاصيل الطلب #{selectedOrderDetails.orderId}
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-4 text-right">
              <p><strong>اسم العميل:</strong> {selectedOrderDetails.clientName}</p>
              <p><strong>الهاتف:</strong> {selectedOrderDetails.clientPhone}</p>
              <p><strong>العنوان:</strong> {selectedOrderDetails.deliveryAddress.description || "غير محدد"}</p>
              <p><strong>المدينة:</strong> {selectedOrderDetails.deliveryAddress?.city || "غير محدد"}</p>
              <p><strong>تاريخ الطلب:</strong> {selectedOrderDetails.orderDate}</p>
              <p><strong>موعد التسليم:</strong> {selectedOrderDetails.estimatedDeliveryDate}</p>
              <p><strong>طريقة الدفع:</strong> {selectedOrderDetails.paymentMethod}</p>
              <p><strong>الإجمالي:</strong> {selectedOrderDetails.totalCost} ج.م</p>
            </div>

            <div>
              <strong>المنتجات:</strong>
              <table className="w-full mt-2 border border-gray-300 text-right">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2">المنتج</th>
                    <th className="p-2 text-center">الكمية</th>
                    <th className="p-2 text-center">المجموع</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrderDetails.productNames.map((p, i) => {
                    const match = p.match(/^(.*?) x (\d+) = (\d+\.?\d*)$/);
                    const name = match?.[1] ?? p;
                    const qty = match?.[2] ?? "-";
                    const total = match?.[3] ?? "-";
                    return (
                      <tr key={i} className="border-t">
                        <td className="p-2">{name}</td>
                        <td className="p-2 text-center">{qty}</td>
                        <td className="p-2 text-center">{total} ج.م</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex items-center gap-4">
              <label className="font-semibold">تغيير الحالة:</label>
              <select
                value={selectedOrderDetails.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="border p-2 rounded"
              >
                <option disabled>اختر حالة</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="ml-auto bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
