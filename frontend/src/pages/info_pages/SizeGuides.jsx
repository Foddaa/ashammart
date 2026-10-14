import React, { useState } from "react";

const SIZE_CHARTS = {
  tops: {
    label: "Tops",
    unit: "cm",
    columns: ["Size", "Chest", "Length", "Shoulder", "Sleeve"],
    rows: [
      ["XS", "88 – 92", "66", "40", "20"],
      ["S", "92 – 98", "68", "42", "21"],
      ["M", "98 – 104", "70", "44", "22"],
      ["L", "104 – 110", "72", "46", "23"],
      ["XL", "110 – 116", "74", "48", "24"],
      ["XXL", "116 – 122", "76", "50", "25"],
    ],
  },
  bottoms: {
    label: "Bottoms",
    unit: "cm",
    columns: ["Size", "Waist", "Hip", "Inseam", "Length"],
    rows: [
      ["XS", "66 – 70", "90 – 94", "72", "98"],
      ["S", "70 – 76", "94 – 98", "73", "100"],
      ["M", "76 – 82", "98 – 104", "74", "102"],
      ["L", "82 – 88", "104 – 110", "75", "104"],
      ["XL", "88 – 94", "110 – 116", "76", "106"],
      ["XXL", "94 – 100", "116 – 122", "77", "108"],
    ],
  },
  outerwear: {
    label: "Outerwear",
    unit: "cm",
    columns: ["Size", "Chest", "Length", "Shoulder", "Sleeve"],
    rows: [
      ["S", "100 – 106", "70", "46", "60"],
      ["M", "106 – 112", "72", "48", "61"],
      ["L", "112 – 118", "74", "50", "62"],
      ["XL", "118 – 124", "76", "52", "63"],
      ["XXL", "124 – 130", "78", "54", "64"],
    ],
  },
};

const TABS = [
  { id: "tops", label: "Tops" },
  { id: "bottoms", label: "Bottoms" },
  { id: "outerwear", label: "Outerwear" },
];

export default function SizeGuide() {
  const [activeTab, setActiveTab] = useState("tops");
  const chart = SIZE_CHARTS[activeTab];

  return (
    <div className="w-full min-h-screen bg-white text-neutral-800" dir="ltr">
      <div className="max-w-4xl mx-auto px-4 py-10 md:py-16 space-y-16">

        {/* ── Header ── */}
        <section className="border-b border-neutral-200 pb-12">
          <p className="text-xs uppercase tracking-[4px] text-neutral-500 mb-3">
            Size Guide
          </p>
          <h1 className="text-3xl md:text-5xl font-light tracking-tight leading-tight text-neutral-900 mb-6">
            Find your fit.
          </h1>
          <p className="text-neutral-600 leading-relaxed font-light text-[15px] max-w-2xl">
            Our pieces are designed for a relaxed, everyday fit. Measure a
            garment you already own that fits the way you like, and match it
            against the chart below. When in doubt, size up.
          </p>
        </section>

        {/* ── Quick Tips ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-neutral-200 p-6">
            <p className="text-xs uppercase tracking-[2px] text-neutral-500 mb-3">
              Relaxed Fit
            </p>
            <p className="text-sm text-neutral-600 font-light leading-relaxed">
              Most of our pieces are cut slightly oversized for comfort.
            </p>
          </div>

          <div className="border border-neutral-200 p-6">
            <p className="text-xs uppercase tracking-[2px] text-neutral-500 mb-3">
              Between Sizes?
            </p>
            <p className="text-sm text-neutral-600 font-light leading-relaxed">
              Size up for a looser drape, size down for a fitted look.
            </p>
          </div>

          <div className="border border-neutral-200 p-6">
            <p className="text-xs uppercase tracking-[2px] text-neutral-500 mb-3">
              Unisex Pieces
            </p>
            <p className="text-sm text-neutral-600 font-light leading-relaxed">
              Fits both men and women — check individual product pages for notes.
            </p>
          </div>
        </section>

        {/* ── How To Measure ── */}
        <section>
          <h2 className="text-xs uppercase tracking-[3px] text-neutral-500 mb-5">
            How To Measure
          </h2>
          <div className="border-t border-neutral-200 pt-6">
            <ul className="space-y-5">
              {[
                {
                  step: "01",
                  title: "Chest",
                  body: "Measure around the fullest part of your chest, keeping the tape horizontal and slightly loose.",
                },
                {
                  step: "02",
                  title: "Waist",
                  body: "Measure around your natural waistline, just above the belly button. Don't pull the tape tight.",
                },
                {
                  step: "03",
                  title: "Hip",
                  body: "Measure around the widest point of your hips and seat, keeping the tape level all the way around.",
                },
                {
                  step: "04",
                  title: "Length",
                  body: "Measure from the highest point of the shoulder straight down to the hem you'd like.",
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
            </ul>
          </div>
        </section>

        {/* ── Size Chart with Tabs ── */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
            <h2 className="text-xs uppercase tracking-[3px] text-neutral-500">
              Size Chart
            </h2>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-neutral-200 sm:border-none">
              {TABS.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 text-sm font-light tracking-wide transition-colors border-b-2 -mb-px sm:mb-0 sm:border-b-0 ${
                      isActive
                        ? "text-neutral-900 border-neutral-900"
                        : "text-neutral-500 border-transparent hover:text-neutral-800"
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="border border-neutral-200 overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-neutral-200">
                  {chart.columns.map((col) => (
                    <th
                      key={col}
                      className="px-6 py-4 text-left text-[10px] uppercase tracking-[2px] text-neutral-400 font-medium whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {chart.rows.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-neutral-100 last:border-none hover:bg-neutral-50 transition-colors"
                  >
                    {row.map((cell, j) => (
                      <td
                        key={j}
                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                          j === 0
                            ? "font-medium text-neutral-900"
                            : "text-neutral-600 font-light"
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-neutral-400 mt-4 font-light">
            All measurements are in {chart.unit}. Allow ±1–2 cm variance.
          </p>
        </section>

        {/* ── Not Sure? ── */}
        <section>
          <h2 className="text-xs uppercase tracking-[3px] text-neutral-500 mb-5">
            Still Not Sure?
          </h2>
          <div className="border-t border-neutral-200 pt-6 space-y-4">
            <p className="text-neutral-600 leading-relaxed font-light text-[15px]">
              If you're between two sizes and can't decide, message us on
              WhatsApp with your height, weight, and preferred fit — we'll
              recommend the right one for you.
            </p>
            <p className="text-neutral-600 leading-relaxed font-light text-[15px]">
              Exchanges within our return window are always available if the fit
              isn't right.
            </p>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="border-t border-neutral-200 pt-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-light text-neutral-900 mb-2">
              Need sizing help?
            </h3>
            <p className="text-sm text-neutral-500 font-light">
              Send us your measurements — we'll match you to the right size.
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