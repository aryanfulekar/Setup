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
import { useSelector } from "react-redux";
import axios from "axios";
function Test() {
  const { user } = useSelector((store) => store.auth);
  const [text, setText] = useState("hello");
  const [pendingUser, setPendingUser] = useState([]);

  const getAllPendingRequest = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/user/getallpendingrequest`,
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
         {pendingUser.map((user)=>{
          return(
            <div className="bg-amber-700">
              {user?._id}
            </div>
          )
         })}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Test;
