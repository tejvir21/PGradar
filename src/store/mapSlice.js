import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiFetch } from "../utils/api";

export const fetchPGs = createAsyncThunk(
  "map/fetchPGs",
  async ({ lat, lng, radius } = {}) => {
    let url = "/pgs";
    if (lat && lng) {
      url += `?lat=${lat}&lng=${lng}&radius=${radius || 5}`;
    }
    return apiFetch(url);
  }
);

const mapSlice = createSlice({
  name: "map",
  initialState: {
    pgs: [],
    selectedPG: null,
  },
  reducers: {
    setSelectedPG(state, action) {
      state.selectedPG = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPGs.fulfilled, (state, action) => {
      state.pgs = action.payload;
    });
  },
});

export const { setSelectedPG } = mapSlice.actions;
export default mapSlice.reducer;
