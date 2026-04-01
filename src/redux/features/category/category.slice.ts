import { createSlice } from "@reduxjs/toolkit";

export interface CategoryState {
  // Add any category-specific state here if needed
}

const initialState: CategoryState = {};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
});

export default categorySlice.reducer;
