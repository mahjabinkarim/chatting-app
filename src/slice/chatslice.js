import { createSlice } from "@reduxjs/toolkit";

// LocalStorage theke selected user load korar try korbo
const initialUser = localStorage.getItem("selectedChatUser")
  ? JSON.parse(localStorage.getItem("selectedChatUser"))
  : null;

const chatSlice = createSlice({
  name: "selectedChatUser",
  initialState: { value: initialUser },
  reducers: {
    setChatUser: (state, action) => {
      state.value = action.payload;
    },
    clearChatUser: (state) => {
      state.value = null;
    },
  },
});

export const { setChatUser, clearChatUser } = chatSlice.actions;
export default chatSlice.reducer;
