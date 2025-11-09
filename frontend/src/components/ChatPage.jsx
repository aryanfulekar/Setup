import { setSelectedUser } from "@/redux/authSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { MessageCircleCode } from "lucide-react";
import { Input } from "./ui/input";
import Messages from "./Messages";
import { setMessages } from "@/redux/chatSlice";
import axios from "axios";

function ChatPage() {
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const { user, suggestedUsers, selectedUser } = useSelector(
    (store) => store.auth
  );
  const { onlineUsers } = useSelector((store) => store.chat); //it's an array
  const { messages } = useSelector((store) => store.chat);
  // *********************************************************************************************
  useEffect(() => {
    // clean up function :)
    // for deselecting the selected user :)
    return () => {
      dispatch(setSelectedUser(null));
    };
  }, []);
  // *********************************************************************************************
  //

  const sendMessageHandler = async (receiverId) => {
    try {
      const res = await axios.post(
        `https://setup-1-l50c.onrender.com/api/v1/message/send/${receiverId}`,
        { message },
        {
          headers: { "content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        dispatch(setMessages([...messages, res.data.newMessage]));
        setMessage("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex ml-[16%] h-screen max-w-[1350px]">
      <section className="w-full md:w-1/4 my-8">
        <h1 className="font-bold mb-4 px-3 text-xl">{user?.username}</h1>
        <hr className="mb-4 border-gray-300" />
        <div className="overflow-y-auto h-[80vh]">
          {suggestedUsers.map((suggestedUser) => {
            const isOnline = onlineUsers.includes(suggestedUser?._id); //:)
            return (
              <div
                onClick={() => {
                  dispatch(setSelectedUser(suggestedUser));
                }}
                className="flex gap-3 items-center p-3 hover:bg-gray-50 cursor-pointer"
              >
                <Avatar className="w-14 h-14 ">
                  <AvatarImage
                    className="rounded-full w-12 h-12"
                    src={suggestedUser?.profilePicture}
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{suggestedUser?.username}</span>
                  <span
                    className={`text-xs ${
                      isOnline ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isOnline ? "online" : "offline"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>
      {selectedUser ? (
        <section className="flex-1 border-l border-l-gray-300 flex flex-col h-full">
          <div className="flex gap-3 items-center px-3 py-2 border-b border-gray-300 sticky top-0 bg-white">
            <Avatar className="w-12 h-12 ">
              <AvatarImage
                className="rounded-full w-12 h-12"
                src={selectedUser?.profilePicture}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span>{selectedUser?.username}</span>
            </div>
          </div>
          <Messages selectedUser={selectedUser} />
          <div className="flex items-center justify-between">
            <Input
              type="text"
              className="border flex-1 mr-2 focus-visible:ring-transparent"
              placeholder="Messages..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <Button onClick={() => sendMessageHandler(selectedUser?._id)}>
              Send
            </Button>
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center mx-auto">
          <MessageCircleCode className="w-32 h-32 my-4"></MessageCircleCode>
          <h1 className="font-medium text-xl">Your messages</h1>
          <span>Send a message to start a chat.</span>
        </div>
      )}
    </div>
  );
}

export default ChatPage;
