import bestSeller from "./BestSeller/bestsellerslice.js";
import cart from "./cart/cartSlice.js";
import search from './Search/searchslice.js'
import categoryProducts from './categorySlice/categorySlices.js'
import homeproducts from "./HomeCategoryProducts/homecategoryslice.js"
import productDetailsReducer from "./productDetails/productDetailsSlice.js";
import { configureStore } from "@reduxjs/toolkit";
import tables from "./BestSeller/tableSlice.js";


export const store = configureStore({
  reducer: {
    productDetails: productDetailsReducer,
    cart,
    bestSeller,
    homeproducts,
    categoryProducts,
    search,
    tables
  },
});