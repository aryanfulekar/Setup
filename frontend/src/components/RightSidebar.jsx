import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import SuggestedUsers from "./SuggestedUsers";

function RightSidebar() {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  return (
    <div className="w-fit my-10 pr-32">
      <div className="flex items-center gap-2">
        <Link to={`/profile/${user?._id}`}>
          <Avatar>
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Link>

        <div className="">
          <Link to={`/profile/${user?._id}`}>
            <h1 className="font-semibold text-sm">{user?.username}</h1>
          </Link>
          <span className="text-gray-600">{user?.bio || "Bio here..."}</span>
        </div>
      </div>

      <SuggestedUsers />
    </div>
  );
}

export default RightSidebar;
