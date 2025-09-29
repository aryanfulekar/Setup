import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: "" },
    bio: { type: String, default: "" },
    gender: { type: String, enum: ["male", "female"] },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],

    // 🔥 New fields to store FriendRequest documents~~~~~~~~~~~
    // it store FriendshipId, who send the request. :)
    friendRequestsSent: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Friendship" },
    ],
    // it store FriendshipId, who get the request. :)
    friendRequestsReceived: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Friendship" },
    ],
    // ✅ New field: list of friends
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
