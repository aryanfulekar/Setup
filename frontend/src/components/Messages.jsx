import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetAllMessage from "@/hooks/useGetAllMessage";
import useGetRTM from "@/hooks/useGetRTM";

function Messages({ selectedUser }) {
  useGetRTM();
  useGetAllMessage();

  const { messages } = useSelector((store) => store.chat);
  const { user } = useSelector((store) => store.auth);

  if (!selectedUser) {
    return (
      <div className="flex items-center justify-center flex-1 text-gray-500">
        Select a user to start chatting
      </div>
    );
  }

  return (
    <div className="overflow-y-auto flex-1 p-4">
      {/* User Header */}
      <div className="flex justify-center mb-4">
        <div className="flex flex-col items-center justify-center">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={selectedUser?.profilePicture}
              alt={selectedUser?.username || "Profile"}
            />
            <AvatarFallback>
              {selectedUser?.username?.[0]?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>

          <span className="mt-2 font-semibold text-lg">
            {selectedUser?.username}
          </span>

          <Link to={`/profile/${selectedUser?._id}`}>
            <Button className="h-8 my-2" variant="secondary">
              View Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex flex-col gap-3">
        {messages?.length > 0 ? (
          messages.map((msg) => {
            // ✅ Ensure consistent type comparison
            const isMyMessage = String(msg?.senderId) === String(user?._id);

            return (
              <div
                key={msg?._id}
                className={`flex ${
                  isMyMessage ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`p-2 rounded-lg max-w-xs break-words ${
                    isMyMessage
                      ? "bg-blue-500 text-white" // My message (right)
                      : "bg-gray-200 text-black" // Other user's message (left)
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500">No messages yet</p>
        )}
      </div>
    </div>
  );
}

export default Messages;
