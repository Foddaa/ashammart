import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import PaymentMethod from "./PaymentMethod";
import { clearCart } from "@/components/shared/cartService";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function OrderReview() {
  const location = useLocation();
  const { cartItems = [], subtotal = 0 } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState("CASH_ON_DELEVER");
  const [city, setCity] = useState("");
  const [description, setDescription] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [showProducts, setShowProducts] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (city === "القاهرة" || city === "الجيزة") {
      setDeliveryCost(300);
    } else if (city) {
      setDeliveryCost(500);
    } else {
      setDeliveryCost(0);
    }
  }, [city]);

  const handleConfirmOrder = async () => {
    // validation
    if (!firstName.trim() || !lastName.trim() || !phone.trim() || !paymentMethod || !city || !description.trim()) {
      toast.error("يرجى إدخال جميع البيانات المطلوبة");
      return;
    }

    try {
      const res = await axios.post(
        `${BASE_URL}/api/client/confirmOrder`,
        {
          firstName,
          lastName,
          email: email || null,
          phone: phone || null,
          paymentMethod, // "الدفع عند الاستلام" | "انستاباي" | "محفظة"
          address: {
            city,
            description,
          },
          deliveryCost,
          items: cartItems.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
          subtotal,
          total: subtotal + deliveryCost,
        }
      );

      if (res.data === "تم تأكيد الطلب بنجاح" || res.data === "success") {
        toast.success("تم تأكيد الطلب بنجاح!");
        clearCart();
        navigate("/");
      } else {
        toast.error(res.data || "فشل في تأكيد الطلب.");
      }
    } catch (err) {
      console.error("Confirm order error:", err);

      if (err.response && err.response.data) {
        // backend sent an error message
        toast.error(err.response.data);
      } else {
        toast.error("حدث خطأ أثناء تأكيد الطلب.");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4" dir="rtl">
      <h2 className="text-2xl font-bold mb-4 text-center">مراجعة الطلب</h2>

      {/* Products */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">المنتجات</h3>
          <button
            onClick={() => setShowProducts(!showProducts)}
            className="text-blue-600 text-sm hover:underline"
          >
            {showProducts ? "إخفاء" : "عرض"}
          </button>
        </div>

        {showProducts && (
          <div className="divide-y">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="py-3 flex justify-between items-center"
              >
                {/* Product Image */}
                <img
                  src={
                    item.images?.[0]?.url
                      ? `${BASE_URL}/api${item.images[0].url}`
                      : "/default-image.jpg"
                  }
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded border"
                />

                {/* Product Info */}
                <div className="flex-1 px-3 text-right">
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm">الكمية: {item.quantity}</p>
                </div>

                {/* Price Info */}
                <div className="text-left">
                  <p className="text-sm">السعر: {item.price} جنيه</p>
                  <p className="text-sm font-semibold">
                    الإجمالي: {item.price * item.quantity} جنيه
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">الملخص</h3>
        <p>
          الإجمالي بدون شحن: <strong>{subtotal} جنيه</strong>
        </p>
        <p>
          تكلفة التوصيل: <strong>{deliveryCost} جنيه</strong>
        </p>
        <p className="text-xl mt-2">
          الإجمالي الكلي: <strong>{subtotal + deliveryCost} جنيه</strong>
        </p>
      </div>

      {/* Customer Info */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">معلومات العميل</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">الاسم الأول</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">الاسم الثاني</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border rounded-lg p-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">البريد الإلكتروني (اختياري)</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg p-2"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">رقم الهاتف</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded-lg p-2"
            />
          </div>
        </div>
      </div>

      {/* Address Fields */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">معلومات التوصيل</h3>
        <div className="mb-4">
          <label className="block mb-1 font-medium">المدينة</label>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="">اختر المدينة</option>
            <option value="القاهرة">القاهرة</option>
            <option value="الجيزة">الجيزة</option>
            <option value="الإسكندرية">الإسكندرية</option>
            <option value="المنصورة">المنصورة</option>
            <option value="أسوان">أسوان</option>
            <option value="الأقصر">الأقصر</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">الوصف التفصيلي</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-lg p-2"
            rows="3"
            placeholder="مثال: شارع التحرير، بجوار محطة المترو..."
          />
        </div>
      </div>

      {/* Payment Method */}

      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <PaymentMethod payment={paymentMethod} setPayment={setPaymentMethod} />
      </div>

      <button
        onClick={handleConfirmOrder}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg w-full"
      >
        تأكيد الطلب
      </button>
    </div>
  );
}
