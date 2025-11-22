import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";

import Comment from "./Comment";
import axios from "axios";
import { toast } from "sonner";
import { setCommentRefresh, setSelectedPost, } from "@/redux/postSlice";

function CommentDialog({ open, setOpen }) {
  
  const dispatch = useDispatch();

  const { selectedPost,commentRefresh } = useSelector((store) => store.post);
  const [text, setText] = useState("");

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };


  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/${selectedPost?._id}/comment`,
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
        dispatch(setSelectedPost({...selectedPost,comments:[res.data.comment,...(selectedPost?.comments || [])]})) // :)
        
      }
    } catch (error) {}
  };
  return (
    <div>
      <Dialog open={open}>
        <DialogContent
          onInteractOutside={() => {
            setOpen(false);
          }}
          className={"!max-w-5xl p-0 !flex"}
        >
          <div className="flex flex-1">
            <div className="w-1/2">
              <img
                src={selectedPost?.image}
                className="!w-full !h-full object-cover rounded-l-lg"
              />
            </div>
            <div className="w-1/2 flex flex-col justify-start">
              <div className="flex items-center justify-between p-4">
                <div className="flex gap-3 items-center">
                  <Link>
                    <Avatar>
                      <AvatarImage src={selectedPost?.author?.profilePicture} />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <Link className="font-semibold text-xs">
                      {selectedPost?.author?.username}
                    </Link>
                    {/* <span className="text-gray-600 text-sm">Bio her...</span> */}
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <MoreHorizontal className="cursor-pointer"></MoreHorizontal>
                  </DialogTrigger>
                  <DialogContent
                    className={
                      " flex flex-col items-center text-sm text-center"
                    }
                  >
                    <div className="cursor-pointer w-full  text-[#ED4956] font-bold">
                      Unfollow
                    </div>
                    <div className="cursor-pointer w-full ">
                      Add to favorite
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <hr />
              <div className=" flex-1 overflow-y-auto max-h-96 p-4">
                {selectedPost?.comments?.map((comment) => {
                  return <Comment key={comment?._id} comment={comment} />;
                })}
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    className="w-full outline-none border border-gray-300 p-2 rounded"
                    onChange={changeEventHandler}
                    value={text}
                  />
                  <Button
                    disabled={!text.trim()}
                    variant="outline"
                    onClick={sendMessageHandler}
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default CommentDialog;
