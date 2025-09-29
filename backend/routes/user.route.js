import express from "express";

import {
  acceptFriendRequest,
  editProfile,
  followOrUnfollow,
  friendRequest,
  getAllPendingRequest,
  getProfile,
  getSuggestedUsers,
  login,
  logout,
  register,
} from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { upload } from "../middlewares/multer.js";

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/:id/profile").get(isAuthenticated, getProfile);
router
  .route("/profile/edit")
  .post(isAuthenticated, upload.single("profilePicture"), editProfile);

router.route("/suggested").get(isAuthenticated, getSuggestedUsers);

router.route("/followorunfollow/:id").get(isAuthenticated, followOrUnfollow);

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
router.route("/friendrequest/:id").get(isAuthenticated,friendRequest);
router.route("/getallpendingrequest").get(isAuthenticated,getAllPendingRequest);
router.route(`/acceptpendingrequest/:requesterId/:requestId`).get(isAuthenticated,acceptFriendRequest)
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

export default router;
