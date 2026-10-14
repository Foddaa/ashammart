import React from "react";

export default function ShippingInfo() {
  return (
    <div className="w-full min-h-screen bg-white text-neutral-800" dir="ltr">
      <div className="max-w-4xl mx-auto px-4 py-10 md:py-16 space-y-16">

        {/* ── Header ── */}
        <section className="border-b border-neutral-200 pb-12">
          <p className="text-xs uppercase tracking-[4px] text-neutral-500 mb-3">
            Shipping Policy
          </p>
          <h1 className="text-3xl md:text-5xl font-light tracking-tight leading-tight text-neutral-900 mb-6">
            Shipping & Delivery.
          </h1>
          <p className="text-neutral-600 leading-relaxed font-light text-[15px] max-w-2xl">
            Everything you need to know about how, when, and where your order
            will arrive. We ship across Egypt — with clear timelines and no
            surprises.
          </p>
        </section>

        {/* ── Where We Ship ── */}
        <section>
          <h2 className="text-xs uppercase tracking-[3px] text-neutral-500 mb-5">
            Where We Ship
          </h2>
          <div className="border-t border-neutral-200 pt-6 space-y-4">
            <p className="text-neutral-600 leading-relaxed font-light text-[15px]">
              We deliver to <span className="text-neutral-900">all governorates across Egypt</span>.
              From Cairo and Giza to Alexandria, Mansoura, Aswan, and everywhere in between —
              if it's on the map, we can usually reach it.
            </p>
            <p className="text-neutral-600 leading-relaxed font-light text-[15px]">
              Please note that we <span className="text-neutral-900">cannot deliver to small remote villages
              or unnamed rural areas</span> that are not covered by our courier partners. If your address
              falls outside the coverage zone, our team will contact you before confirming the order.
            </p>
          </div>
        </section>

        {/* ── Delivery Times ── */}
        <section>
          <h2 className="text-xs uppercase tracking-[3px] text-neutral-500 mb-5">
            Delivery Times
          </h2>
          <div className="border-t border-neutral-200 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="border border-neutral-200 p-6">
                <p className="text-2xl font-light text-neutral-900 mb-2">2–3</p>
                <p className="text-xs uppercase tracking-[2px] text-neutral-500 mb-3">
                  Business Days
                </p>
                <p className="text-sm text-neutral-600 font-light leading-relaxed">
                  Cairo & Giza
                </p>
              </div>

              <div className="border border-neutral-200 p-6">
                <p className="text-2xl font-light text-neutral-900 mb-2">3–5</p>
                <p className="text-xs uppercase tracking-[2px] text-neutral-500 mb-3">
                  Business Days
                </p>
                <p className="text-sm text-neutral-600 font-light leading-relaxed">
                  Other governorates
                </p>
              </div>

              <div className="border border-neutral-200 p-6">
                <p className="text-2xl font-light text-neutral-900 mb-2">24h</p>
                <p className="text-xs uppercase tracking-[2px] text-neutral-500 mb-3">
                  Response
                </p>
                <p className="text-sm text-neutral-600 font-light leading-relaxed">
                  For order updates & issues
                </p>
              </div>

            </div>

            <p className="text-neutral-600 leading-relaxed font-light text-[15px] mt-6">
              After your order is prepared, an additional{" "}
              <span className="text-neutral-900">3 to 5 days</span> may be added for the
              courier to complete delivery, depending on your location. You'll be
              contacted before delivery so you know exactly when to expect it.
            </p>
          </div>
        </section>

        {/* ── Shipping Cost ── */}
        <section>
          <h2 className="text-xs uppercase tracking-[3px] text-neutral-500 mb-5">
            Shipping Cost
          </h2>
          <div className="border-t border-neutral-200 pt-6 space-y-4">
            <p className="text-neutral-600 leading-relaxed font-light text-[15px]">
              Shipping fees are calculated at checkout based on your governorate.
              Orders above our free-shipping threshold qualify for{" "}
              <span className="text-neutral-900">free delivery</span> automatically.
            </p>
            <p className="text-neutral-600 leading-relaxed font-light text-[15px]">
              Cash on Delivery (COD) is available everywhere we ship, with no extra fee.
            </p>
          </div>
        </section>

        {/* ── Order Tracking ── */}
        <section>
          <h2 className="text-xs uppercase tracking-[3px] text-neutral-500 mb-5">
            Order Tracking
          </h2>
          <div className="border-t border-neutral-200 pt-6 space-y-4">
            <p className="text-neutral-600 leading-relaxed font-light text-[15px]">
              Once your order is confirmed, you'll receive an order number. You can
              use it to check status at any time by contacting our support team via
              WhatsApp or email.
            </p>
            <p className="text-neutral-600 leading-relaxed font-light text-[15px]">
              On the day of delivery, our courier will call you to confirm the
              address and time window.
            </p>
          </div>
        </section>

        {/* ── Missed Delivery ── */}
        <section>
          <h2 className="text-xs uppercase tracking-[3px] text-neutral-500 mb-5">
            Missed Delivery
          </h2>
          <div className="border-t border-neutral-200 pt-6 space-y-4">
            <p className="text-neutral-600 leading-relaxed font-light text-[15px]">
              If you miss the courier's call or aren't available at the address,
              we'll attempt delivery one more time. After two failed attempts, the
              order may be returned to us and a re-shipping fee will apply.
            </p>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="border-t border-neutral-200 pt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-light text-neutral-900 mb-2">
              Have a shipping question?
            </h3>
            <p className="text-sm text-neutral-500 font-light">
              We're happy to help — reach out anytime.
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