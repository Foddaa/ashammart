import { createSlice } from "@reduxjs/toolkit";
import actionMostRated from "@/components/HomeComponents/MostRated/actionMostRated";

const initialState = {
  products: [],
  loading: false,
  error: null,
  totalItems: 0,
  totalPages: 0,
  currentPage: 0,
};

const mostRatedSlice = createSlice({
  name: "mostRated",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(actionMostRated.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actionMostRated.fulfilled, (state, action) => {
        // action.payload is the paginated response from the backend
        state.products = action.payload.products || [];
        state.totalItems = action.payload.totalItems || 0;
        state.totalPages = action.payload.totalPages || 0;
        state.currentPage = action.payload.currentPage || 0;
        state.loading = false;
        state.error = null;
      })
      .addCase(actionMostRated.rejected, (state, action) => {
        state.error = action.payload || "Failed to load most rated products";
        state.loading = false;
        state.products = [];
      });
  },
});

export default mostRatedSlice.reducer;