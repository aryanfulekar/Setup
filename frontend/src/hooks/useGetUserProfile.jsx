import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";

import { setUserProfile } from "@/redux/authSlice";

const useGetUserProfile = (id) => {
  const dispatch = useDispatch();

  // getAllSuggestedUsers(start)~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/v1/user/${id}/profile`,
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setUserProfile(res.data.user));
      }
      return;
    } catch (error) {
      console.log("Error fetching user", error);
    }
  };
  // getAllSuggestedUsers(end)~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // useEffect for network call (Start).....................................................
  useEffect(() => {
    fetchUserProfile();
  }, [dispatch,id]);
  // useEffect for network call (End).......................................................
};

export default useGetUserProfile;
