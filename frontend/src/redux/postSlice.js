import { createSlice } from "@reduxjs/toolkit";

export const postSlice = createSlice({
  name: "post",
  initialState: {
    posts: [],
    likeRefresh: false,
    commentRefresh: false,
    selectedPost: null,
  },

  reducers: {
    // reducer functions :)
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    setLikeRefresh: (state, action) => {
      state.likeRefresh = action.payload;
    },
    setCommentRefresh: (state, action) => {
      state.commentRefresh = action.payload;
    },
    setSelectedPost: (state, action) => {
      state.selectedPost = action.payload;
    },
  },
});

export const { setPosts, setLikeRefresh, setCommentRefresh, setSelectedPost } =
  postSlice.actions;

export default postSlice.reducer;
