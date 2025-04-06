import { createSlice } from "@reduxjs/toolkit";

export const userslice = createSlice({
  name: "userData",
  initialState: {
    value: JSON.parse(localStorage.getItem("userData")) || null, 
  },
  reducers: {
    setUserData: (state, action) => {
      
      const { uid, email, displayName, photoURL } = action.payload || {};
      state.value = { uid, email, displayName, photoURL };
    },
    clearUserData: (state) => {
      
      state.value = null;
      localStorage.removeItem("userData");
    },
  },
});

export const { setUserData, clearUserData } = userslice.actions;

export default userslice.reducer;
