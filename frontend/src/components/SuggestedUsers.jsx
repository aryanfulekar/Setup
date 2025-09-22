import React from "react";

import { useSelector } from "react-redux";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
function SuggestedUsers() {
  const { suggestedUsers } = useSelector((store) => store.auth);
  return (
    <div className="my-10">
      <div className="flex items-center justify-center gap-3 text-sm">
        <h1 className="font-semibold text-gray-600">Suggested for you</h1>
        <span className="font-medium cursor-pointer">See All</span>
      </div>
      {suggestedUsers.map((user) => {
        return (
          <div key={user._id} className="flex items-center justify-between">
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
                <span className="text-gray-600">
                  {user?.bio || "Bio here..."}
                </span>
              </div>
            </div>
            <span className="text-[#3BADF8] text-xs font-bold cursor-pointer hover:text-[#1e76b0]">Follow</span>
          </div>
        );
      })}
    </div>
  );
}

export default SuggestedUsers;
