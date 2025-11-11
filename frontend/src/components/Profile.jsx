import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Badge } from "@/components/ui/badge";
import { AtSign, Heart, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const [activeTab, setActiveTab] = useState("posts");
  const { id } = useParams();//
  useGetUserProfile(id); //custom hook
  const navigate = useNavigate();
  const { userProfile, user } = useSelector((store) => store.auth);
  const isLoggedInUserProfile = true;
  const isFollowing = true;

  const editProfile=()=>{
    navigate(`/account/edit`)
  }

  const displayedPost =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;

  return (
    <div className="flex max-w-4xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className={`h-32 w-32`}>
              <AvatarImage src={userProfile?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section className="">
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span>{userProfile?.username}</span>
                {isLoggedInUserProfile ? (
                  <div className="flex gap-2">
                    <Button
                      variant={`secondary`}
                      className={"hover:bg-gray-200"}
                      onClick={editProfile}
                    >
                      Edit Profile
                    </Button>
                    <Button
                      variant={`secondary`}
                      className={"hover:bg-gray-200"}
                    >
                      View archive
                    </Button>
                
                  </div>
                ) : isFollowing ? (
                  <>
                    <Button variant={`secondary`} className={``}>
                      Unfollow
                    </Button>
                    <Button className={``} variant={`secondary`}>
                      Message
                    </Button>
                  </>
                ) : (
                  <Button
                    variant={`secondary`}
                    className={`bg-[#0095F6] hover:bg-[#0a86df] h-8`}
                  >
                    Follow
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-4">
                <p>
                  <span className="font-semibold">
                    {userProfile?.posts.length}{" "}
                  </span>
                  post
                </p>
                <p>
                  <span className="font-semibold">
                    {" "}
                    {userProfile?.followers.length}
                  </span>{" "}
                  followers
                </p>
                <p>
                  <span className="font-semibold">
                    {userProfile?.following.length}{" "}
                  </span>
                  following
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <span className="font-semibold">
                  {userProfile?.bio || "bio here.."}
                </span>
                <Badge className={`w-fit`} variant="secondary">
                  <AtSign />
                  <span>{userProfile?.username}</span>
                </Badge>
                <span>😊Learn code with me...</span>
                <span>😊Turning code into fun</span>
                <span>😊DM for collaboration</span>
              </div>
            </div>
          </section>
        </div>
        <div className="border-t border-t-gray-200">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "posts" ? "font-bold" : ""
              }`}
              onClick={() => setActiveTab("posts")}
            >
              POSTS
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "saved" ? "font-bold" : ""
              }`}
              onClick={() => setActiveTab("saved")}
            >
              SAVED
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "reels" ? "font-bold" : ""
              }`}
              onClick={() => setActiveTab("reels")}
            >
              REELS
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "tags" ? "font-bold" : ""
              }`}
              onClick={() => setActiveTab("tags")}
            >
              TAGS
            </span>
          </div>
          <div
            className="grid grid-cols-3
           gap-1"
          >
            {displayedPost?.map((post) => {
              return (
                <div key={post?._id} className="relative group cursor-pointer">
                  <img
                    src={post?.image}
                    alt="postimage"
                    className="rounded-sm my-2 w-full aspect-square object-cover"
                  />
                  <div className=" absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-50 transition-opacity duration-300">
                    <div className="flex items-center text-white space-x-4">
                      <button className="flex items-center hover:text-gray-300">
                        <Heart /><span>{post.likes.length}</span>
                      </button>
                      <button className="flex items-center hover:text-gray-300">
                        <MessageCircle /><span>{post.comments.length}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
