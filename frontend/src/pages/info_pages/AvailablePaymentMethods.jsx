import React from "react";

const PAYMENT_METHODS = [
  {
    id: "cod",
    name: "Cash on Delivery",
    tagline: "Pay when it arrives",
    description:
      "Pay in cash to the courier when your order is delivered to your door. Available across all governorates we ship to — no extra fees.",
    details: [
      { label: "Availability", value: "All Egypt" },
      { label: "Extra Fees", value: "None" },
      { label: "Payment Time", value: "On delivery" },
    ],
    contact: null,
  },
  {
    id: "instapay",
    name: "Instapay",
    tagline: "Instant bank transfer",
    description:
      "Send the total via Instapay from any Egyptian bank app. Use the number below, then send us a screenshot of the transfer to confirm your order faster.",
    details: [
      { label: "Payment Number", value: "01152433581" },
      { label: "Confirm With", value: "Transfer screenshot" },
      { label: "Processing", value: "Same day" },
    ],
    contact: "01152433581",
  },
  {
    id: "vodafone-cash",
    name: "Vodafone Cash",
    tagline: "Mobile wallet transfer",
    description:
      "Send the total to our Vodafone Cash wallet, then share the confirmation screenshot with our team. Quick and works from any phone.",
    details: [
      { label: "Payment Number", value: "01118899959" },
      { label: "Confirm With", value: "Transfer screenshot" },
      { label: "Processing", value: "Same day" },
    ],
    contact: "01118899959",
  },
];

export default function AvailablePaymentMethods() {
  return (
    <div className="w-full min-h-screen bg-white text-neutral-800" dir="ltr">
      <div className="max-w-4xl mx-auto px-4 py-10 md:py-16 space-y-16">

        {/* ── Header ── */}
        <section className="border-b border-neutral-200 pb-12">
          <p className="text-xs uppercase tracking-[4px] text-neutral-500 mb-3">
            Payment Methods
          </p>
          <h1 className="text-3xl md:text-5xl font-light tracking-tight leading-tight text-neutral-900 mb-6">
            Ways to pay.
          </h1>
          <p className="text-neutral-600 leading-relaxed font-light text-[15px] max-w-2xl">
            We keep payment simple. Choose whatever works best for you — cash
            on delivery, or a quick transfer via Instapay or Vodafone Cash.
            No hidden fees, no complicated steps.
          </p>
        </section>

        {/* ── Summary Cards ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-neutral-200 p-6">
            <p className="text-xs uppercase tracking-[2px] text-neutral-500 mb-3">
              Pay Later
            </p>
            <p className="text-sm text-neutral-600 font-light leading-relaxed">
              Cash on delivery — no upfront payment needed.
            </p>
          </div>

          <div className="border border-neutral-200 p-6">
            <p className="text-xs uppercase tracking-[2px] text-neutral-500 mb-3">
              Instant Transfer
            </p>
            <p className="text-sm text-neutral-600 font-light leading-relaxed">
              Instapay — send from any Egyptian bank app.
            </p>
          </div>

          <div className="border border-neutral-200 p-6">
            <p className="text-xs uppercase tracking-[2px] text-neutral-500 mb-3">
              Mobile Wallet
            </p>
            <p className="text-sm text-neutral-600 font-light leading-relaxed">
              Vodafone Cash — quick payment from your phone.
            </p>
          </div>
        </section>

        {/* ── Payment Method Details ── */}
        <section>
          <h2 className="text-xs uppercase tracking-[3px] text-neutral-500 mb-6">
            Accepted Methods
          </h2>

          <div className="space-y-4">
            {PAYMENT_METHODS.map((method, index) => (
              <div
                key={method.id}
                className="border border-neutral-200 p-6 md:p-8"
              >
                {/* Header row */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs text-neutral-400 tracking-[2px]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-lg font-light text-neutral-900">
                        {method.name}
                      </h3>
                    </div>
                    <p className="text-xs uppercase tracking-[2px] text-neutral-500">
                      {method.tagline}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-neutral-600 leading-relaxed font-light mb-6">
                  {method.description}
                </p>

                {/* Details grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5 border-t border-neutral-100">
                  {method.details.map((d) => (
                    <div key={d.label}>
                      <p className="text-[10px] uppercase tracking-[2px] text-neutral-400 mb-1">
                        {d.label}
                      </p>
                      <p className="text-sm text-neutral-800 font-light">
                        {d.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── How It Works ── */}
        <section>
          <h2 className="text-xs uppercase tracking-[3px] text-neutral-500 mb-5">
            How Payment Works
          </h2>
          <div className="border-t border-neutral-200 pt-6">
            <ol className="space-y-5">
              {[
                {
                  step: "01",
                  title: "Choose your method",
                  body: "Select Cash on Delivery, Instapay, or Vodafone Cash at checkout.",
                },
                {
                  step: "02",
                  title: "Confirm your order",
                  body: "Place your order — we'll reach out on WhatsApp or by phone to confirm.",
                },
                {
                  step: "03",
                  title: "Complete the payment",
                  body: "For COD, pay the courier on delivery. For transfers, send the amount and share a screenshot.",
                },
                {
                  step: "04",
                  title: "We ship it out",
                  body: "Once payment is confirmed, your order is packed and shipped within 24 hours.",
                },
              ].map((item) => (
                <li
                  key={item.step}
                  className="flex gap-6 border-b border-neutral-100 pb-5 last:border-none last:pb-0"
                >
                  <span className="text-xs text-neutral-400 tracking-[2px] mt-1 shrink-0">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="text-[15px] text-neutral-900 font-light mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-neutral-600 leading-relaxed font-light">
                      {item.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ── Notes ── */}
        <section>
          <h2 className="text-xs uppercase tracking-[3px] text-neutral-500 mb-5">
            Good To Know
          </h2>
          <div className="border-t border-neutral-200 pt-6">
            <ul className="space-y-3 text-neutral-600 leading-relaxed font-light text-[15px]">
              <li className="flex gap-3">
                <span className="text-neutral-400">—</span>
                All transfers must be completed within 24 hours of placing your
                order, otherwise the order may be cancelled.
              </li>
              <li className="flex gap-3">
                <span className="text-neutral-400">—</span>
                For Instapay and Vodafone Cash, always send us the transfer
                screenshot so we can match your payment to your order.
              </li>
              <li className="flex gap-3">
                <span className="text-neutral-400">—</span>
                Cash on Delivery is available across all governorates we ship to,
                with no additional fee.
              </li>
              <li className="flex gap-3">
                <span className="text-neutral-400">—</span>
                We never ask for card details, OTPs, or passwords over phone,
                WhatsApp, or email. If you receive such a request, it's not us.
              </li>
            </ul>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="border-t border-neutral-200 pt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-light text-neutral-900 mb-2">
              Need help with a payment?
            </h3>
            <p className="text-sm text-neutral-500 font-light">
              Reach out and we'll walk you through it.
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