import HeroSection from "@/components/HomeComponents/HeroSection/HeroSection";
import HomeCategory from "@/components/HomeComponents/Furit&Veges/HomeCategory";
import BestSellers from "@/components/HomeComponents/BestSeller/BestSellers";
import WrapperMargin from "@/constants/WrapperMargin";
import React from "react";
import MostRated from "@/components/HomeComponents/BestSeller/MostRated";

export default function Home() {
  return (
    <section className="my-5" dir="rtl">
      <WrapperMargin>
        <HeroSection />
        <div className="text-right">
          <HomeCategory />
        </div>
        <div className="text-right">
          <BestSellers />
        </div>
        <div className="text-right">
          <MostRated />
        </div>
      </WrapperMargin>
    </section>
  );
}
