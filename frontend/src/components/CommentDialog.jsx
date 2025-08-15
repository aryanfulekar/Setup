import React from "react";
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
            <div className="w-1/2 flex flex-col justify-between">
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
                  <DialogContent className={"flex items-center"}>

               
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export default CommentDialog;
