import React, { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSelector } from "react-redux";
import axios from "axios";
function Test() {
  const { user } = useSelector((store) => store.auth);
  const [text, setText] = useState("hello");
  const [pendingUser, setPendingUser] = useState([]);

  const getAllPendingRequest = async () => {
    try {
      const res = await axios.get(
        `https://setup-1-l50c.onrender.com/api/v1/user/getallpendingrequest`,
        {
          headers: { "content-Type": "application/json" },
          withCredentials: true,
        }
      );

      // res?.data?.pendingReceived?.map((request) => console.log(request._id));
      setPendingUser(res?.data?.pendingReceived);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col max-w-2xl mx-auto pl-10 bg-amber-200">
      <Button
        onClick={() => {
          setText("hello world");
        }}
        className={`w-30`}
      >
        see pending
      </Button>
      <div>hee</div>
      <div>{text}</div>

      <Dialog>
        <DialogTrigger>
          <Button onClick={getAllPendingRequest}>see pending</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {pendingUser.map((user) => {
            return <div className="bg-amber-700">{user?._id}</div>;
          })}
        </DialogContent>
      </Dialog>

      <DropdownMenu>
        <DropdownMenuTrigger>Open</DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {pendingUser.map((user) => {
            return (
              <DropdownMenuItem>
                <Avatar>
                  <AvatarImage src={user?.requester?.profilePicture} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span>
                  <Button variant={`secondary`}>Accept</Button>
                </span>
                <span>
                  <Button variant={`Destructive`} className={`bg-red-500`}>
                    Reject
                  </Button>
                </span>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>

    
    </div>
  );
}

export default Test;
