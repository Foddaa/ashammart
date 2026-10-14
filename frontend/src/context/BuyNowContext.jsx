import React, { createContext, useContext, useState } from 'react';

const BuyNowContext = createContext();

export const BuyNowProvider = ({ children }) => {
  const [buyNowProduct, setBuyNowProduct] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openBuyNow = (product) => {
    setBuyNowProduct(product);
    setIsDrawerOpen(true);
  };

  const closeBuyNow = () => {
    setIsDrawerOpen(false);
    setBuyNowProduct(null);
  };

  return (
    <BuyNowContext.Provider value={{ buyNowProduct, isDrawerOpen, openBuyNow, closeBuyNow }}>
      {children}
    </BuyNowContext.Provider>
  );
};

export const useBuyNow = () => useContext(BuyNowContext);