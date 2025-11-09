import { useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setPosts } from "@/redux/postSlice";
import { useSelector } from "react-redux";

const useGetAllPost = () => {
  const dispatch = useDispatch();

  const { likeRefresh, commentRefresh } = useSelector((store) => store.post);

  // fetchAllPost(start)~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  const fetchAllPost = async () => {
    try {
      const res = await axios.get(`https://setup-1-l50c.onrender.com/api/v1/post/all`, {
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
  }, [dispatch, likeRefresh, commentRefresh]);
  // useEffect for network call (End).......................................................
};

export default useGetAllPost;
