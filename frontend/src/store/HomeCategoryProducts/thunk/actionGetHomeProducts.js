import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fetchProducts = createAsyncThunk("homeproducts/fetchProducts", async (_, thunkAPI) => {
  const { rejectWithValue } = thunkAPI;
  const token = localStorage.getItem("token"); // ✅ retrieve token

  try {
    const response = await axios.get(`${BASE_URL}/api/product/all`);
    dispatch(setProducts(response));
    return response; // or response.data if already sliced from backend
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return rejectWithValue(error.response?.data.message || error.message);
    } else {
      return rejectWithValue("An unexpected error");
    }
  }
});
export default fetchProducts;

