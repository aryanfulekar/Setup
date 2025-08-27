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
function CommentDialog({ open, setOpen }) {
  const [text, setText] = useState("");

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const sendMessageHandler =async()=>{
    try {
      
    } catch (error) {
      
    }
  }

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
                src=" https://images.unsplash.com/photo-1754597302822-4b96f3442d3f?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="post_img"
                className="!w-full !h-full object-cover rounded-l-lg"
              />
            </div>
            <div className="w-1/2 flex flex-col justify-start">
              <div className="flex items-center justify-between p-4">
                <div className="flex gap-3 items-center">
                  <Link>
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <Link className="font-semibold text-xs">username</Link>
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
                comments ayenge
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
                  <Button disabled={!text.trim()} variant="outline" onClick={sendMessageHandler}>Send</Button>
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
