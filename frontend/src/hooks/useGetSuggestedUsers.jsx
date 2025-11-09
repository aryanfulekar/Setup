import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";

import { setSuggestedUsers } from "@/redux/authSlice";

const useGetSuggestedUsers = () => {
  const dispatch = useDispatch();

  // getAllSuggestedUsers(start)~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const fetchSuggestedUsers = async () => {
    try {
      const res = await axios.get(
        `https://setup-1-l50c.onrender.com/api/v1/user/suggested`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setSuggestedUsers(res.data.users));
      }
    } catch (error) {
      console.log("Error fetching suggested users", error);
    }
  };
  // getAllSuggestedUsers(end)~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // useEffect for network call (Start).....................................................
  useEffect(() => {
    fetchSuggestedUsers();
  }, [dispatch]);
  // useEffect for network call (End).......................................................
};

export default useGetSuggestedUsers;
