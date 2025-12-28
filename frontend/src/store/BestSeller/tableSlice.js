import { createSlice }  from "@reduxjs/toolkit";
import actionTables from "./thunk/actionTables";


const initialState = {
  products: [],
  loading: 'idle',
  error: null,
}

const tablesSlice = createSlice({
  name: "tables",
  initialState: {
    products: [],
    error: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(actionTables.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actionTables.fulfilled, (state, action) => {
        state.products = action.payload; // ✅ This should match what API returns
        state.loading = false;
      })
      .addCase(actionTables.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default tablesSlice.reducer; 