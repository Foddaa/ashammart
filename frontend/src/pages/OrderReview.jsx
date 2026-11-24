import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import api from "@/api/axiosInstance"; // ✅ centralized API client
import { UserContext } from "@/context/AuthContext";
import PaymentMethod from "./PaymentMethod";
import { clearCart } from "@/components/shared/cartService";
import FilterDropdown from "@/components/shared/FilterDropdown";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const CITIES = [
  "Cairo", "Giza", "Alexandria", "Dakahlia", "Red Sea", "Beheira", "Faiyum",
  "Gharbia", "Ismailia", "Menoufia", "Minya", "Qalyubia", "New Valley", "Suez",
  "Aswan", "Asyut", "Beni Suef", "Port Said", "Damietta", "Sharqia",
  "South Sinai", "Kafr El Sheikh", "Matrouh", "Luxor", "Qena", "North Sinai",
  "Sohag",
];
const CITY_OPTIONS = CITIES.map((c) => ({ value: c, label: c }));

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
  const [city, setCity] = useState("Cairo");
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

  // --- Signed-in customer: profile autofill + saved addresses ---
  const { Token, role } = useContext(UserContext);
  const isClient = !!Token && role === "USER";
  const [addresses, setAddresses] = useState([]);
  // id of the chosen saved address, or "new" to type a new one
  const [selectedAddressId, setSelectedAddressId] = useState("new");
  const [savingAddress, setSavingAddress] = useState(false);

  useEffect(() => {
    if (buyNow && comment) {
      setDescription(comment);
    }
  }, [buyNow, comment]);

  useEffect(() => {
    if (!isClient) {
      setAddresses([]);
      setSelectedAddressId("new");
      return;
    }
    let cancelled = false;

    api.get("/api/client/getProfile")
      .then(({ data }) => {
        if (cancelled || !data) return;
        const [first = "", ...rest] = (data.name || "").trim().split(/\s+/);
        // Only fill empty fields so we never overwrite what the customer already typed
        setFirstName((prev) => prev || first);
        setLastName((prev) => prev || rest.join(" "));
        setEmail((prev) => prev || data.email || "");
        setPhone((prev) => prev || data.phone || "");
      })
      .catch((err) => console.error("Failed to load profile:", err));

    api.get("/api/client/getAddresses")
      .then(({ data }) => {
        if (cancelled) return;
        const list = Array.isArray(data) ? data : [];
        setAddresses(list);
        if (list.length > 0) selectAddress(list[0]);
      })
      .catch((err) => console.error("Failed to load addresses:", err));

    return () => { cancelled = true; };
  }, [isClient]);

  const selectAddress = (address) => {
    setSelectedAddressId(address.id);
    if (address.city) setCity(address.city);
    setDescription(address.description || "");
  };

  const selectNewAddress = () => {
    setSelectedAddressId("new");
    setDescription(buyNow && comment ? comment : "");
  };

  const handleSaveAddress = async () => {
    if (!city || !description.trim()) {
      toast.error("Please pick a city and enter the detailed address");
      return;
    }
    setSavingAddress(true);
    try {
      const { data } = await api.post("/api/client/addAddress", {
        city,
        description: description.trim(),
      });
      setAddresses((prev) => [...prev, data]);
      selectAddress(data);
      toast.success("Address saved");
    } catch (err) {
      console.error("Failed to save address:", err);
      toast.error("Failed to save address");
    } finally {
      setSavingAddress(false);
    }
  };

  const usingSavedAddress = isClient && selectedAddressId !== "new";

  // Fetch delivery prices
  useEffect(() => {
    const fetchDeliveryPrices = async () => {
      try {
        const response = await api.get("/api/public/assets/delivery/prices");
        setDeliveryPrices(response.data);
      } catch (err) {
        console.error("Failed to fetch delivery prices:", err);
        toast.warn("Failed to load delivery prices, using default rates.");
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
    
    if (city === "Cairo" || city === "Giza") {
      setDeliveryCost(cairoGizaPrice ?? 350);
    } else {
      setDeliveryCost(restPrice ?? 500);
    }
  }, [city, deliveryPrices, allFreeDelivery]);

  const handleConfirmOrder = async () => {
    if (!firstName.trim() || !phone.trim() || !paymentMethod || !city || !description.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const res = await api.post(
        "/api/guest/confirmOrder",
        {
          firstName,
          lastName,
          email: email || null,
          phone: phone || null,
          paymentMethod,
          address: { city, description },
          addressId: usingSavedAddress ? selectedAddressId : null,
          deliveryCost,
          items: items.map((item) => ({
            variantId: item.variantId, // Included for fallback
            sku: item.sku,             // New: sends the SKU
            quantity: item.quantity,
          })),
          subtotal: totalAmount,
          total: totalAmount + deliveryCost,
          isBuyNow: buyNow,
        }
      );

      if (res.status == 200 && res.data === "Order confirmed successfully") {
        toast.success("Order confirmed successfully!");
        if (!buyNow || clearCartAfterOrder) {
          clearCart();
        }
        navigate("/");
      } else {
        toast.error(res.data || "Failed to confirm order.");
      }
    } catch (err) {
      console.error("Confirm order error:", err);
      if (err.response && err.response.data) {
        toast.error(err.response.data);
      } else {
        toast.error("An error occurred while confirming the order.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 py-8 md:py-12 px-4 md:px-6" dir="ltr">
      <div className="max-w-4xl mx-auto">
        
        {/* Minimal Luxury Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200 pb-6 mb-8 gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-light tracking-wide text-neutral-900">
              {buyNow ? "Instant Purchase Review" : "Order Review"}
            </h2>
            <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-1">
              {buyNow ? "Review your selected item" : "Review your items & shipping details"}
            </p>
          </div>
          <div className="flex items-center gap-2 mt-1 sm:mt-0 text-neutral-400">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
        </div>

        {/* Products Section */}
        <div className="bg-white border border-neutral-200 p-4 sm:p-6 mb-6">
          <div className="flex justify-between items-center border-b border-neutral-200 pb-3 mb-3">
            <h3 className="text-sm font-medium tracking-wide text-neutral-800">Products</h3>
            <button
              onClick={() => setShowProducts(!showProducts)}
              className="border border-neutral-300 px-3 py-1 text-[10px] uppercase tracking-wider text-neutral-600 hover:border-black transition-colors"
            >
              {showProducts ? "Hide" : "Show"}
            </button>
          </div>

          {showProducts && (
            <div className="divide-y divide-neutral-100">
              {items.map((item) => {
                const imageUrl = item.images?.[0] 
                  ? getImageUrl(item.images[0])
                  : "/default-image.jpg";
                
                return (
                  <div key={item.id} className="py-4 flex flex-row items-start sm:items-center gap-3 sm:gap-4 w-full">
                    
                    {/* Image wrapper */}
                    <div className="w-20 sm:w-16 aspect-[3/4] shrink-0 border border-neutral-200 bg-neutral-50 overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = "/default-image.jpg"; }}
                      />
                    </div>

                    {/* Details wrapper - Added min-w-0 to prevent overflow */}
                    <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 text-left">
                      
                      <div className="flex-1 min-w-0">
                        {/* Changed truncate to line-clamp-2 for mobile so text wraps nicely without overflowing */}
                        <p className="font-medium text-neutral-900 line-clamp-2 sm:line-clamp-none sm:whitespace-normal break-words">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-neutral-400 uppercase tracking-wider mt-0.5">
                          Qty: {item.quantity}
                          {buyNow && <span className="ml-2 border border-neutral-200 px-1.5 py-0.5 text-[9px]">Instant</span>}
                        </p>
                        
                        {/* Display Size and Color */}
                        {item.size || item.color ? (
                          <p className="text-neutral-500 text-xs mt-1">
                            {item.size && <span>Size: {item.size}</span>}
                            {item.size && item.color && <span className="mx-1 text-neutral-300">|</span>}
                            {item.color && <span>Color: {item.color}</span>}
                          </p>
                        ) : null}

                        {/* Mobile Free Delivery Badge */}
                        {item.freeDelivery && (
                          <div className="sm:hidden mt-1 flex items-center gap-1 text-[10px] text-neutral-600 uppercase tracking-wider">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="1" y="3" width="15" height="13"></rect>
                              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                              <circle cx="5.5" cy="18.5" r="2.5"></circle>
                              <circle cx="18.5" cy="18.5" r="2.5"></circle>
                            </svg>
                            Free Delivery
                          </div>
                        )}
                      </div>
                      
                      {/* Price Wrapper - shrink-0 prevents it from being squished */}
                      <div className="text-left sm:text-right shrink-0 mt-1 sm:mt-0">
                        <p className="text-sm font-medium text-neutral-900">
                          Total: {(item.price * item.quantity).toLocaleString()} EGP
                        </p>
                        <p className="text-xs text-neutral-600">
                          {item.price.toLocaleString()} EGP
                        </p>
                        {/* Desktop Free Delivery Badge */}
                        {item.freeDelivery && (
                          <div className="hidden sm:flex mt-1 items-center justify-end gap-1 text-[10px] text-neutral-600 uppercase tracking-wider">
                            <span>Free Delivery</span>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="1" y="3" width="15" height="13"></rect>
                              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                              <circle cx="5.5" cy="18.5" r="2.5"></circle>
                              <circle cx="18.5" cy="18.5" r="2.5"></circle>
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          {buyNow && comment && (
            <div className="mt-4 pt-3 border-t border-neutral-200">
              <p className="text-sm text-neutral-600 flex gap-2">
                <span className="font-medium text-neutral-700">Notes:</span>
                <span>{comment}</span>
              </p>
            </div>
          )}
        </div>

        {/* Summary Section */}
        <div className="bg-white border border-neutral-200 p-4 sm:p-6 mb-6">
          <h3 className="text-sm font-medium tracking-wide text-neutral-800 border-b border-neutral-200 pb-3 mb-3">Summary</h3>
          <div className="space-y-2 text-sm text-neutral-600">
            <p className="flex justify-between">
              <span>Cart Total</span>
              <span className="font-medium text-neutral-900">{totalAmount.toLocaleString()} EGP</span>
            </p>
            <p className="flex justify-between items-center gap-2">
              <span>Delivery Cost</span>
              <span className="font-medium text-neutral-900">
                {loadingPrices ? "Loading..." : 
                  allFreeDelivery ? "0 EGP" : `${deliveryCost.toLocaleString()} EGP`}
              </span>
            </p>
            <div className="pt-3 border-t border-neutral-200 mt-2">
              <p className="flex justify-between text-base">
                <span className="font-light text-neutral-900">Total Amount</span>
                <span className="font-medium text-neutral-900">
                  {loadingPrices ? "---" : `${(totalAmount + deliveryCost).toLocaleString()} EGP`}
                </span>
              </p>
            </div>
          </div>
          
          {/* Free Delivery Info Box */}
          {allFreeDelivery && (
            <div className="mt-4 p-3 border border-neutral-200 bg-neutral-50 flex items-start gap-3 text-sm text-neutral-700">
              <svg className="w-4 h-4 shrink-0 mt-0.5 text-neutral-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <p>All items include free delivery!</p>
            </div>
          )}
          {!allFreeDelivery && items.some(item => item.freeDelivery === true) && (
            <div className="mt-4 p-3 border border-neutral-200 bg-neutral-50 flex items-start gap-3 text-sm text-neutral-700">
              <svg className="w-4 h-4 shrink-0 mt-0.5 text-neutral-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p>Some items are not eligible for free delivery. Standard fees apply.</p>
            </div>
          )}
        </div>

        {/* Customer Information */}
        <div className="bg-white border border-neutral-200 p-4 sm:p-6 mb-6">
          <h3 className="text-sm font-medium tracking-wide text-neutral-800 border-b border-neutral-200 pb-3 mb-3">Customer Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">First Name *</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="border border-neutral-200 px-3 py-2 focus:outline-none focus:border-black bg-transparent text-sm w-full"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Last Name *</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="border border-neutral-200 px-3 py-2 focus:outline-none focus:border-black bg-transparent text-sm w-full"
                required
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Email (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-neutral-200 px-3 py-2 focus:outline-none focus:border-black bg-transparent text-sm w-full"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Phone Number *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="border border-neutral-200 px-3 py-2 focus:outline-none focus:border-black bg-transparent text-sm w-full"
                required
              />
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div className="bg-white border border-neutral-200 p-4 sm:p-6 mb-6">
          <h3 className="text-sm font-medium tracking-wide text-neutral-800 border-b border-neutral-200 pb-3 mb-3">Delivery Information</h3>
          <div className="flex flex-col gap-4">
            {/* Saved addresses (signed-in customers only) */}
            {isClient && addresses.length > 0 && (
              <div className="flex flex-col gap-2">
                <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Saved Addresses</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {addresses.map((a) => {
                    const selected = selectedAddressId === a.id;
                    return (
                      <button
                        type="button"
                        key={a.id}
                        onClick={() => selectAddress(a)}
                        className={`text-left p-3 border transition-colors ${
                          selected ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 hover:border-neutral-400"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span className={`mt-1 w-3 h-3 shrink-0 rounded-full border ${
                            selected ? "border-neutral-900 bg-neutral-900" : "border-neutral-300"
                          }`} />
                          <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-widest text-neutral-400">{a.city || "—"}</p>
                            <p className="text-sm text-neutral-800 break-words">{a.description || "—"}</p>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={selectNewAddress}
                    className={`text-left p-3 border border-dashed transition-colors text-sm ${
                      selectedAddressId === "new"
                        ? "border-neutral-900 bg-neutral-50 text-neutral-900"
                        : "border-neutral-300 text-neutral-500 hover:border-neutral-500"
                    }`}
                  >
                    + New address
                  </button>
                </div>
              </div>
            )}

            {/* Manual address entry: guests, or signed-in customers adding a new address */}
            {!usingSavedAddress && (
              <>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">City *</label>
                  <FilterDropdown value={city} onChange={setCity} options={CITY_OPTIONS} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Detailed Address *</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="border border-neutral-200 px-3 py-2 focus:outline-none focus:border-black bg-transparent text-sm w-full resize-y"
                    rows="3"
                    placeholder="e.g., Tahrir Street, next to the metro station..."
                  />
                </div>
                {isClient && (
                  <button
                    type="button"
                    onClick={handleSaveAddress}
                    disabled={savingAddress}
                    className="self-start border border-neutral-300 px-4 py-2 text-[10px] uppercase tracking-wider text-neutral-600 hover:border-black hover:text-black transition-colors disabled:opacity-50"
                  >
                    {savingAddress ? "Saving…" : "Save to my addresses"}
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Payment Method Section */}
        <div className="bg-white border border-neutral-200 p-4 sm:p-6 mb-8">
          <h3 className="text-sm font-medium tracking-wide text-neutral-800 border-b border-neutral-200 pb-3 mb-3">Payment Method</h3>
          <PaymentMethod payment={paymentMethod} setPayment={setPaymentMethod} />
        </div>

        {/* Action Buttons */}
        <button
          onClick={handleConfirmOrder}
          className="w-full bg-neutral-900 text-white py-3.5 hover:bg-neutral-800 transition-colors duration-200 border border-neutral-900 text-sm tracking-wide uppercase"
        >
          {buyNow ? "Confirm Instant Purchase" : "Confirm Order"}
        </button>
        
        <button
          onClick={() => navigate(-1)}
          className="mt-4 w-full text-neutral-400 hover:text-neutral-800 transition-colors duration-200 text-[10px] uppercase tracking-wider text-center"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}