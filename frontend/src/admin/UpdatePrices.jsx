// src/pages/admin/UpdatePrices.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const UpdatePrices = () => {
  // Product price update state
  const [type, setType] = useState("PERCENTAGE");
  const [value, setValue] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Delivery price update state – now an array of objects
  const [deliveryPrices, setDeliveryPrices] = useState([]);
  const [deliveryLoading, setDeliveryLoading] = useState(false);
  const [fetchingDelivery, setFetchingDelivery] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch current delivery prices (list) on mount
  useEffect(() => {
    const fetchDeliveryPrices = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/admin/delivery/prices`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Expecting an array like:
        // [{ id: 1, city: "cairoAndGiza", price: 350 }, { id: 2, city: "restOfCities", price: 500 }]
        setDeliveryPrices(response.data);
      } catch (err) {
        console.error("Failed to fetch delivery prices", err);
        toast.error("❌ فشل تحميل أسعار التوصيل الحالية");
      } finally {
        setFetchingDelivery(false);
      }
    };

    fetchDeliveryPrices();
  }, [token]);

  // Handle product price update
  const handleProductSubmit = async (e) => {
    e.preventDefault();

    if (!value || isNaN(value)) {
      toast.error("❌ أدخل قيمة صحيحة");
      return;
    }

    if (Number(value) === 0) {
      toast.error("❌ لا يمكن أن تكون القيمة صفر");
      return;
    }

    if (!confirm) {
      toast.error("⚠️ يجب تأكيد العملية");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.put(
        `${BASE_URL}/api/admin/products/updatePrices`,
        {
          updatePricesType: type,
          value: Number(value),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(`✅ ${res.data}`);

      setTimeout(() => navigate("/admin"), 1500);
    } catch (err) {
      console.error(err);
      toast.error("❌ فشل تحديث الأسعار");
    } finally {
      setLoading(false);
    }
  };

  // Update price for a specific city in the local state
  const handlePriceChange = (id, newPrice) => {
    setDeliveryPrices((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, price: parseFloat(newPrice) || 0 } : item
      )
    );
  };

  // Handle delivery price update (send the whole array)
  const handleDeliverySubmit = async (e) => {
    e.preventDefault();

    // Validate all prices are non-negative numbers
    const invalid = deliveryPrices.some(
      (item) => isNaN(item.price) || item.price < 0
    );
    if (invalid) {
      toast.error("❌ يرجى إدخال أرقام صحيحة (غير سالبة) لجميع الأسعار");
      return;
    }

    try {
      setDeliveryLoading(true);
      await axios.put(
        `${BASE_URL}/api/admin/delivery/prices/update`,
        deliveryPrices, // send the full array
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      toast.success("✅ تم تحديث أسعار التوصيل بنجاح");
    } catch (err) {
      console.error(err);
      toast.error("❌ فشل تحديث أسعار التوصيل");
    } finally {
      setDeliveryLoading(false);
    }
  };

  // Helper to get user‑friendly city label
  const getCityLabel = (cityKey) => {
    const labels = {
      cairoAndGiza: "محافظتي القاهرة والجيزة",
      restOfCities: "باقي المحافظات",
      // Add more mappings if your API returns other city keys
    };
    return labels[cityKey] || cityKey;
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Product Price Update Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 transition-all duration-300">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-blue-700">💰 تعديل أسعار المنتجات</h2>
            <p className="text-gray-500 text-sm mt-1">تعديل جماعي لجميع المنتجات</p>
          </div>

          <form onSubmit={handleProductSubmit}>
            {/* Type Selection */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">نوع التعديل</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white transition"
              >
                <option value="PERCENTAGE">نسبة مئوية (%)</option>
                <option value="FIXED">قيمة ثابتة</option>
              </select>
            </div>

            {/* Value */}
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                القيمة (يمكن أن تكون سالبة)
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="مثال: 10 أو -20"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-transparent transition"
              />
            </div>

            {/* Warning */}
            <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded-xl">
              ⚠️ هذا الإجراء سيؤثر على جميع المنتجات ولا يمكن التراجع عنه
            </div>

            {/* Confirmation */}
            <div className="mb-6 flex items-center gap-2">
              <input
                type="checkbox"
                id="confirmCheckbox"
                checked={confirm}
                onChange={(e) => setConfirm(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="confirmCheckbox" className="text-gray-700 font-medium">
                أؤكد أنني أريد تنفيذ هذا التعديل
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition duration-200 shadow-md hover:shadow-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "جاري التنفيذ..." : "تنفيذ التعديل"}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-xl transition duration-200 shadow-md hover:shadow-lg text-lg"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>

        {/* Delivery Price Update Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 transition-all duration-300">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-green-700">🚚 تعديل أسعار التوصيل</h2>
            <p className="text-gray-500 text-sm mt-1">تحديد سعر التوصيل حسب المنطقة</p>
          </div>

          {fetchingDelivery ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <form onSubmit={handleDeliverySubmit}>
              {deliveryPrices.map((item) => (
                <div key={item.id} className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    سعر التوصيل لـ {getCityLabel(item.city)}
                  </label>
                  <div className="relative">
                    <span className="absolute right-3 top-2.5 text-gray-500">ج.م</span>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => handlePriceChange(item.id, e.target.value)}
                      className="w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-400 focus:border-transparent transition"
                      placeholder="مثال: 35"
                      step="0.5"
                      min="0"
                      required
                    />
                  </div>
                </div>
              ))}

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={deliveryLoading}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl transition duration-200 shadow-md hover:shadow-lg text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deliveryLoading ? "جاري التحديث..." : "تحديث أسعار التوصيل"}
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    // Re-fetch current prices to reset form
                    try {
                      setFetchingDelivery(true);
                      const response = await axios.get(`${BASE_URL}/api/admin/delivery/prices`, {
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      setDeliveryPrices(response.data);
                      toast.info("🔄 تم استعادة الأسعار الحالية");
                    } catch (err) {
                      toast.error("❌ فشل استعادة الأسعار");
                    } finally {
                      setFetchingDelivery(false);
                    }
                  }}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-xl transition duration-200 shadow-md hover:shadow-lg text-lg"
                >
                  إلغاء / استعادة
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default UpdatePrices;