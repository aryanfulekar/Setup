import { User } from "../models/user.model.js";
import { Post } from "../models/post.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import cloudinary from "../utils/cloudinary.js";
// dotenv----------------------------
import dotenv from "dotenv";
dotenv.config();
// dotenv----------------------------
import * as fs from "fs";

// Register or SignUp (start)--------------------------------------------------------------------------------

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(401).json({
        message: "something is missing, please check!",
        success: false,
      });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(401).json({
        message: "Try different email",
        success: false,
      });
    }
    // hashing password by bcryptjs
    const hashedPassword = await bcryptjs.hash(password, 10);
    // Create account-------------------------------------------------------------------
    await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "Account created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};
// Register or SignUp (end)--------------------------------------------------------------------------------

// Login or Signin (start)---------------------------------------------------------------------------------

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // basic validation
    if (!email || !password) {
      return res.status(401).json({
        message: "Something is missing, please check!",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "incorrect email or password",
        success: false,
      });
    }

    // Comparing login form input password with actual user password  by bcryptjs
    // bcryptjs.compare() returns boolean value (T/F)
    const isPasswordMatch = await bcryptjs.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "incorrect email or password",
        success: false,
      });
    }

    // payload~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const tokenData = {
      userId: user._id,
    };
    // jwt.sign(payload,secret or private key,....) method generate and return jwt token.
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET, {
      expiresIn: "1d",
    });
    // Creating user object------------------------------------------------------------
    user = await User.findById(user._id).populate("posts").select("-password"); // Excludes password

    return res
      .status(200)
      .cookie("token", token, {
        maxAge: 1 * 24 * 60 * 60 * 1000,
        sameSite: "strict", // Prevents CSRF attacks
        httpOnly: true,
        secure: true,
      })
      .json({
        message: `Welcome back ${user.username}`,
        success: true,
        user,
      });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

// Login or Signin (end)---------------------------------------------------------------------------------

// Logout (start)----------------------------------------------------------------------------------------
export const logout = (_, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 0, // Instantly expires the cookie
      })
      .json({ message: "Logged out successfully.", success: true });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};

// Logout (end)------------------------------------------------------------------------------------------

// Get profile (start)-----------------------------------------------------------------------------------
export const getProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    // Validate if userId exists
    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
        success: false,
      });
    }

    // Fetch user and exclude password
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    return res.status(200).json({
      user,
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

// Get profile (end)-------------------------------------------------------------------------------------

// Edit Profile (start)----------------------------------------------------------------------------------

export const editProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { bio, gender, password } = req.body;
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~(CLOUDINARY)~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    const profilePicture = req.file;
    let cloudResponse;

    // Handle profile picture upload if provided

    if (profilePicture) {
      try {
        cloudResponse = await cloudinary.uploader.upload(profilePicture.path);
      } catch (uploadError) {
        return res.status(500).json({
          message: "Profile picture upload failed.",
          success: false,
        });
      }
      // Delete the file after upload(Start)~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // Delete file only if uploaded
      fs.unlink(profilePicture.path, (err) => {
        if (err) console.log("Error deleting file:", err);
        else console.log("File deleted successfully");
      });
      // Delete the file after upload(End)~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    }
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~(CLOUDINARY)~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    let hashedPassword;
    if (password) {
      hashedPassword = await bcryptjs.hash(password, 10);
    }

    const updateData = {
      ...(bio !== undefined && { bio }),
      ...(gender !== undefined && { gender }),
      ...(cloudResponse?.secure_url && {
        profilePicture: cloudResponse.secure_url,
      }),
      ...(hashedPassword && { password: hashedPassword }),
    };
    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, select: "-password" } // Return updated user & exclude password
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Profile updated successfully.",
      success: true,
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
// Edit Profile (end)------------------------------------------------------------------------------------

// Get Suggested User (Start)----------------------------------------------------------------------------

export const getSuggestedUsers = async (req, res) => {
  try {
    const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select(
      "-password"
    );

    // Correctly check if the array is empty
    if (suggestedUsers.length === 0) {
      return res.status(400).json({
        message: "No suggested users available.",
        success: false,
      });
    }
    return res.status(200).json({
      success: true,
      users: suggestedUsers,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

// Get Suggested User (End)------------------------------------------------------------------------------

// Follow and Unfollow(Start)----------------------------------------------------------------------------

export const followOrUnfollow = async (req, res) => {
  try {
    const personWhoFollow = req.id; //getting from isAuthenticated
    const personToBeFollow = req.params.id; //getting from params

    if (personWhoFollow === personToBeFollow) {
      return res.status(400).json({
        message: "You can't follow/unfollow yourself",
        success: false,
      });
    }

    const user = await User.findById(personWhoFollow);
    const targetUser = await User.findById(personToBeFollow);

    if (!user || !targetUser) {
      return res.status(400).json({
        message: "User not found",
        success: false,
      });
    }

    // Main logic of follow and unfollow~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    const isFollowing = user.following.includes(personToBeFollow);

    if (isFollowing) {
      // unfollow logic
      await Promise.all([
        User.updateOne(
          { _id: personWhoFollow },
          { $pull: { following: personToBeFollow } }
        ),
        User.updateOne(
          { _id: personToBeFollow },
          { $pull: { followers: personWhoFollow } }
        ),
      ]);
      return res
        .status(200)
        .json({ message: "Unfollow successfully", success: true });
    } else {
      // follow logic
      await Promise.all([
        User.updateOne(
          { _id: personWhoFollow },
          { $push: { following: personToBeFollow } }
        ),
        User.updateOne(
          { _id: personToBeFollow },
          { $push: { followers: personWhoFollow } }
        ),
      ]);
      return res
        .status(200)
        .json({ message: "follow successfully", success: true });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
// Follow and Unfollow(End)---------------------------------------------------------------------------------
