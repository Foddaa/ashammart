import bestSeller from "../components/HomeComponents/BestSeller/bestSellerSlice.js";
import cart from "./cart/cartSlice.js";
import categoryProducts from './categorySlice/categorySlices.js'
import homeproducts from "./HomeCategoryProducts/homecategoryslice.js"
import { configureStore } from "@reduxjs/toolkit";
import mostRated from "../components/HomeComponents/MostRated/mostRatedSlice.js";
import newArrivals from "../components/HomeComponents/NewArrivals/newArrivalsSlice.js";


export const store = configureStore({
  reducer: {
    cart,
    bestSeller,
    homeproducts,
    categoryProducts,
    mostRated,
    newArrivals
  },
});