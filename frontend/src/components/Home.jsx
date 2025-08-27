import React from "react";
import { Outlet } from "react-router-dom";
import Feed from "./Feed";
import RightSidebar from "./RightSidebar";
import useGetAllPost from "@/hooks/useGetAllPost";


function Home() {
useGetAllPost(); //custom hook :)
  return (
    <div className="flex">
      <div className="flex-grow">
     
        <Feed />
        <Outlet/>
      </div>
      <RightSidebar/>
    </div>
  );
}

export default Home;
