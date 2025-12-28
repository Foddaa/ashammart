import React from "react";
import SideLeftCart from "../components/checkout/SideLeftCart";
import SideRightCart from "../components/checkout/SideRightCart";
import WrapperMargin from "@/constants/WrapperMargin";

const Checkout = () => {
  return (
    <div className="mt-5" dir="rtl">
      <WrapperMargin>
        <div className="flex flex-col-reverse md:flex-row-reverse md:gap-4 md:items-start w-full">
          <div className="flex-1 mb-4">
            <SideLeftCart />
          </div>
          <div className="flex-1 mb-12 mt-5">
            <SideRightCart />
          </div>
        </div>
      </WrapperMargin>
    </div>
  );
};

export default Checkout;
