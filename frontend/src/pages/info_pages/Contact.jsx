import React, { useState } from "react";
import { MdLocationPin, MdOutlineMail } from "react-icons/md";
import { FiPhoneCall } from "react-icons/fi";
import useMerchantConfig from "@/hooks/useMerchantConfig";

// field name used in this page -> key stored in merchant_configuration
const CONTACT_KEYS = {
  phone_1: "merchant_contact_phone_1",
  phone_2: "merchant_contact_phone_2",
  email: "merchant_contact_email",
  address: "merchant_address",
  address_note: "merchant_address_note",
  working_days: "merchant_working_days",
  working_hours: "merchant_working_hours",
  maps_url: "merchant_maps_url",
  support_languages: "merchant_support_languages",
};

// "+20 111 889 9959" -> "tel:+201118899959"
const toTel = (phone) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export default function Contact() {
  const { config, loading } = useMerchantConfig(CONTACT_KEYS);

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: wire up to your backend / email service
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
    setTimeout(() => setSubmitted(false), 4000);
  };

  const phones = [config.phone_1, config.phone_2].filter(Boolean);
  const hours = [config.working_days, config.working_hours]
    .filter(Boolean)
    .join(", ");
  const mapsUrl =
    config.maps_url ||
    (config.address
      ? `https://maps.google.com/?q=${encodeURIComponent(config.address)}`
      : "");

  return (
    <div className="w-full min-h-screen bg-white text-neutral-800" dir="ltr">
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-16 space-y-16">

        {/* ── Header ── */}
        <section className="border-b border-neutral-200 pb-12">
          <p className="text-xs uppercase tracking-[4px] text-neutral-500 mb-3">
            Contact
          </p>
          <h1 className="text-3xl md:text-5xl font-light tracking-tight leading-tight text-neutral-900 mb-6">
            Let's talk.
          </h1>
          <p className="text-neutral-600 leading-relaxed font-light text-[15px] max-w-3xl">
            Questions about sizing, shipping, an order, or just want to say hi?
            We're a small team and we actually read everything. Reach out through
            any of the channels below and we'll get back to you within 24 hours.
          </p>
        </section>

        {/* ── Contact cards ── */}
        <section
          className={`grid grid-cols-1 md:grid-cols-3 gap-6 transition-opacity duration-300 ${
            loading ? "opacity-0" : "opacity-100"
          }`}
        >
          {/* Visit */}
          {(config.address || config.address_note) && (
            <div className="border border-neutral-200 p-8 flex flex-col items-start">
              <span className="w-11 h-11 flex items-center justify-center border border-neutral-200 text-neutral-900 mb-5">
                <MdLocationPin size={22} />
              </span>
              <h3 className="text-sm uppercase tracking-[3px] text-neutral-500 mb-3">
                Visit Us
              </h3>
              {config.address && (
                <p className="mb-2">
                  {mapsUrl ? (
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Open in Maps"
                      className="text-neutral-900 font-light hover:underline"
                    >
                      {config.address}
                    </a>
                  ) : (
                    <span className="text-neutral-900 font-light">{config.address}</span>
                  )}
                </p>
              )}
              {config.address_note && (
                <p className="text-sm text-neutral-500 font-light leading-relaxed">
                  {config.address_note}
                </p>
              )}
            </div>
          )}

          {/* Call */}
          {phones.length > 0 && (
            <div className="border border-neutral-200 p-8 flex flex-col items-start">
              <span className="w-11 h-11 flex items-center justify-center border border-neutral-200 text-neutral-900 mb-5">
                <FiPhoneCall size={20} />
              </span>
              <h3 className="text-sm uppercase tracking-[3px] text-neutral-500 mb-3">
                Call Us
              </h3>
              {phones.map((phone, i) => (
                <a
                  key={phone}
                  href={toTel(phone)}
                  className={`text-neutral-900 font-light hover:underline ${
                    i === phones.length - 1 ? "mb-3" : "mb-1"
                  }`}
                >
                  {phone}
                </a>
              ))}
              {hours && (
                <p className="text-sm text-neutral-500 font-light leading-relaxed">
                  {hours}.
                </p>
              )}
            </div>
          )}

          {/* Email */}
          {config.email && (
            <div className="border border-neutral-200 p-8 flex flex-col items-start">
              <span className="w-11 h-11 flex items-center justify-center border border-neutral-200 text-neutral-900 mb-5">
                <MdOutlineMail size={22} />
              </span>
              <h3 className="text-sm uppercase tracking-[3px] text-neutral-500 mb-3">
                Email Us
              </h3>
              <a
                href={`mailto:${config.email}`}
                className="text-neutral-900 font-light hover:underline mb-3 break-all"
              >
                {config.email}
              </a>
              <p className="text-sm text-neutral-500 font-light leading-relaxed">
                For orders, returns, and collaboration inquiries.
              </p>
            </div>
          )}
        </section>

        {/* ── Send us a message ── */}
        <section className="border-t border-neutral-200 pt-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">

            {/* Left: intro */}
            <div>
              <p className="text-xs uppercase tracking-[3px] text-neutral-500 mb-3">
                Send Us a Message
              </p>
              <h2 className="text-2xl md:text-3xl font-light tracking-tight leading-snug text-neutral-900 mb-6">
                Have a question? Drop us a line.
              </h2>
              <p className="text-neutral-600 leading-relaxed font-light text-[15px] mb-6">
                Fill out the form and we'll get back to you as soon as possible.
                For order-related questions, please include your order number so
                we can help faster.
              </p>

              <div className="space-y-2 text-sm text-neutral-500 font-light">
                <p>
                  <span className="text-neutral-900">Response time:</span> under 24 hours
                </p>
                {config.working_days && (
                  <p>
                    <span className="text-neutral-900">Working days:</span>{" "}
                    {config.working_days}
                  </p>
                )}
                {config.support_languages && (
                  <p>
                    <span className="text-neutral-900">Support languages:</span>{" "}
                    {config.support_languages}
                  </p>
                )}
              </div>
            </div>

            {/* Right: form */}
            <form
              onSubmit={handleSubmit}
              className="border border-neutral-200 p-8 md:p-10 bg-neutral-50"
            >
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs uppercase tracking-[2px] text-neutral-500 mb-2"
                  >
                    Your Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-neutral-300 focus:border-black outline-none py-2 text-sm placeholder:text-neutral-400 transition-colors"
                    placeholder="Jane Doe"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs uppercase tracking-[2px] text-neutral-500 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-neutral-300 focus:border-black outline-none py-2 text-sm placeholder:text-neutral-400 transition-colors"
                    placeholder="you@example.com"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs uppercase tracking-[2px] text-neutral-500 mb-2"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    value={form.message}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-neutral-300 focus:border-black outline-none py-2 text-sm placeholder:text-neutral-400 transition-colors resize-none"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 text-sm hover:bg-neutral-800 transition-colors duration-200 tracking-wider whitespace-nowrap"
                >
                  Send Message
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
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>

                {submitted && (
                  <p className="text-sm text-green-600 font-light">
                    ✓ Thanks — your message has been sent. We'll reply soon.
                  </p>
                )}
              </div>
            </form>
          </div>
        </section>

        {/* ── Map / Location CTA ── */}
        {mapsUrl && (
          <section className="border-t border-neutral-200 pt-12">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div>
                <h3 className="text-xl font-light text-neutral-900 mb-2">
                  Prefer to visit in person?
                </h3>
                <p className="text-sm text-neutral-500 font-light">
                  Stop by our studio — try things on, pick up orders, or just
                  say hi.
                </p>
              </div>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-neutral-900 text-neutral-900 px-6 py-3 text-sm hover:bg-neutral-900 hover:text-white transition-colors duration-200 tracking-wider whitespace-nowrap"
              >
                Open in Maps
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
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>
            </div>
          </section>
        )}

      </div>
    </div>
  );
}