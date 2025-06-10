import { createAsyncThunk } from "@reduxjs/toolkit";
import { loading, notLoading } from "../slices/load.slice.js";

/*
    createAsyncThunk's first arguement was args and second was thunkApi 
    and inside that thunkApi we have dispatch , getState and more function

    below we get the dispatch from thunkAPI directly as u can see below
*/

const fetchPost = createAsyncThunk(
  "loading/fetchposts",
  async (_, { dispatch , getState}) => {
    try {
      dispatch(loading());

      console.log("State: ", getState());

      // Simulate network delay for 2 seconds  
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const posts = await fetch(
        "https://api.freeapi.app/api/v1/public/quotes/quote/random"
      );
      const result = await posts.json();
      console.log("Result From API: ", result);

      return result;
    } catch (error) {
      console.log("Error: ", error);
      throw error;
    } finally {
      dispatch(notLoading());
    }
  }
);

export { fetchPost };
