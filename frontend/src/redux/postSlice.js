import { createSlice } from "@reduxjs/toolkit";

export const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    
  },

  reducers: {
    // reducer functions :)
    setPosts: (state, action) => {
      state.posts = action.payload;
    },

  },
});

export const { setPosts } = postSlice.actions;

export default postSlice.reducer;
