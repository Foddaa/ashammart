import HeroSection from "@/components/HomeComponents/HeroSection/HeroSection";
import HomeCategory from "@/components/HomeComponents/Furit&Veges/HomeCategory";
import BestSellers from "@/components/HomeComponents/BestSeller/BestSellers";
import WrapperMargin from "@/constants/WrapperMargin";
import React from "react";
import MostRated from "@/components/HomeComponents/BestSeller/MostRated";

export default function Home() {
  return (
    <section className="w-full bg-white py-4 md:py-6" dir="ltr">
      <WrapperMargin>
        {/* Hero Section */}
        <div className="w-full text-left">
          <HeroSection />
        </div>

        {/* Categories Section */}
        <div className="w-full text-left mt-12">
          <HomeCategory />
        </div>

        {/* Best Sellers Section */}
        <div className="w-full text-left mt-12">
          <BestSellers />
        </div>

        {/* Most Rated Section */}
        <div className="w-full text-left mt-12">
          <MostRated />
        </div>
      </WrapperMargin>
    </section>
  );
}