import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import PaymentMethod from "./PaymentMethod";
import { clearCart } from "@/components/shared/cartService";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function OrderReview() {
  const location = useLocation();
  const { 
    cartItems = [], 
    subtotal = 0, 
    buyNow = false, 
    directProduct = null,
    clearCartAfterOrder = false,
    quantity = 1,
    comment = ""
  } = location.state || {};

  // Determine items and total
  const items = buyNow && directProduct ? [directProduct] : cartItems;
  const totalAmount = buyNow && directProduct 
    ? directProduct.price * directProduct.quantity 
    : subtotal;

  // ✅ Check if ALL items have free delivery
  const allFreeDelivery = items.length > 0 && items.every(item => item.freeDelivery === true);

  // Helper to get image URL
  const getImageUrl = (image) => {
    if (!image) return "/default-image.jpg";
    let imageUrl = image.url || image;
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) return imageUrl;
    if (imageUrl.startsWith("/api")) return `${BASE_URL}${imageUrl}`;
    return `${BASE_URL}/api${imageUrl.startsWith("/") ? "" : "/"}${imageUrl}`;
  };

  const [paymentMethod, setPaymentMethod] = useState("CASH_ON_DELEVER");
  const [city, setCity] = useState("القاهرة");
  const [description, setDescription] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [showProducts, setShowProducts] = useState(true);
  
  const [deliveryPrices, setDeliveryPrices] = useState([]);
  const [loadingPrices, setLoadingPrices] = useState(true);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (buyNow && comment) {
      setDescription(comment);
    }
  }, [buyNow, comment]);

  // Fetch delivery prices
  useEffect(() => {
    const fetchDeliveryPrices = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/public/assets/delivery/prices`);
        setDeliveryPrices(response.data);
      } catch (err) {
        console.error("Failed to fetch delivery prices:", err);
        toast.warn("تعذر تحميل أسعار التوصيل، سيتم استخدام الأسعار الافتراضية");
        setDeliveryPrices([
          { id: 1, city: "cairoAndGiza", price: 350 },
          { id: 2, city: "restOfCities", price: 500 },
        ]);
      } finally {
        setLoadingPrices(false);
      }
    };
    fetchDeliveryPrices();
  }, []);

  // Calculate delivery cost: free only if ALL items have free delivery
  useEffect(() => {
    if (deliveryPrices.length === 0) return;

    if (allFreeDelivery) {
      setDeliveryCost(0);
      return;
    }

    const cairoGizaPrice = deliveryPrices.find(item => item.city === "cairoAndGiza")?.price;
    const restPrice = deliveryPrices.find(item => item.city === "restOfCities")?.price;
    
    if (city === "القاهرة" || city === "الجيزة") {
      setDeliveryCost(cairoGizaPrice ?? 350);
    } else {
      setDeliveryCost(restPrice ?? 500);
    }
  }, [city, deliveryPrices, allFreeDelivery]);

  const handleConfirmOrder = async () => {
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
          paymentMethod,
          address: { city, description },
          deliveryCost,
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
          subtotal: totalAmount,
          total: totalAmount + deliveryCost,
          isBuyNow: buyNow,
        }
      );

      if (res.data === "تم تأكيد الطلب بنجاح" || res.data === "success") {
        toast.success("تم تأكيد الطلب بنجاح!");
        if (!buyNow || clearCartAfterOrder) {
          clearCart();
        }
        navigate("/");
      } else {
        toast.error(res.data || "فشل في تأكيد الطلب.");
      }
    } catch (err) {
      console.error("Confirm order error:", err);
      if (err.response && err.response.data) {
        toast.error(err.response.data);
      } else {
        toast.error("حدث خطأ أثناء تأكيد الطلب.");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4" dir="rtl">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {buyNow ? "مراجعة الطلب - شراء فوري" : "مراجعة الطلب"}
      </h2>

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
            {items.map((item) => {
              const imageUrl = item.images?.[0] 
                ? getImageUrl(item.images[0])
                : "/default-image.jpg";
              
              return (
                <div key={item.id} className="py-3 flex justify-between items-center">
                  <img
                    src={imageUrl}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded border"
                    onError={(e) => { e.target.src = "/default-image.jpg"; }}
                  />
                  <div className="flex-1 px-3 text-right">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm">الكمية: {item.quantity}</p>
                    {buyNow && <p className="text-xs text-blue-600">شراء فوري</p>}
                    {item.freeDelivery && (
                      <span className="text-xs text-green-600 font-semibold">🚚 توصيل مجاني</span>
                    )}
                  </div>
                  <div className="text-left">
                    <p className="text-sm">السعر: {item.price} جنيه</p>
                    <p className="text-sm font-semibold">
                      الإجمالي: {item.price * item.quantity} جنيه
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {buyNow && comment && (
          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">ملاحظات:</span> {comment}
            </p>
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">الملخص</h3>
        <p>
          الإجمالي بدون شحن: <strong>{totalAmount} جنيه</strong>
        </p>
        <p>
          تكلفة التوصيل:{" "}
          <strong>
            {loadingPrices ? "جاري التحميل..." : 
              allFreeDelivery ? "0 جنيه (🎉 توصيل مجاني)" : `${deliveryCost} جنيه`}
          </strong>
        </p>
        <p className="text-xl mt-2">
          الإجمالي الكلي:{" "}
          <strong>
            {loadingPrices ? "---" : `${totalAmount + deliveryCost} جنيه`}
          </strong>
        </p>
        {allFreeDelivery && (
          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            ✅ جميع المنتجات مشمولة بالتوصيل المجاني!
          </div>
        )}
        {!allFreeDelivery && items.some(item => item.freeDelivery === true) && (
          <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-sm">
            ⚠️ يوجد منتجات غير مشمولة بالتوصيل المجاني، سيتم تطبيق رسوم التوصيل المعتادة.
          </div>
        )}
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
              required
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
            <option value="القاهرة">القاهرة</option>
            <option value="الجيزة">الجيزة</option>
            <option value="الإسكندرية">الإسكندرية</option>
            <option value="الدقهلية">الدقهلية</option>
            <option value="البحر الأحمر">البحر الأحمر</option>
            <option value="البحيرة">البحيرة</option>
            <option value="الفيوم">الفيوم</option>
            <option value="الغربية">الغربية</option>
            <option value="الإسماعيلية">الإسماعيلية</option>
            <option value="المنوفية">المنوفية</option>
            <option value="المنيا">المنيا</option>
            <option value="القليوبية">القليوبية</option>
            <option value="الوادي الجديد">الوادي الجديد</option>
            <option value="السويس">السويس</option>
            <option value="اسوان">أسوان</option>
            <option value="اسيوط">أسيوط</option>
            <option value="بني سويف">بني سويف</option>
            <option value="بورسعيد">بورسعيد</option>
            <option value="دمياط">دمياط</option>
            <option value="الشرقية">الشرقية</option>
            <option value="جنوب سيناء">جنوب سيناء</option>
            <option value="كفر الشيخ">كفر الشيخ</option>
            <option value="مطروح">مطروح</option>
            <option value="الأقصر">الأقصر</option>
            <option value="قنا">قنا</option>
            <option value="شمال سيناء">شمال سيناء</option>
            <option value="سوهاج">سوهاج</option>
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
        {buyNow ? "تأكيد الشراء الفوري" : "تأكيد الطلب"}
      </button>
      
      <button
        onClick={() => navigate(-1)}
        className="mt-3 text-gray-600 hover:text-gray-800 text-sm w-full text-center"
      >
        العودة للخلف
      </button>
    </div>
  );
}