import React from "react";

export default function ReturningAndReplacing() {
  return (
    <div className="w-full min-h-screen bg-white text-neutral-800" dir="ltr">
      <div className="max-w-4xl mx-auto px-4 py-10 md:py-16 space-y-16">

        {/* ── Header ── */}
        <section className="border-b border-neutral-200 pb-12">
          <p className="text-xs uppercase tracking-[4px] text-neutral-500 mb-3">
            Returns & Exchanges
          </p>
          <h1 className="text-3xl md:text-5xl font-light tracking-tight leading-tight text-neutral-900 mb-6">
            Changed your mind?
            <br className="hidden md:block" />
            No problem.
          </h1>
          <p className="text-neutral-600 leading-relaxed font-light text-[15px] max-w-2xl">
            We offer exchanges and returns within 14 days of receiving your order —
            no reason required. Simple as that.
          </p>
        </section>

        {/* ── Policy Summary Cards ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-neutral-200 p-6">
            <p className="text-2xl font-light text-neutral-900 mb-2">14</p>
            <p className="text-xs uppercase tracking-[2px] text-neutral-500 mb-3">
              Days To Return
            </p>
            <p className="text-sm text-neutral-600 font-light leading-relaxed">
              From the date you receive your order.
            </p>
          </div>

          <div className="border border-neutral-200 p-6">
            <p className="text-2xl font-light text-neutral-900 mb-2">3–5</p>
            <p className="text-xs uppercase tracking-[2px] text-neutral-500 mb-3">
              Business Days
            </p>
            <p className="text-sm text-neutral-600 font-light leading-relaxed">
              To process your refund after we receive the item.
            </p>
          </div>

          <div className="border border-neutral-200 p-6">
            <p className="text-2xl font-light text-neutral-900 mb-2">No</p>
            <p className="text-xs uppercase tracking-[2px] text-neutral-500 mb-3">
              Reason Required
            </p>
            <p className="text-sm text-neutral-600 font-light leading-relaxed">
              Return or exchange for any reason you like.
            </p>
          </div>
        </section>

        {/* ── The Policy ── */}
        <section>
          <h2 className="text-xs uppercase tracking-[3px] text-neutral-500 mb-5">
            The Policy
          </h2>
          <div className="border-t border-neutral-200 pt-6 space-y-4">
            <p className="text-neutral-600 leading-relaxed font-light text-[15px]">
              You can request an exchange or return within{" "}
              <span className="text-neutral-900">14 days</span> from the date you
              receive your order — for any reason, no explanation needed.
            </p>
            <p className="text-neutral-600 leading-relaxed font-light text-[15px]">
              Items must be in their{" "}
              <span className="text-neutral-900">original condition</span> — unworn,
              unwashed, undamaged, and with all original tags still attached.
            </p>
            <p className="text-neutral-600 leading-relaxed font-light text-[15px]">
              When exchanging or returning an item, the customer is responsible for
              the <span className="text-neutral-900">return shipping cost</span>.
              If the return is due to a defect or our error, we cover it.
            </p>
            <p className="text-neutral-600 leading-relaxed font-light text-[15px]">
              Once your return is accepted and received, your refund will be
              processed within{" "}
              <span className="text-neutral-900">3 to 5 business days</span>.
            </p>
          </div>
        </section>

        {/* ── How To Start ── */}
        <section>
          <h2 className="text-xs uppercase tracking-[3px] text-neutral-500 mb-5">
            How To Start a Return or Exchange
          </h2>
          <div className="border-t border-neutral-200 pt-6">
            <ol className="space-y-5">
              {[
                {
                  step: "01",
                  title: "Contact us",
                  body: "Reach out via WhatsApp or email with your order number and whether you want a return or exchange.",
                },
                {
                  step: "02",
                  title: "Pack the item",
                  body: "Place the item back in its original packaging with tags attached. Make sure it's clean and unworn.",
                },
                {
                  step: "03",
                  title: "Hand it to the courier",
                  body: "We'll arrange a pickup or share the courier details so you can hand over the package.",
                },
                {
                  step: "04",
                  title: "Get your refund or exchange",
                  body: "Once we receive and inspect the item, we'll process your refund or ship the new size within 3–5 business days.",
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

        {/* ── Not Eligible ── */}
        <section>
          <h2 className="text-xs uppercase tracking-[3px] text-neutral-500 mb-5">
            Not Eligible For Return
          </h2>
          <div className="border-t border-neutral-200 pt-6">
            <ul className="space-y-3 text-neutral-600 leading-relaxed font-light text-[15px]">
              <li className="flex gap-3">
                <span className="text-neutral-400">—</span>
                Items worn, washed, or altered after delivery
              </li>
              <li className="flex gap-3">
                <span className="text-neutral-400">—</span>
                Items missing original tags, packaging, or accessories
              </li>
              <li className="flex gap-3">
                <span className="text-neutral-400">—</span>
                Sale items and final-clearance products
              </li>
              <li className="flex gap-3">
                <span className="text-neutral-400">—</span>
                Underwear and innerwear (for hygiene reasons)
              </li>
              <li className="flex gap-3">
                <span className="text-neutral-400">—</span>
                Requests made more than 14 days after delivery
              </li>
            </ul>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="border-t border-neutral-200 pt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-light text-neutral-900 mb-2">
              Ready to start a return?
            </h3>
            <p className="text-sm text-neutral-500 font-light">
              Reach out — we'll take care of the rest.
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