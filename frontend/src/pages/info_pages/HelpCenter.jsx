import React, { useState } from "react";
import { Link } from "react-router-dom";

const HELP_CATEGORIES = [
  {
    title: "Orders & Shipping",
    description:
      "Track an order, delivery times, coverage, and everything related to getting your package.",
    links: [
      { label: "Track My Order", to: "/track-order" },
      { label: "Shipping Policy", to: "/shipping" },
      { label: "Payment Methods", to: "/payment-methods" },
    ],
  },
  {
    title: "Returns & Sizing",
    description:
      "Not the right fit? Find out how to exchange, return, or pick the correct size.",
    links: [
      { label: "Returns & Exchanges", to: "/returns" },
      { label: "Size Guide", to: "/size-guide" },
      { label: "Product Care", to: "/faq" },
    ],
  },
  {
    title: "Account & Privacy",
    description:
      "How we handle your data, your rights, and the legal terms that apply to using our store.",
    links: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
      { label: "Contact Us", to: "/contact" },
    ],
  },
];

const POPULAR_QUESTIONS = [
  { q: "How long does delivery take?", to: "/shipping" },
  { q: "What is your return policy?", to: "/returns" },
  { q: "How do I find my size?", to: "/size-guide" },
  { q: "What payment methods do you accept?", to: "/payment-methods" },
  { q: "How do I track my order?", to: "/track-order" },
  { q: "How can I contact you?", to: "/contact" },
];

const CONTACT_CHANNELS = [
  {
    title: "WhatsApp",
    value: "0111 889 9959",
    href: "https://wa.me/201118899959",
    note: "Fastest response",
  },
  {
    title: "Call Us",
    value: "0115 888 0605",
    href: "tel:01158880605",
    note: "Sat – Thu, 10 AM – 8 PM",
  },
  {
    title: "Email",
    value: "hello@yourbrand.com",
    href: "mailto:hello@yourbrand.com",
    note: "Within 24 hours",
  },
];

export default function HelpCenter() {
  const [search, setSearch] = useState("");

  const filteredQuestions = POPULAR_QUESTIONS.filter((item) =>
    item.q.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full min-h-screen bg-white text-neutral-800" dir="ltr">
      <div className="max-w-4xl mx-auto px-4 py-10 md:py-16 space-y-16">

        {/* ── Header ── */}
        <section className="border-b border-neutral-200 pb-12">
          <p className="text-xs uppercase tracking-[4px] text-neutral-500 mb-3">
            Help Center
          </p>
          <h1 className="text-3xl md:text-5xl font-light tracking-tight leading-tight text-neutral-900 mb-6">
            How can we help?
          </h1>
          <p className="text-neutral-600 leading-relaxed font-light text-[15px] max-w-2xl mb-8">
            Browse the topics below, search for a specific question, or reach
            out to us directly. We reply within 24 hours, Saturday – Thursday.
          </p>

          {/* Search */}
          <div className="relative max-w-md">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 text-neutral-400">
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
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for a question…"
              className="w-full pl-7 pr-4 py-3 bg-transparent border-b border-neutral-300 focus:border-black outline-none text-sm placeholder:text-neutral-400 transition-colors"
            />
          </div>

          {/* Filtered results */}
          {search && (
            <div className="mt-6 border-t border-neutral-100 pt-4">
              {filteredQuestions.length > 0 ? (
                <ul className="space-y-3">
                  {filteredQuestions.map((item, i) => (
                    <li key={i}>
                      <Link
                        to={item.to}
                        className="flex items-center justify-between gap-4 text-sm text-neutral-700 hover:text-neutral-900 transition-colors group"
                      >
                        <span className="font-light">{item.q}</span>
                        <span className="text-neutral-300 group-hover:text-neutral-500 transition-colors">
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-neutral-400 font-light">
                  No results for "{search}". Try a different keyword, or{" "}
                  <Link
                    to="/contact"
                    className="text-neutral-900 underline underline-offset-4 hover:no-underline"
                  >
                    contact us
                  </Link>
                  .
                </p>
              )}
            </div>
          )}
        </section>

        {/* ── Categories ── */}
        <section>
          <h2 className="text-xs uppercase tracking-[3px] text-neutral-500 mb-6">
            Browse by Topic
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HELP_CATEGORIES.map((cat) => (
              <div
                key={cat.title}
                className="border border-neutral-200 p-6 flex flex-col"
              >
                <h3 className="text-lg font-light text-neutral-900 mb-3">
                  {cat.title}
                </h3>
                <p className="text-sm text-neutral-600 font-light leading-relaxed mb-6 flex-1">
                  {cat.description}
                </p>
                <ul className="space-y-2 border-t border-neutral-100 pt-4">
                  {cat.links.map((link) => (
                    <li key={link.to}>
                      <Link
                        to={link.to}
                        className="flex items-center justify-between text-sm text-neutral-700 hover:text-neutral-900 transition-colors group"
                      >
                        <span className="font-light">{link.label}</span>
                        <span className="text-neutral-300 group-hover:text-neutral-500 transition-colors">
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* ── Popular Questions ── */}
        <section>
          <h2 className="text-xs uppercase tracking-[3px] text-neutral-500 mb-5">
            Popular Questions
          </h2>

          <div className="border-t border-neutral-200">
            {POPULAR_QUESTIONS.map((item, i) => (
              <Link
                key={i}
                to={item.to}
                className="flex items-center justify-between gap-4 py-4 border-b border-neutral-200 group"
              >
                <span className="text-[15px] text-neutral-700 font-light tracking-tight group-hover:text-neutral-900 transition-colors">
                  {item.q}
                </span>
                <span className="shrink-0 text-neutral-300 group-hover:text-neutral-700 transition-colors">
                  →
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-6">
            <Link
              to="/faq"
              className="inline-flex items-center gap-2 text-sm text-neutral-900 underline underline-offset-4 hover:no-underline"
            >
              View full FAQ
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
            </Link>
          </div>
        </section>

        {/* ── Contact Channels ── */}
        <section>
          <h2 className="text-xs uppercase tracking-[3px] text-neutral-500 mb-6">
            Still Need Help?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CONTACT_CHANNELS.map((channel) => (
              <a
                key={channel.title}
                href={channel.href}
                target={channel.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  channel.href.startsWith("http")
                    ? "noopener noreferrer"
                    : undefined
                }
                className="border border-neutral-200 p-6 hover:border-neutral-900 transition-colors group"
              >
                <p className="text-xs uppercase tracking-[2px] text-neutral-500 mb-3">
                  {channel.title}
                </p>
                <p className="text-[15px] text-neutral-900 font-light mb-2 group-hover:underline underline-offset-4">
                  {channel.value}
                </p>
                <p className="text-xs text-neutral-500 font-light">
                  {channel.note}
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="border-t border-neutral-200 pt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-light text-neutral-900 mb-2">
              Prefer to just send us a message?
            </h3>
            <p className="text-sm text-neutral-500 font-light">
              We'll get back to you within 24 hours.
            </p>
          </div>
          <Link
            to="/contact"
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
          </Link>
        </section>

      </div>
    </div>
  );
}