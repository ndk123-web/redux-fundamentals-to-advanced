import { createSlice } from "@reduxjs/toolkit";
import { fetchPost } from "../thunks/fetchPost.thunk";
import { loading, notLoading } from "../slices/load.slice.js";

const initialState = {
  auth: false,
  user: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.auth = true;
      state.user = action.payload.user;
    },
    logout: (state) => {
      state.auth = false;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
