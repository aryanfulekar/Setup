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

function Post() {
  const [text, setText] = useState("");
  const [open,setOpen] = useState(false)
  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };
  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center">
        <div className=" flex items-center gap-2 justify-between w-full">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <h1>username</h1>
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
                <Button
                  variant={"ghost"}
                  className={"cursor-pointer w-fit text-[#ED4956] "}
                >
                  Delete
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      <img
        src="https://images.unsplash.com/photo-1754597302822-4b96f3442d3f?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        alt="post_img"
        className="rounded-sm my-2 w-full aspect-square object-cover"
      />

      <div className="flex justify-between">
        <div className="flex gap-3 ">
          <FaRegHeart
            size={"22px"}
            className="cursor-pointer hover:text-gray-600"
          />
          <FiMessageCircle
            size={"22px"}
            className="cursor-pointer hover:text-gray-600"
           onClick={()=>{setOpen(true)}}
          />
          <IoSend
            size={"22px"}
            className="cursor-pointer hover:text-gray-600"
          />
        </div>
        <FaRegBookmark size={"22px"} className="" />
      </div>
      <span className="font-medium block mb-2">1k likes</span>
      <p>
        <span className="font-medium mr-2">username</span>
        caption
      </p>
      <span className="cursor-pointer  hover:text-gray-600" onClick={()=>{setOpen(true)}}>View all 10 comments</span>
      <CommentDialog open={open} setOpen={setOpen} />
      <div className="flex items-center">
        <Input
          type="text"
          placeholder={"Add a comment..."}
          className="outline-non text-sm w-full mt-1"
          value={text}
          onChange={changeEventHandler}
        ></Input>
        {text && <span className="text-[#3BADF8]">Post</span>}
      </div>
    </div>
  );
}

export default Post;
