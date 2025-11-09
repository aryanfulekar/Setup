import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setMessages } from "@/redux/chatSlice";

const useGetAllMessage = () => {
  const dispatch = useDispatch();

  const {selectedUser} =useSelector(store=>store.auth)

  // fetchAllMessage(start)~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const fetchAllMessage = async () => {
    try {
      const res = await axios.get(`https://setup-1-l50c.onrender.com/api/v1/message/all/${selectedUser?._id}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setMessages(res.data.messages));
      }
    } catch (error) {
      console.log("Error fetching posts", error);
    }
  };
  // fetchAllMessage(end)~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // useEffect for network call (Start).....................................................
  useEffect(() => {
    fetchAllMessage();
   
  }, [selectedUser,dispatch]);
  // useEffect for network call (End).......................................................
};

export default useGetAllMessage;
