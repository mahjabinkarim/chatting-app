import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slice/userslice"; // Users related state
import chatSlice from "./slice/chatslice"; // Chat user slice

const store = configureStore({
  reducer: {
    userData: userSlice, // User authentication & profile
    selectedChatUser: chatSlice, // Stores selected chat user
  },
});

export default store;
