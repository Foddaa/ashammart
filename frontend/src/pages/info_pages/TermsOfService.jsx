import React from "react";

export default function TermsOfService() {
  return (
    <div className="w-full min-h-screen bg-white text-neutral-800" dir="ltr">
      <div className="max-w-4xl mx-auto px-4 py-10 md:py-16 space-y-16">

        {/* ── Header ── */}
        <section className="border-b border-neutral-200 pb-12">
          <p className="text-xs uppercase tracking-[4px] text-neutral-500 mb-3">
            Terms of Service
          </p>
          <h1 className="text-3xl md:text-5xl font-light tracking-tight leading-tight text-neutral-900 mb-6">
            The ground rules.
          </h1>
          <p className="text-neutral-600 leading-relaxed font-light text-[15px] max-w-2xl">
            By using our website and placing an order, you agree to the terms
            outlined below. We've kept them short and readable — no legal maze.
          </p>
          <p className="text-xs text-neutral-400 mt-6 tracking-wide">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" })}
          </p>
        </section>

        {/* ── Summary Cards ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-neutral-200 p-6">
            <p className="text-xs uppercase tracking-[2px] text-neutral-500 mb-3">
              Fair Use
            </p>
            <p className="text-sm text-neutral-600 font-light leading-relaxed">
              Use the site as intended — browsing, buying, and contacting us.
            </p>
          </div>

          <div className="border border-neutral-200 p-6">
            <p className="text-xs uppercase tracking-[2px] text-neutral-500 mb-3">
              Accurate Info
            </p>
            <p className="text-sm text-neutral-600 font-light leading-relaxed">
              Provide correct details so we can deliver your order.
            </p>
          </div>

          <div className="border border-neutral-200 p-6">
            <p className="text-xs uppercase tracking-[2px] text-neutral-500 mb-3">
              Respect
            </p>
            <p className="text-sm text-neutral-600 font-light leading-relaxed">
              No abuse, no misuse, no unauthorized copying of our content.
            </p>
          </div>
        </section>

        {/* ── 1. Acceptance of Terms ── */}
        <section>
          <h2 className="text-xs uppercase tracking-[3px] text-neutral-500 mb-5">
            01 — Acceptance of Terms
          </h2>
          <div className="border-t border-neutral-200 pt-6 space-y-4">
            <p className="text-neutral-600 leading-relaxed font-light text-[15px]">
              By accessing or using our website, you agree to these Terms of
              Service. If you do not agree with any part of these terms, please
              do not use the site.
            </p>
            <p className="text-neutral-600 leading-relaxed font-light text-[15px]">
              We may update these terms from time to time. Continued use of the
              site after an update means you accept the current version.
            </p>
          </div>
        </section>

        {/* ── 2. Using Our Website ── */}
        <section>
          <h2 className="text-xs uppercase tracking-[3px] text-neutral-500 mb-5">
            02 — Using Our Website
          </h2>
          <div className="border-t border-neutral-200 pt-6 space-y-4">
            <p className="text-neutral-600 leading-relaxed font-light text-[15px]">
              You agree to use the site only for lawful purposes and in a way
              that does not harm the site, its users, or us. Specifically, you
              agree <span className="text-neutral-900">not</span> to:
            </p>
            <ul className="space-y-3 text-neutral-600 leading-relaxed font-light text-[15px]">
              <li className="flex gap-3">
                <span className="text-neutral-400">—</span>
                Attempt to gain unauthorized access to the site or its systems
              </li>
              <li className="flex gap-3">
                <span className="text-neutral-400">—</span>
                Copy, scrape, or reproduce our content, images, or product designs
              </li>
              <li className="flex gap-3">
                <span className="text-neutral-400">—</span>
                Place fraudulent or fake orders
              </li>
              <li className="flex gap-3">
                <span className="text-neutral-400">—</span>
                Interfere with the security, speed, or functioning of the site
              </li>
            </ul>
          </div>
        </section>

        {/* ── 3. Accounts & Information ── */}
        <section>
          <h2 className="text-xs uppercase tracking-[3px] text-neutral-500 mb-5">
            03 — Accounts & Information
          </h2>
          <div className="border-t border-neutral-200 pt-6 space-y-4">
            <p className="text-neutral-600 leading-relaxed font-light text-[15px]">
              You are responsible for the accuracy of the information you
              provide when placing an order, including your name, phone number,
              and delivery address. Orders placed with incorrect information may
              fail to be delivered, and re-shipping fees may apply.
            </p>
            <p className="text-neutral-600 leading-relaxed font-light text-[15px]">
              If you create an account, you are responsible for keeping your
              credentials private and for all activity that happens through your
              account.
            </p>
          </div>
        </section>

        {/* ── 4. Products & Pricing ── */}
        <section>
          <h2 className="text-xs uppercase tracking-[3px] text-neutral-500 mb-5">
            04 — Products & Pricing
          </h2>
          <div className="border-t border-neutral-200 pt-6 space-y-4">
            <p className="text-neutral-600 leading-relaxed font-light text-[15px]">
              We do our best to display accurate product images, colors, sizes,
              and prices. However:
            </p>
            <ul className="space-y-3 text-neutral-600 leading-relaxed font-light text-[15px]">
              <li className="flex gap-3">
                <span className="text-neutral-400">—</span>
                Colors may appear slightly different depending on your screen
              </li>
              <li className="flex gap-3">
                <span className="text-neutral-400">—</span>
                Prices and availability are subject to change without notice
              </li>
              <li className="flex gap-3">
                <span className="text-neutral-400">—</span>
                We reserve the right to cancel any order placed with incorrect
                pricing or that appears fraudulent
              </li>
            </ul>
          </div>
        </section>

        {/* ── 5. Orders & Payment ── */}
        <section>
          <h2 className="text-xs uppercase tracking-[3px] text-neutral-500 mb-5">
            05 — Orders & Payment
          </h2>
          <div className="border-t border-neutral-200 pt-6 space-y-4">
            <p className="text-neutral-600 leading-relaxed font-light text-[15px]">
              An order is only confirmed once you receive a confirmation from us.
              We accept Cash on Delivery (COD) and online payments via secure
              gateways.
            </p>
            <p className="text-neutral-600 leading-relaxed font-light text-[15px]">
              If an order cannot be delivered after multiple attempts, or if
              the customer refuses to accept the order without a valid reason,
              we may restrict future COD orders from the same phone number.
            </p>
          </div>
        </section>

        {/* ── 6. Shipping & Returns ── */}
        <section>
          <h2 className="text-xs uppercase tracking-[3px] text-neutral-500 mb-5">
            06 — Shipping & Returns
          </h2>
          <div className="border-t border-neutral-200 pt-6 space-y-4">
            <p className="text-neutral-600 leading-relaxed font-light text-[15px]">
              Shipping timelines, delivery coverage, and return or exchange
              conditions are described in our dedicated policy pages.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="/shipping"
                className="text-sm text-neutral-900 underline underline-offset-4 hover:no-underline"
              >
                Shipping Policy
              </a>
              <a
                href="/returns"
                className="text-sm text-neutral-900 underline underline-offset-4 hover:no-underline"
              >
                Returns & Exchanges
              </a>
            </div>
          </div>
        </section>

        {/* ── 7. Intellectual Property ── */}
        <section>
          <h2 className="text-xs uppercase tracking-[3px] text-neutral-500 mb-5">
            07 — Intellectual Property
          </h2>
          <div className="border-t border-neutral-200 pt-6 space-y-4">
            <p className="text-neutral-600 leading-relaxed font-light text-[15px]">
              All content on this site — including product photos, descriptions,
              logos, graphics, and design — is owned by us and protected by
              copyright and trademark law.
            </p>
            <p className="text-neutral-600 leading-relaxed font-light text-[15px]">
              You may not reproduce, distribute, or use our content for commercial
              purposes without written permission from us.
            </p>
          </div>
        </section>

        {/* ── 8. Limitation of Liability ── */}
        <section>
          <h2 className="text-xs uppercase tracking-[3px] text-neutral-500 mb-5">
            08 — Limitation of Liability
          </h2>
          <div className="border-t border-neutral-200 pt-6 space-y-4">
            <p className="text-neutral-600 leading-relaxed font-light text-[15px]">
              We are not liable for any indirect, incidental, or consequential
              damages arising from the use of our site or products, to the
              maximum extent permitted by law.
            </p>
            <p className="text-neutral-600 leading-relaxed font-light text-[15px]">
              Our total liability for any order will never exceed the amount you
              paid for that order.
            </p>
          </div>
        </section>

        {/* ── 9. Governing Law ── */}
        <section>
          <h2 className="text-xs uppercase tracking-[3px] text-neutral-500 mb-5">
            09 — Governing Law
          </h2>
          <div className="border-t border-neutral-200 pt-6 space-y-4">
            <p className="text-neutral-600 leading-relaxed font-light text-[15px]">
              These terms are governed by the laws of the Arab Republic of Egypt.
              Any disputes will be handled by the competent courts of Cairo.
            </p>
          </div>
        </section>

        {/* ── Contact CTA ── */}
        <section className="border-t border-neutral-200 pt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-light text-neutral-900 mb-2">
              Questions about these terms?
            </h3>
            <p className="text-sm text-neutral-500 font-light">
              We're happy to clarify anything — get in touch.
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