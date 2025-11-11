import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { setAuthUser } from "@/redux/authSlice"; // ✅ add this action if not already imported

function SuggestedUsers() {
  const dispatch = useDispatch();
  const { suggestedUsers, user } = useSelector((store) => store.auth);
  const [localUser, setLocalUser] = useState(user); // local copy to instantly reflect UI

  // ✅ Follow / Unfollow Handler
  const followOrUnfollowHandler = async (targetUser) => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/user/followorunfollow/${targetUser?._id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);

        // ✅ Update local user instantly
        let updatedFollowing;
        if (localUser.following.includes(targetUser._id)) {
          // Unfollowed
          updatedFollowing = localUser.following.filter(
            (id) => id !== targetUser._id
          );
        } else {
          // Followed
          updatedFollowing = [...localUser.following, targetUser._id];
        }

        const updatedUser = { ...localUser, following: updatedFollowing };
        setLocalUser(updatedUser);

        // ✅ Update Redux store user (optional but recommended)
        dispatch(setAuthUser(updatedUser));
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="my-10">
      <div className="flex items-center justify-center gap-3 text-sm">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
        <span className="font-medium cursor-pointer">See All</span>
      </div>

      {suggestedUsers.map((eachUser) => {
        const isFollowing = localUser?.following.includes(eachUser?._id);

        return (
          <div key={eachUser._id} className="flex items-center justify-between my-2">
            <div className="flex items-center gap-2">
              <Link to={`/profile/${eachUser?._id}`}>
                <Avatar>
                  <AvatarImage src={eachUser?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>

              <div>
                <Link to={`/profile/${eachUser?._id}`}>
                  <h1 className="font-semibold text-sm">{eachUser?.username}</h1>
                </Link>
                <span className="text-gray-600 text-xs">
                  {eachUser?.bio || "Bio here..."}
                </span>
              </div>
            </div>

            <span
              className={`text-xs font-bold cursor-pointer ${
                isFollowing
                  ? "text-red-500 hover:text-red-700"
                  : "text-[#3BADF8] hover:text-[#1e76b0]"
              }`}
              onClick={() => followOrUnfollowHandler(eachUser)}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default SuggestedUsers;
