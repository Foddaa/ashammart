import React, { useState, useEffect } from "react";
import api from "@/api/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import FilterDropdown from "@/components/shared/FilterDropdown";

const UpdatePrices = () => {
  // Product price update state
  const [type, setType] = useState("PERCENTAGE");
  const [value, setValue] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  // Delivery price update state
  const [deliveryPrices, setDeliveryPrices] = useState([]);
  const [deliveryLoading, setDeliveryLoading] = useState(false);
  const [fetchingDelivery, setFetchingDelivery] = useState(true);

  const navigate = useNavigate();

  // Dropdown options for update type
  const updateTypeOptions = [
    { value: "PERCENTAGE", label: "Percentage (%)" },
    { value: "FIXED", label: "Fixed Amount" },
  ];

  // Fetch current delivery prices (list) on mount
  useEffect(() => {
    const fetchDeliveryPrices = async () => {
      try {
        const response = await api.get("/api/admin/delivery/prices");
        setDeliveryPrices(response.data);
      } catch (err) {
        console.error("Failed to fetch delivery prices", err);
        toast.error("❌ Failed to load current delivery prices");
      } finally {
        setFetchingDelivery(false);
      }
    };

    fetchDeliveryPrices();
  }, []);

  // Handle product price update
  const handleProductSubmit = async (e) => {
    e.preventDefault();

    if (!value || isNaN(value)) {
      toast.error("❌ Please enter a valid number");
      return;
    }

    if (Number(value) === 0) {
      toast.error("❌ Value cannot be zero");
      return;
    }

    if (!confirm) {
      toast.error("⚠️ Please confirm the action");
      return;
    }

    try {
      setLoading(true);

      const res = await api.put("/api/admin/products/updatePrices", {
        updatePricesType: type,
        value: Number(value),
      });

      toast.success(`✅ ${res.data}`);

      setTimeout(() => navigate("/admin"), 1500);
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update prices");
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

    const invalid = deliveryPrices.some(
      (item) => isNaN(item.price) || item.price < 0
    );
    if (invalid) {
      toast.error("❌ Please enter valid non-negative numbers for all prices");
      return;
    }

    try {
      setDeliveryLoading(true);
      await api.put("/api/admin/delivery/prices/update", deliveryPrices);
      toast.success("✅ Delivery prices updated successfully");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to update delivery prices");
    } finally {
      setDeliveryLoading(false);
    }
  };

  // Helper to get user‑friendly city label
  const getCityLabel = (cityKey) => {
    const labels = {
      cairoAndGiza: "Cairo & Giza Governorates",
      restOfCities: "Other Governorates",
    };
    return labels[cityKey] || cityKey;
  };

  return (
    <div dir="ltr" className="min-h-screen bg-neutral-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Product Price Update Card */}
        <div className="bg-white border border-neutral-200 p-6 md:p-8 transition-all duration-300">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200 pb-6 mb-8">
            <div>
              <h2 className="text-xl font-light tracking-wide text-neutral-900">
                Update Product Prices
              </h2>
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-1">
                Bulk update for all products
              </p>
            </div>
            <div className="flex items-center gap-2 mt-3 sm:mt-0 text-neutral-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="2" x2="12" y2="22"></line>
                <path d="M17 7.5C17 5 14.5 4 12 4S7 5 7 7.5C7 9.5 9.5 10 12 11s5 1.5 5 3.5c0 3-3.5 4-5 4s-5-1-5-4"></path>
              </svg>
            </div>
          </div>

          <form onSubmit={handleProductSubmit}>
            {/* Type Selection — now using FilterDropdown */}
            <div className="flex flex-col gap-1.5 mb-4">
              <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
                Update Type
              </label>
              <FilterDropdown
                value={type}
                onChange={setType}
                options={updateTypeOptions}
              />
            </div>

            {/* Value */}
            <div className="flex flex-col gap-1.5 mb-4">
              <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
                Value (can be negative)
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="e.g., 10 or -20"
                className="w-full border border-neutral-200 px-4 py-2.5 focus:outline-none focus:border-black bg-transparent text-sm placeholder:text-neutral-400"
              />
            </div>

            {/* Warning */}
            <div className="mb-4 border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
              ⚠️ This action will affect all products and cannot be undone.
            </div>

            {/* Confirmation - Minimal Checkbox */}
            <div className="mb-6 flex items-center gap-3">
              <label className="relative flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  id="confirmCheckbox"
                  checked={confirm}
                  onChange={(e) => setConfirm(e.target.checked)}
                  className="peer h-4 w-4 cursor-pointer border border-neutral-300 bg-white checked:bg-neutral-900 checked:border-neutral-900 appearance-none"
                />
                <svg
                  className="absolute left-[1px] top-[1px] opacity-0 peer-checked:opacity-100 pointer-events-none w-3.5 h-3.5 text-white"
                  fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </label>
              <label htmlFor="confirmCheckbox" className="text-sm text-neutral-700 cursor-pointer font-light tracking-wide">
                I confirm I want to perform this update.
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-neutral-900 text-white py-3.5 hover:bg-neutral-800 transition-colors duration-200 border border-neutral-900 text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Processing..." : "Apply Update"}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 bg-transparent text-neutral-500 border border-neutral-200 py-3.5 hover:text-black hover:border-black transition-colors duration-200 text-sm tracking-wide"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* Delivery Price Update Card */}
        <div className="bg-white border border-neutral-200 p-6 md:p-8 transition-all duration-300">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-neutral-200 pb-6 mb-8">
            <div>
              <h2 className="text-xl font-light tracking-wide text-neutral-900">
                Update Delivery Prices
              </h2>
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-1">
                Set delivery prices by region
              </p>
            </div>
            <div className="flex items-center gap-2 mt-3 sm:mt-0 text-neutral-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13"></rect>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
                <circle cx="5.5" cy="18.5" r="2.5"></circle>
                <circle cx="18.5" cy="18.5" r="2.5"></circle>
              </svg>
            </div>
          </div>

          {fetchingDelivery ? (
            <div className="flex justify-center py-8">
              <div className="w-6 h-6 border border-neutral-300 border-t-neutral-900 rounded-full animate-spin"></div>
            </div>
          ) : (
            <form onSubmit={handleDeliverySubmit}>
              {deliveryPrices.map((item) => (
                <div key={item.id} className="flex flex-col gap-1.5 mb-4">
                  <label className="text-[11px] uppercase tracking-wider text-neutral-400 font-medium">
                    Delivery price for {getCityLabel(item.city)}
                  </label>
                  <div className="relative flex items-center border border-neutral-200 focus-within:border-black bg-transparent transition-colors">
                    <span className="absolute left-3 text-sm text-neutral-500 font-light tracking-wider">EGP</span>
                    <input
                      type="number"
                      value={item.price}
                      onChange={(e) => handlePriceChange(item.id, e.target.value)}
                      className="w-full px-4 py-2.5 pl-12 focus:outline-none bg-transparent text-sm placeholder:text-neutral-400"
                      placeholder="0.00"
                      step="0.5"
                      min="0"
                      required
                    />
                  </div>
                </div>
              ))}

              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <button
                  type="submit"
                  disabled={deliveryLoading}
                  className="flex-1 bg-neutral-900 text-white py-3.5 hover:bg-neutral-800 transition-colors duration-200 border border-neutral-900 text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deliveryLoading ? "Updating..." : "Update Delivery Prices"}
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      setFetchingDelivery(true);
                      const response = await api.get("/api/admin/delivery/prices");
                      setDeliveryPrices(response.data);
                      toast.info("🔄 Prices restored");
                    } catch (err) {
                      toast.error("❌ Failed to restore prices");
                    } finally {
                      setFetchingDelivery(false);
                    }
                  }}
                  className="flex-1 bg-transparent text-neutral-500 border border-neutral-200 py-3.5 hover:text-black hover:border-black transition-colors duration-200 text-sm tracking-wide"
                >
                  Reset
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
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default UpdatePrices;