import { Post } from "../models/post.model.js";
import cloudinary from "../utils/cloudinary.js";
import { User } from "../models/user.model.js";
import { Comment } from "../models/comment.model.js";
import * as fs from "fs";
// Adding new Post(Start)---------------------------------------------------------------------------------

export const addNewPost = async (req, res) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.id;
    let cloudResponse;

    if (!image) {
      return res
        .status(400)
        .json({ message: "Image required", success: false });
    } else {
      try {
        cloudResponse = await cloudinary.uploader.upload(image.path);
      } catch (uploadError) {
        return res.status(500).json({
          message: "Profile picture upload failed.",
          success: false,
        });
      }

      // Delete the file after upload(Start)~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      fs.unlink(req.file.path, (err) => {
        if (err) console.log("Error deleting file:", err);
        else console.log("File deleted successfully");
      });
      // Delete the file after upload(End)~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    }

    const post = await Post.create({
      caption,
      image: cloudResponse.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId);

    if (user) {
      user.posts.push(post._id);
      await user.save();
    }

    await post.populate({ path: "author", select: "-password" });

    return res.status(201).json({
      message: "New Post added",
      post,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

// Adding new Post(End)-----------------------------------------------------------------------------------

// Get All Post(Start)------------------------------------------------------------------------------------

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } }, // ✅ Correct way to sort populated fields
        populate: { path: "author", select: "username profilePicture" }, // ✅ Fixed comma issue
      });

    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
// Get All Post(End)--------------------------------------------------------------------------------------

// Get User Post(Start)-----------------------------------------------------------------------------------

export const getUserPost = async (req, res) => {
  try {
    const authorId = req.id;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({
        path: "author",
        select: "username profilePicture",
      })
      .populate({
        path: "comments", // ✅ Use the correct field name
        options: { sort: { createdAt: -1 } }, // ✅ Correct way to sort populated fields
        populate: { path: "author", select: "username profilePicture" },
      });

    return res.status(200).json({
      posts,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
//  Get User Post(End)-------------------------------------------------------------------------------------

// Like Post(Start)-----------------------------------------------------------------------------------------
export const likePost = async (req, res) => {
  try {
    const idOfTheUserWhoLikesThePost = req.id;
    const postId = req.params.id;

    const post = await Post.findByIdAndUpdate(
      postId,
      { $addToSet: { likes: idOfTheUserWhoLikesThePost } }, // Prevents duplicate likes
      { new: true } // Returns updated post
    );

    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    }

    // Implement socket.io for real-time notification...

    return res.status(200).json({ message: "Post liked", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// Like Post(End)-----------------------------------------------------------------------------------------

// Dislike Post(Start)-----------------------------------------------------------------------------------------
export const dislikePost = async (req, res) => {
  try {
    const idOfTheUserWhoDislikesThePost = req.id;
    const postId = req.params.id;

    const post = await Post.findByIdAndUpdate(
      postId,
      { $pull: { likes: idOfTheUserWhoDislikesThePost } }, // Removes user from likes array
      { new: true } // Returns updated post
    );

    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    }

    // Implement socket.io for real-time notification...

    return res.status(200).json({ message: "Post disliked", success: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// Dislike Post(End)-----------------------------------------------------------------------------------------

// Add Comment(Start)-------------------------------------------------------------------------------------

export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const idOfTheCommenter = req.id;
    const { text } = req.body;

    if (!text) {
      return res
        .status(400)
        .json({ message: "Text is required", success: false });
    }

    // Check if post exists before adding a comment
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    }

    // Create comment
    let comment = await Comment.create({
      text,
      author: idOfTheCommenter,
      post: postId,
    });

    // Populate author details after creation
    comment = await comment.populate({
      path: "author",
      select: "username profilePicture",
    });

    // Update the post's comments array
    await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });

    return res.status(201).json({
      message: "Comment Added",
      comment,
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// Add Comment(End)---------------------------------------------------------------------------------------

// Get comment's of a post(Start)---------------------------------------------------------------------

export const getCommentsOfPost = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await Comment.find({ post: postId })
      .sort({ createdAt: -1 }) // ✅ Sort comments from newest to oldest
      .populate("author", "username profilePicture");

    return res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// Get comment's of a post(End)-----------------------------------------------------------------------

// Delete post(Start)---------------------------------------------------------------------------------

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;

    const post = await Post.findById(postId);
    // check if the logged-in user is the owner of the post
    if (post.author.toString() !== authorId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // delete post
    await Post.findByIdAndDelete(postId);
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // remove the post id from the user's post

    // let user = await User.findById(authorId);
    // user.posts = user.posts.filter((id) => id.toString() !== postId);
    // await user.save();

    // (or)
    // Remove the post ID from the user's posts array (optimized with $pull)
    await User.findByIdAndUpdate(authorId, { $pull: { posts: postId } });
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // delete associated comment

    await Comment.deleteMany({ post: postId });

    return res.status(200).json({
      success: true,
      message: "post deleted",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// Delete post(End)-----------------------------------------------------------------------------------

// Bookmark post(Start)----------------------------------------------------------------------------------------

export const bookmarkPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const authorId = req.id;
    const post = await Post.findById(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found", success: false });
    }

    const user = await User.findById(authorId);

    if (user.bookmarks.includes(post._id)) {
      // already bookmarked -> remove from the bookmark
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        type: "unsaved",
        message: "Post removed from bookmark",
        success: true,
      });
    } else {
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      return res.status(200).json({
        type: "saved",
        message: "Post bookmarked",
        success: true,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// Bookmark post(End)------------------------------------------------------------------------------------------
