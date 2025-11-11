import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FiMessageCircle } from "react-icons/fi";
import { IoSend } from "react-icons/io5";
import { FaRegBookmark } from "react-icons/fa";
import CommentDialog from "./CommentDialog";
import { Input } from "./ui/input";

import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import {
  setCommentRefresh,
  setLikeRefresh,
  setPosts,
  setSelectedPost,
} from "@/redux/postSlice";
import { Badge } from "./ui/badge";
function Post({ post }) {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  const { posts, likeRefresh, commentRefresh } = useSelector(
    (store) => store.post
  );

  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [liked, setLiked] = useState(post?.likes.includes(user?._id) || false);
  const [postLike, setPostLike] = useState(post.likes.length);
  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const deletePostHandler = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/v1/post/delete/${post?._id}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        let updatedPosts = posts.filter(
          (thisPost) => thisPost?._id != post?._id
        );
        dispatch(setPosts(updatedPosts));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const likeOrDislikeHandler = async () => {
    try {
      const action = liked ? "dislike" : "like";
      const res = await axios.get(
        `http://localhost:8000/api/v1/post/${post?._id}/${action}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        const updatedLikes = liked ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        toast.success(res.data.message);
        setLiked((prevData) => !prevData); // i added this logic...
        dispatch(setLikeRefresh(!likeRefresh));
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${post?._id}/comment`,
        { text },
        {
          headers: { "content-Type": "application/json" },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setCommentRefresh(!commentRefresh));
        setText("");
      }
    } catch (error) {}
  };

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center">
        <div className=" flex items-center gap-2 justify-between w-full">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={post?.author?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex gap-2 items-center">
              <h1>{post?.author?.username}</h1>
              {user?._id === post?.author?._id&&<Badge variant="secondary">Author</Badge>}
            </div>
          </div>
          <div>
            <Dialog>
              <DialogTrigger asChild>
                <MoreHorizontal className="cursor-pointer"></MoreHorizontal>
              </DialogTrigger>
              <DialogContent className={"flex flex-col items-center"}>
                <Button
                  variant={"ghost"}
                  className={
                    "cursor-pointer w-fit text-[#ED4956] font-bold border border-black"
                  }
                >
                  Unfollow
                </Button>
                <Button variant={"ghost"} className={"cursor-pointer w-fit "}>
                  Add to favorites
                </Button>

                {user && user?._id === post?.author?._id && (
                  <Button
                    variant={"ghost"}
                    className={"cursor-pointer w-fit text-[#ED4956] "}
                    onClick={deletePostHandler}
                  >
                    Delete
                  </Button>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      <img
        src={post?.image}
        alt="post_img"
        className="rounded-sm my-2 w-full aspect-square object-cover"
      />

      <div className="flex justify-between">
        <div className="flex gap-3 ">
          <FaHeart
            size={"22px"}
            className={`cursor-pointer hover:text-gray-600 ${
              liked ? "text-red-500" : "text-gray-400"
            }`}
            onClick={likeOrDislikeHandler}
          />

          <FiMessageCircle
            size={"22px"}
            className="cursor-pointer hover:text-gray-600"
            onClick={() => {
              setOpen(true);
              dispatch(setSelectedPost(post));
            }}
          />
          <IoSend
            size={"22px"}
            className="cursor-pointer hover:text-gray-600"
          />
        </div>
        <FaRegBookmark size={"22px"} className="cursor-pointer hover:text-gray-600" />
      </div>
      <span className="font-medium block mb-2">{postLike} Likes</span>
      <p>
        <span className="font-medium mr-2">{post?.author?.username}</span>
        {post?.caption}
      </p>
      <span
        className="cursor-pointer  hover:text-gray-600 "
        onClick={() => {
          setOpen(true);
          dispatch(setSelectedPost(post));
        }}
      >
        {post?.comments?.length > 0 &&
          ` View all ${post?.comments?.length} comments`}
      </span>
      <CommentDialog open={open} setOpen={setOpen} />
      <div className="flex items-center">
        <Input
          type="text"
          placeholder={"Add a comment..."}
          className="outline-none text-sm w-full mt-1"
          value={text}
          onChange={changeEventHandler}
        ></Input>
        {text && (
          <span
            onClick={commentHandler}
            className="text-[#3BADF8] cursor-pointer"
          >
            Post
          </span>
        )}
      </div>
    </div>
  );
}

export default Post;
