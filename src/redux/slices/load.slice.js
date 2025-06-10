// This file contains the reducer for the "loading" state in our Redux store.
//
// The "loading" state is a boolean that indicates whether or not the app is
// currently loading data from the API. When the app is loading, we show a
// loading spinner to the user. When the app is not loading, we show the actual
// data.
//
// The reducer is created using the "createSlice" function from
// "@reduxjs/toolkit". This function takes an object with three properties:
// "name", "initialState", and "reducers".
//
// The "name" property specifies the name of the reducer. In this case, the name
// is "loading".
//
// The "initialState" property specifies the initial state of the reducer. In
// this case, the initial state is an object with a single property called
// "loading", which is set to "false".
//
// The "reducers" property specifies the reducer functions for the slice. In
// this case, we have two reducer functions: "loading" and "notLoading".
//
// The "loading" reducer function sets the "loading" property of the state to
// "true".
//
// The "notLoading" reducer function sets the "loading" property of the state to
// "false".
//
// In addition to the reducer functions, we also specify some "extraReducers".
// These are functions that are called whenever an action is dispatched that
// matches one of the specified action types.
//
// In this case, we have three extra reducers:
//
// 1. When the "fetchPost" action is fulfilled (i.e. the API call is successful),
//    we set the "loading" property of the state to "false".
// 2. When the "fetchPost" action is rejected (i.e. the API call fails), we set
//    the "loading" property of the state to "false".
// 3. When the "fetchPost" action is pending (i.e. the API call is in progress),
//    we set the "loading" property of the state to "true".
//
// Finally, we export the reducer functions and the reducer itself so that they
// can be used elsewhere in the app.

import { createSlice } from "@reduxjs/toolkit";
import { fetchPost } from "../thunks/fetchPost.thunk";

const loadSlice = createSlice({
  name: "loading",
  initialState: { loading: false },
  reducers: {
    loading: (state) => {
      // Set the "loading" property of the state to "true".
      state.loading = true;
    },
    notLoading: (state) => {
      // Set the "loading" property of the state to "false".
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // When the "fetchPost" action is fulfilled, set the "loading" property of
      // the state to "false".
      .addCase(fetchPost.fulfilled, (state) => {
        console.log("Fulfileed");
        state.loading = false;
      })

      // When the "fetchPost" action is rejected, set the "loading" property of
      // the state to "false".
      .addCase(fetchPost.rejected, (state) => {
        console.log("Api Reject");
        state.loading = false;
      })
      // When the "fetchPost" action is pending, set the "loading" property of
      // the state to "true".
      .addCase(fetchPost.pending, (state) => {
        console.log("Api Pending");
        state.loading = true;
      });
  },
});

// Export the reducer functions and the reducer itself.
export const { loading, notLoading } = loadSlice.actions;
export default loadSlice.reducer;

