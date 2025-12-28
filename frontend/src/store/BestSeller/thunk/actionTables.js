  import { createAsyncThunk } from "@reduxjs/toolkit";
  import axios from "axios";
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const actionTables = createAsyncThunk(
    "tables/fetchtables",
    async (_, thunkAPI) => {
      const { rejectWithValue } = thunkAPI;

      try {
        const response = await axios.get(`${BASE_URL}/api/product/mostRated`);
        const products = response.data;
        return products;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          return rejectWithValue(error.response?.data.message || error.message);
        } else {
          return rejectWithValue("An unexpected error");
    }
      }
    }
  );

  export default actionTables;