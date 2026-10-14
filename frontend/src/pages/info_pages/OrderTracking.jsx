import React, { useState } from "react";

const MOCK_ORDER = {
  orderNumber: "ORD-2026-00142",
  status: "shipped",
  placedOn: "October 8, 2026",
  estimatedDelivery: "October 12, 2026",
  paymentMethod: "Cash on Delivery",
  total: "1,850 EGP",
  items: [
    { name: "Oversized Cotton Tee — Black", size: "M", qty: 1 },
    { name: "Relaxed Fit Hoodie — Grey", size: "L", qty: 1 },
  ],
  timeline: [
    {
      key: "placed",
      label: "Order Placed",
      date: "Oct 8, 10:12 AM",
      note: "We received your order and started preparing it.",
      done: true,
    },
    {
      key: "confirmed",
      label: "Confirmed",
      date: "Oct 8, 02:40 PM",
      note: "Order confirmed and payment method verified.",
      done: true,
    },
    {
      key: "prepared",
      label: "Prepared for Shipping",
      date: "Oct 9, 09:30 AM",
      note: "Your items were packed and handed to the courier.",
      done: true,
    },
    {
      key: "shipped",
      label: "Out for Delivery",
      date: "Oct 12, 08:15 AM",
      note: "Our courier is on the way to your address.",
      done: true,
      current: true,
    },
    {
      key: "delivered",
      label: "Delivered",
      date: "Expected Oct 12",
      note: "You'll receive a call before delivery.",
      done: false,
    },
  ],
};

const STEPS = ["placed", "confirmed", "prepared", "shipped", "delivered"];

export default function OrderTracking() {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = (e) => {
    e.preventDefault();
    setError("");
    setOrder(null);

    if (!orderNumber.trim()) {
      setError("Please enter your order number.");
      return;
    }

    setLoading(true);

    // TODO: replace with real API call, e.g.
    // const res = await api.get(`/api/orders/track?number=${orderNumber}`);
    setTimeout(() => {
      // Mock: always returns the demo order for now
      setOrder(MOCK_ORDER);
      setLoading(false);
    }, 800);
  };

  const currentStepIndex = order
    ? STEPS.indexOf(order.status)
    : -1;

  return (
    <div className="w-full min-h-screen bg-white text-neutral-800" dir="ltr">
      <div className="max-w-4xl mx-auto px-4 py-10 md:py-16 space-y-16">

        {/* ── Header ── */}
        <section className="border-b border-neutral-200 pb-12">
          <p className="text-xs uppercase tracking-[4px] text-neutral-500 mb-3">
            Order Tracking
          </p>
          <h1 className="text-3xl md:text-5xl font-light tracking-tight leading-tight text-neutral-900 mb-6">
            Where's my order?
          </h1>
          <p className="text-neutral-600 leading-relaxed font-light text-[15px] max-w-2xl">
            Enter your order number below to see the current status and estimated
            delivery date. You can find your order number in the confirmation
            message we sent you.
          </p>
        </section>

        {/* ── Tracking Form ── */}
        <section>
          <form
            onSubmit={handleTrack}
            className="border border-neutral-200 p-6 md:p-8"
          >
            <label
              htmlFor="orderNumber"
              className="block text-xs uppercase tracking-[2px] text-neutral-500 mb-3"
            >
              Order Number
            </label>

            <div className="flex flex-col sm:flex-row gap-3">
              <input
                id="orderNumber"
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="e.g. ORD-2026-00142"
                className="flex-1 bg-transparent border-b border-neutral-300 focus:border-black outline-none py-3 text-sm placeholder:text-neutral-400 transition-colors font-mono tracking-wide"
              />
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 bg-neutral-900 text-white px-6 py-3 text-sm hover:bg-neutral-800 transition-colors duration-200 tracking-wider whitespace-nowrap disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                    </svg>
                    Tracking…
                  </>
                ) : (
                  <>
                    Track Order
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </>
                )}
              </button>
            </div>

            {error && (
              <p className="text-sm text-red-500 font-light mt-4">{error}</p>
            )}
          </form>
        </section>

        {/* ── Order Result ── */}
        {order && (
          <section className="space-y-8">
            {/* Summary header */}
            <div className="border border-neutral-200 p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6 pb-6 border-b border-neutral-100">
                <div>
                  <p className="text-xs uppercase tracking-[3px] text-neutral-500 mb-2">
                    Order
                  </p>
                  <p className="text-lg font-light text-neutral-900 font-mono tracking-wide">
                    {order.orderNumber}
                  </p>
                </div>
                <div className="sm:text-right">
                  <p className="text-xs uppercase tracking-[3px] text-neutral-500 mb-2">
                    Status
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm text-neutral-900">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    {order.timeline.find((t) => t.current)?.label ||
                      order.timeline[order.timeline.length - 1].label}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[2px] text-neutral-400 mb-1">
                    Placed On
                  </p>
                  <p className="text-sm text-neutral-800 font-light">
                    {order.placedOn}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[2px] text-neutral-400 mb-1">
                    Estimated Delivery
                  </p>
                  <p className="text-sm text-neutral-800 font-light">
                    {order.estimatedDelivery}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[2px] text-neutral-400 mb-1">
                    Payment
                  </p>
                  <p className="text-sm text-neutral-800 font-light">
                    {order.paymentMethod}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[2px] text-neutral-400 mb-1">
                    Total
                  </p>
                  <p className="text-sm text-neutral-800 font-light">
                    {order.total}
                  </p>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h2 className="text-xs uppercase tracking-[3px] text-neutral-500 mb-6">
                Order Timeline
              </h2>

              <div className="border border-neutral-200 p-6 md:p-8">
                <ol className="relative">
                  {order.timeline.map((step, index) => {
                    const isLast = index === order.timeline.length - 1;
                    return (
                      <li
                        key={step.key}
                        className={`relative flex gap-6 ${
                          isLast ? "" : "pb-8"
                        }`}
                      >
                        {/* Line */}
                        {!isLast && (
                          <span
                            className={`absolute left-[9px] top-6 bottom-0 w-px ${
                              step.done
                                ? "bg-neutral-900"
                                : "bg-neutral-200"
                            }`}
                          />
                        )}

                        {/* Dot */}
                        <span className="relative z-10 shrink-0 mt-1">
                          {step.done ? (
                            <span
                              className={`flex items-center justify-center w-[18px] h-[18px] rounded-full ${
                                step.current
                                  ? "bg-neutral-900 ring-4 ring-neutral-900/10"
                                  : "bg-neutral-900"
                              }`}
                            >
                              <svg
                                width="10"
                                height="10"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="white"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            </span>
                          ) : (
                            <span className="flex items-center justify-center w-[18px] h-[18px] rounded-full border border-neutral-300 bg-white" />
                          )}
                        </span>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                            <h3
                              className={`text-[15px] font-light ${
                                step.done
                                  ? "text-neutral-900"
                                  : "text-neutral-400"
                              }`}
                            >
                              {step.label}
                              {step.current && (
                                <span className="ml-3 text-[10px] uppercase tracking-[2px] text-neutral-500">
                                  In Progress
                                </span>
                              )}
                            </h3>
                            <span
                              className={`text-xs tracking-wide ${
                                step.done
                                  ? "text-neutral-500"
                                  : "text-neutral-400"
                              }`}
                            >
                              {step.date}
                            </span>
                          </div>
                          <p
                            className={`text-sm leading-relaxed font-light ${
                              step.done
                                ? "text-neutral-600"
                                : "text-neutral-400"
                            }`}
                          >
                            {step.note}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>

            {/* Items */}
            <div>
              <h2 className="text-xs uppercase tracking-[3px] text-neutral-500 mb-6">
                Items in This Order
              </h2>

              <div className="border border-neutral-200 divide-y divide-neutral-100">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between gap-4 p-6"
                  >
                    <div>
                      <p className="text-sm text-neutral-900 font-light mb-1">
                        {item.name}
                      </p>
                      <p className="text-xs text-neutral-500 font-light">
                        Size {item.size} · Qty {item.qty}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── Help ── */}
        <section>
          <h2 className="text-xs uppercase tracking-[3px] text-neutral-500 mb-5">
            Need Help?
          </h2>
          <div className="border-t border-neutral-200 pt-6 space-y-4">
            <p className="text-neutral-600 leading-relaxed font-light text-[15px]">
              If you can't find your order number, or if your tracking status
              hasn't changed in over 48 hours, reach out and we'll look into it
              right away.
            </p>
            <p className="text-neutral-600 leading-relaxed font-light text-[15px]">
              For faster help, include the phone number used at checkout.
            </p>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="border-t border-neutral-200 pt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-light text-neutral-900 mb-2">
              Can't track your order?
            </h3>
            <p className="text-sm text-neutral-500 font-light">
              We'll find it for you — just send us the details.
            </p>
          </div>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 text-sm hover:bg-neutral-800 transition-colors duration-200 tracking-wider whitespace-nowrap"
          >
            Contact Us
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </section>

      </div>
    </div>
  );
}