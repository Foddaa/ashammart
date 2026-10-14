import React from "react";

export default function PrivacyRules() {
  return (
    <div className="w-full min-h-screen bg-white text-neutral-800" dir="ltr">
      <div className="max-w-4xl mx-auto px-4 py-10 md:py-16 space-y-16">

        {/* ── Header ── */}
        <section className="border-b border-neutral-200 pb-12">
          <p className="text-xs uppercase tracking-[4px] text-neutral-500 mb-3">
            Privacy Policy
          </p>
          <h1 className="text-3xl md:text-5xl font-light tracking-tight leading-tight text-neutral-900 mb-6">
            Your privacy matters.
          </h1>
          <p className="text-neutral-600 leading-relaxed font-light text-[15px] max-w-2xl">
            We keep it simple: we only collect what we need to get your order to
            you, and we never sell or share your personal information with third
            parties.
          </p>
          <p className="text-xs text-neutral-400 mt-6 tracking-wide">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" })}
          </p>
        </section>

        {/* ── Summary Cards ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-neutral-200 p-6">
            <p className="text-xs uppercase tracking-[2px] text-neutral-500 mb-3">
              Never Shared
            </p>
            <p className="text-sm text-neutral-600 font-light leading-relaxed">
              Your phone, address, and email are never sold or given to third parties.
            </p>
          </div>

          <div className="border border-neutral-200 p-6">
            <p className="text-xs uppercase tracking-[2px] text-neutral-500 mb-3">
              Only For Delivery
            </p>
            <p className="text-sm text-neutral-600 font-light leading-relaxed">
              We use your data strictly to deliver your order safely and on time.
            </p>
          </div>

          <div className="border border-neutral-200 p-6">
            <p className="text-xs uppercase tracking-[2px] text-neutral-500 mb-3">
              Your Control
            </p>
            <p className="text-sm text-neutral-600 font-light leading-relaxed">
              You can request to see, correct, or delete your data at any time.
            </p>
          </div>
        </section>

        {/* ── What We Collect ── */}
        <section>
          <h2 className="text-xs uppercase tracking-[3px] text-neutral-500 mb-5">
            What We Collect
          </h2>
          <div className="border-t border-neutral-200 pt-6">
            <ul className="space-y-3 text-neutral-600 leading-relaxed font-light text-[15px]">
              <li className="flex gap-3">
                <span className="text-neutral-400">—</span>
                <span>
                  <span className="text-neutral-900">Contact details</span> — name,
                  phone number, and email address so we can reach you about your order.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-neutral-400">—</span>
                <span>
                  <span className="text-neutral-900">Delivery address</span> — the
                  location where you'd like your order sent.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-neutral-400">—</span>
                <span>
                  <span className="text-neutral-900">Order history</span> — what
                  you've bought, so we can help with returns, exchanges, and support.
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-neutral-400">—</span>
                <span>
                  <span className="text-neutral-900">Basic device data</span> — such
                  as browser type, so the site works properly on your device.
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* ── How We Use It ── */}
        <section>
          <h2 className="text-xs uppercase tracking-[3px] text-neutral-500 mb-5">
            How We Use It
          </h2>
          <div className="border-t border-neutral-200 pt-6 space-y-4">
            <p className="text-neutral-600 leading-relaxed font-light text-[15px]">
              Your information is used <span className="text-neutral-900">only</span> to:
            </p>
            <ul className="space-y-3 text-neutral-600 leading-relaxed font-light text-[15px]">
              <li className="flex gap-3">
                <span className="text-neutral-400">—</span>
                Process and deliver your order
              </li>
              <li className="flex gap-3">
                <span className="text-neutral-400">—</span>
                Contact you about delivery, changes, or issues with your order
              </li>
              <li className="flex gap-3">
                <span className="text-neutral-400">—</span>
                Handle returns, exchanges, and customer support requests
              </li>
              <li className="flex gap-3">
                <span className="text-neutral-400">—</span>
                Improve the site experience (in an aggregated, non-personal way)
              </li>
            </ul>
            <p className="text-neutral-600 leading-relaxed font-light text-[15px] pt-2">
              We do <span className="text-neutral-900">not</span> use your data for
              advertising, we do <span className="text-neutral-900">not</span> sell it,
              and we do <span className="text-neutral-900">not</span> share it with
              any external party beyond the courier delivering your order.
            </p>
          </div>
        </section>

        {/* ── Who We Share With ── */}
        <section>
          <h2 className="text-xs uppercase tracking-[3px] text-neutral-500 mb-5">
            Who We Share With
          </h2>
          <div className="border-t border-neutral-200 pt-6 space-y-4">
            <p className="text-neutral-600 leading-relaxed font-light text-[15px]">
              The only external party that ever sees your delivery details is our{" "}
              <span className="text-neutral-900">courier partner</span> — and only
              the minimum information needed to deliver your order (name, phone,
              address).
            </p>
            <p className="text-neutral-600 leading-relaxed font-light text-[15px]">
              We never sell, rent, or trade your personal information with marketers,
              advertisers, or any other third party.
            </p>
          </div>
        </section>

        {/* ── Your Rights ── */}
        <section>
          <h2 className="text-xs uppercase tracking-[3px] text-neutral-500 mb-5">
            Your Rights
          </h2>
          <div className="border-t border-neutral-200 pt-6 space-y-4">
            <p className="text-neutral-600 leading-relaxed font-light text-[15px]">
              You can contact us at any time to:
            </p>
            <ul className="space-y-3 text-neutral-600 leading-relaxed font-light text-[15px]">
              <li className="flex gap-3">
                <span className="text-neutral-400">—</span>
                Ask what personal data we have about you
              </li>
              <li className="flex gap-3">
                <span className="text-neutral-400">—</span>
                Correct any inaccurate information
              </li>
              <li className="flex gap-3">
                <span className="text-neutral-400">—</span>
                Request that your data be deleted (as long as we're not legally
                required to keep it for order records)
              </li>
            </ul>
          </div>
        </section>

        {/* ── Cookies ── */}
        <section>
          <h2 className="text-xs uppercase tracking-[3px] text-neutral-500 mb-5">
            Cookies
          </h2>
          <div className="border-t border-neutral-200 pt-6 space-y-4">
            <p className="text-neutral-600 leading-relaxed font-light text-[15px]">
              We use minimal cookies to keep your cart working and remember basic
              preferences. These are not used for tracking you across other sites
              or showing you ads.
            </p>
          </div>
        </section>

        {/* ── Updates ── */}
        <section>
          <h2 className="text-xs uppercase tracking-[3px] text-neutral-500 mb-5">
            Updates To This Policy
          </h2>
          <div className="border-t border-neutral-200 pt-6 space-y-4">
            <p className="text-neutral-600 leading-relaxed font-light text-[15px]">
              If we ever change how we handle your data, we'll update this page and
              note the date at the top. Continued use of the site means you accept
              the current version.
            </p>
          </div>
        </section>

        {/* ── Contact ── */}
        <section className="border-t border-neutral-200 pt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-light text-neutral-900 mb-2">
              Questions about your data?
            </h3>
            <p className="text-sm text-neutral-500 font-light">
              Reach out and we'll respond within 24 hours.
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