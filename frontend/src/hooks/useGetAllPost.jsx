import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setPosts } from "@/redux/postSlice";
import { useSelector } from "react-redux";

const useGetAllPost = () => {
  const dispatch = useDispatch();

  // fetchAllPost(start)~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const fetchAllPost = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/v1/post/all`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setPosts(res.data.posts));
      }
    } catch (error) {
      console.log("Error fetching posts", error);
    }
  };
  // fetchAllPost(end)~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // useEffect for network call (Start).....................................................
  useEffect(() => {
    fetchAllPost();
  }, [dispatch]);
  // useEffect for network call (End).......................................................
};

export default useGetAllPost;
