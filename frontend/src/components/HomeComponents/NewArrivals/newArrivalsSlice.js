import { createSlice } from "@reduxjs/toolkit";
import actionNewArrivals from "@/components/HomeComponents/NewArrivals/actionNewArrivals";

const initialState = {
  products: [],
  loading: false,
  error: null,
  totalItems: 0,
  totalPages: 0,
  currentPage: 0,
};

const newArrivalsSlice = createSlice({
  name: "newArrivals",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(actionNewArrivals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actionNewArrivals.fulfilled, (state, action) => {
        // action.payload is the paginated response from the backend
        state.products = action.payload.products || [];
        state.totalItems = action.payload.totalItems || 0;
        state.totalPages = action.payload.totalPages || 0;
        state.currentPage = action.payload.currentPage || 0;
        state.loading = false;
        state.error = null;
      })
      .addCase(actionNewArrivals.rejected, (state, action) => {
        state.error = action.payload || "Failed to load new arrivals";
        state.loading = false;
        state.products = [];
      });
  },
});

export default newArrivalsSlice.reducer;    