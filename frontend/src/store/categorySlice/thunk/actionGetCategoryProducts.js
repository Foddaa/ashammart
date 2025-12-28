
import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// API Thunk
const fetchGateoryProducts = createAsyncThunk(
  'products/fetchGateoryProducts',
  async (_, thunkAPI) => {

    try {
      const res = await axios.get(`${BASE_URL}/api/product/byCategory?categoryId=1`); // fetch more to ensure all IDs are included

      const filteredProducts = res.data.products

      return filteredProducts;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export default fetchGateoryProducts;