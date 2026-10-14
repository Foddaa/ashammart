import React, { useState } from "react";

const FAQ_SECTIONS = [
  {
    category: "Orders & Shipping",
    items: [
      {
        q: "How long does delivery take?",
        a: "Orders inside Cairo & Giza usually arrive within 2–3 business days. Orders to other governorates take 3–5 business days. You'll receive a confirmation call or SMS before delivery.",
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes — orders above a minimum amount qualify for free delivery. You'll see the free-shipping threshold applied automatically at checkout.",
      },
      {
        q: "Can I track my order?",
        a: "Absolutely. Once your order is confirmed, we'll send you an order number. You can use it with our support team to check the current status at any time.",
      },
      {
        q: "Do you deliver outside Egypt?",
        a: "Currently we only ship within Egypt. International shipping is on our roadmap — sign up for our newsletter to be the first to know.",
      },
    ],
  },
  {
    category: "Sizing & Fit",
    items: [
      {
        q: "How do I know which size to order?",
        a: "Every product page includes a detailed size chart with measurements in cm. If you're between two sizes, we recommend sizing up for a relaxed fit — most of our pieces are designed to be worn slightly oversized.",
      },
      {
        q: "Are your clothes unisex?",
        a: "Many of our pieces are designed as unisex and fit both men and women. Where a piece has a more tailored fit, we clearly note it on the product page.",
      },
      {
        q: "What if the size doesn't fit?",
        a: "You can exchange within 14 days of delivery, as long as the item is unworn, unwashed, and still has its original tags attached. Check our Returns section below for the full process.",
      },
    ],
  },
  {
    category: "Returns & Exchanges",
    items: [
      {
        q: "What is your return policy?",
        a: "We accept returns within 14 days of delivery for unused items in their original condition with tags attached. Sale items and underwear are final sale.",
      },
      {
        q: "How do I start a return or exchange?",
        a: "Contact us via WhatsApp or email with your order number and reason for return. We'll guide you through the pickup and process. Exchanges are usually processed within 3–5 business days after we receive the item.",
      },
      {
        q: "Who pays for return shipping?",
        a: "If the return is due to a defect, wrong item, or our error — we cover it. For size or preference-based returns, the customer covers the shipping cost.",
      },
    ],
  },
  {
    category: "Payment",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept Cash on Delivery (COD) and online card payments. More payment options are being added soon.",
      },
      {
        q: "Is Cash on Delivery available everywhere?",
        a: "Yes — COD is available across all governorates we ship to. You pay the courier when the order arrives.",
      },
      {
        q: "Is my payment information secure?",
        a: "All online payments are processed through a secure, PCI-compliant payment gateway. We never store your card details on our servers.",
      },
    ],
  },
  {
    category: "Products & Care",
    items: [
      {
        q: "How should I wash my clothes?",
        a: "We recommend washing inside-out in cold water and air-drying to preserve fabric and print quality. Avoid bleach and high-heat tumble drying.",
      },
      {
        q: "Do you restock sold-out items?",
        a: "Our core staples are restocked regularly. Seasonal or limited drops usually aren't restocked — but we announce restocks on Instagram and via email, so keep an eye out.",
      },
      {
        q: "Are the colors exactly as shown?",
        a: "We do our best to photograph products accurately, but slight color variation can occur depending on your screen. If a color isn't what you expected, you can exchange it within our return window.",
      },
    ],
  },
];

export default function FAQ() {
  const [openKey, setOpenKey] = useState("0-0"); // "sectionIndex-itemIndex"

  const toggle = (key) => setOpenKey((prev) => (prev === key ? null : key));

  return (
    <div className="w-full min-h-screen bg-white text-neutral-800" dir="ltr">
      <div className="max-w-4xl mx-auto px-4 py-10 md:py-16 space-y-16">

        {/* ── Header ── */}
        <section className="border-b border-neutral-200 pb-12">
          <p className="text-xs uppercase tracking-[4px] text-neutral-500 mb-3">
            FAQ
          </p>
          <h1 className="text-3xl md:text-5xl font-light tracking-tight leading-tight text-neutral-900 mb-6">
            Frequently asked questions.
          </h1>
          <p className="text-neutral-600 leading-relaxed font-light text-[15px] max-w-2xl">
            Everything you need to know about orders, sizing, returns, and
            payments. Can't find what you're looking for? Reach out — we're
            happy to help.
          </p>
        </section>

        {/* ── FAQ Sections ── */}
        <div className="space-y-14">
          {FAQ_SECTIONS.map((section, sIdx) => (
            <section key={sIdx}>
              <h2 className="text-xs uppercase tracking-[3px] text-neutral-500 mb-6">
                {section.category}
              </h2>

              <div className="border-t border-neutral-200">
                {section.items.map((item, iIdx) => {
                  const key = `${sIdx}-${iIdx}`;
                  const isOpen = openKey === key;

                  return (
                    <div
                      key={key}
                      className="border-b border-neutral-200"
                    >
                      <button
                        onClick={() => toggle(key)}
                        className="w-full flex items-start justify-between gap-6 py-5 text-left group"
                        aria-expanded={isOpen}
                      >
                        <span
                          className={`text-[15px] md:text-base font-light tracking-tight transition-colors ${
                            isOpen
                              ? "text-neutral-900"
                              : "text-neutral-700 group-hover:text-neutral-900"
                          }`}
                        >
                          {item.q}
                        </span>
                        <span
                          className={`shrink-0 w-6 h-6 flex items-center justify-center text-neutral-500 transition-transform duration-300 ${
                            isOpen ? "rotate-45" : ""
                          }`}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        </span>
                      </button>

                      <div
                        className={`grid transition-all duration-300 ease-in-out ${
                          isOpen
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="pb-6 pr-10 text-sm text-neutral-600 leading-relaxed font-light">
                            {item.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* ── Still have questions CTA ── */}
        <section className="border-t border-neutral-200 pt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-light text-neutral-900 mb-2">
              Still have questions?
            </h3>
            <p className="text-sm text-neutral-500 font-light">
              Our team replies within 24 hours, Saturday – Thursday.
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