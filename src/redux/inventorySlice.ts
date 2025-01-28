import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface InventoryItem {
  condition: string;
  description: string;
  product_type: string;
  price: number;
  timestamp: string;
}

interface InventoryState {
  data: InventoryItem[];
  filters: {
    condition?: string;
    description?: string;
    timestamp?: string;
  };
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: InventoryState = {
  data: [],
  filters: {
    condition: "",
    description: "",
    timestamp: "",
  },
  status: "idle",
  error: null,
};

export const fetchInventory = createAsyncThunk(
  "inventory/fetchInventory",
  async (filters: Partial<InventoryState["filters"]>, { rejectWithValue }) => {
    try {
      const response = await axios.get<InventoryItem[]>(
        "http://localhost:5000/api/inventory",
        {
          params: filters,
        }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    setFilter(
      state,
      action: PayloadAction<Partial<InventoryState["filters"]>>
    ) {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchInventory.fulfilled,
        (state, action: PayloadAction<InventoryItem[]>) => {
          state.status = "succeeded";
          state.data = action.payload;
        }
      )
      .addCase(fetchInventory.rejected, (state, action: PayloadAction<any>) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { setFilter } = inventorySlice.actions;
export default inventorySlice.reducer;
