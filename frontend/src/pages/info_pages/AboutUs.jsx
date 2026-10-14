import React from "react";

export default function AboutUs() {
  return (
    <div className="w-full min-h-screen bg-white text-neutral-800" dir="ltr">
      <div className="max-w-6xl mx-auto px-4 py-10 md:py-16 space-y-16">

        {/* ── Hero ── */}
        <section className="border-b border-neutral-200 pb-12">
          <p className="text-xs uppercase tracking-[4px] text-neutral-500 mb-3">
            About Us
          </p>
          <h1 className="text-3xl md:text-5xl font-light tracking-tight leading-tight text-neutral-900 mb-6">
            Everyday essentials.
            <br className="hidden md:block" />
            Made for the way you live.
          </h1>
          <p className="text-neutral-600 leading-relaxed font-light text-[15px] max-w-3xl">
            We're a clothing brand built around one idea: you shouldn't have to
            choose between comfort, quality, and price. Every piece is designed to
            be worn every day — by anyone, anywhere, from 16 to 40, from class to
            campus to the coffee shop.
          </p>
        </section>

        {/* ── Intro paragraph ── */}
        <section className="max-w-3xl">
          <p className="text-neutral-600 leading-relaxed font-light text-[15px] text-justify">
            We started with a simple question: why is it so hard to find clothes
            that actually fit into your life? Most brands either chase trends
            you'll forget in a season, or charge prices that make no sense for a
            basic tee. We built our label to sit right in the middle — relaxed
            silhouettes, honest fabrics, and a price tag that respects your wallet.
            No gimmicks, no over-designing. Just clothes that work.
          </p>
        </section>

        {/* ── Two-column: Our Story + Founder's Note ── */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 pt-8 border-t border-neutral-200">
          <div>
            <p className="text-xs uppercase tracking-[3px] text-neutral-500 mb-3">
              Our Story
            </p>
            <h2 className="text-2xl md:text-3xl font-light tracking-tight leading-snug text-neutral-900 mb-6">
              Built for real life, not for the runway.
            </h2>
            <p className="text-neutral-600 leading-relaxed font-light text-[15px] text-justify">
              We design in small drops, test with real people, and keep only what
              works. Every hoodie, tee, and pair of pants is wear-tested before it
              ever hits the site — washed, stretched, sat in, and lived in. If it
              doesn't hold up to a normal week, it doesn't make the cut. That's the
              whole standard.
            </p>
          </div>

          <div className="border border-neutral-200 p-8 md:p-10 bg-neutral-50">
            <p className="text-xs uppercase tracking-[3px] text-neutral-500 mb-3">
              A Note From Us
            </p>
            <p className="text-sm text-neutral-500 mb-4">
              — The Founders
            </p>
            <h3 className="text-xl font-light text-neutral-900 mb-5 leading-snug">
              We're not trying to be the biggest brand. Just the one you actually wear.
            </h3>
            <p className="text-neutral-600 leading-relaxed font-light text-sm text-justify mb-4">
              We grew up shopping the same racks you did — mid-range, mid-quality,
              mid-everything. We wanted something better without paying four times
              more for a logo. So we made it ourselves. Same fabric mills, same
              factories as brands three tiers up, but priced for the people who
              actually wear the clothes.
            </p>
            <p className="text-neutral-600 leading-relaxed font-light text-sm text-justify">
              If you're 16 or 40, if you're shopping for a first apartment or a
              full closet — these are for you. We'll keep it simple, keep it fair,
              and keep restocking the stuff you love.
            </p>
          </div>
        </section>

        {/* ── Values strip ── */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-b border-neutral-200 py-10">
          {[
            { value: "Unisex", label: "Fits Everyone" },
            { value: "Everyday", label: "Not Just Trends" },
            { value: "Fair", label: "Honest Pricing" },
            { value: "Durable", label: "Made To Last" },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl md:text-3xl font-light tracking-tight text-neutral-900">
                {item.value}
              </p>
              <p className="text-[11px] uppercase tracking-[2px] text-neutral-500 mt-2">
                {item.label}
              </p>
            </div>
          ))}
        </section>

        {/* ── Who it's for ── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: "For Students",
              body: "Budget-friendly basics that survive a full semester of back-to-back wears. Layer it, wash it, repeat.",
            },
            {
              title: "For 9-to-5",
              body: "Clean, neutral pieces that pass for smart-casual without feeling stiff. Comfort that works at a desk.",
            },
            {
              title: "For Weekends",
              body: "Oversized fits, soft fabrics, and colors that go with everything already in your wardrobe.",
            },
          ].map((item, i) => (
            <div key={i} className="border border-neutral-200 p-6 md:p-8">
              <h3 className="text-lg font-light text-neutral-900 mb-3">
                {item.title}
              </h3>
              <p className="text-sm text-neutral-600 leading-relaxed font-light">
                {item.body}
              </p>
            </div>
          ))}
        </section>

        {/* ── Closing paragraph ── */}
        <section className="max-w-3xl">
          <p className="text-neutral-600 leading-relaxed font-light text-[15px] text-justify">
            We're still small. Still figuring things out. But the mission hasn't
            changed: make clothes that real people actually want to wear, at a
            price that makes sense, in sizes and styles that work for everyone.
            If you're between 16 and 40 and tired of choosing between cheap and
            good — welcome. You're exactly who we built this for.
          </p>
        </section>

        {/* ── CTA ── */}
        <section className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-t border-neutral-200 pt-10">
          <div>
            <h3 className="text-xl font-light text-neutral-900 mb-2">
              Ready to see what we're about?
            </h3>
            <p className="text-sm text-neutral-500 font-light">
              New drops every few weeks. Restocks on the staples.
            </p>
          </div>
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 text-sm hover:bg-neutral-800 transition-colors duration-200 tracking-wider whitespace-nowrap"
          >
            Shop The Collection
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
          </a>
        </section>

      </div>
    </div>
  );
}