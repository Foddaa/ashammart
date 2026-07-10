import { createSlice }  from "@reduxjs/toolkit";
import actionMostRated from "./thunk/actionMostRated";


const initialState = {
  products: [],
  loading: 'idle',
  error: null,
}

const mostRatedSlice = createSlice({
  name: "mostRated",
  initialState: {
    products: [],
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(actionMostRated.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actionMostRated.fulfilled, (state, action) => {
        state.products = action.payload;
        state.loading = false;
      })
      .addCase(actionMostRated.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default mostRatedSlice.reducer; 