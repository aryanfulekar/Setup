import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setMessages } from "@/redux/chatSlice"; //:)

const useGetRTM = () => {
  const dispatch = useDispatch();
  const { socket } = useSelector((store) => store.socketio); //:)
  const { messages } = useSelector((store) => store.chat); //:)
  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      dispatch(setMessages([...messages, newMessage]));
    });
    // cleanup function
    return () => {
      socket?.off('newMessage')
    };
  }, [setMessages, messages]);
};

export default useGetRTM;
