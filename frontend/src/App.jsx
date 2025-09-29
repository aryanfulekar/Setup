import { useEffect, useState } from "react";
import "./App.css";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import Profile from "./components/Profile";
import MainLayout from "./components/MainLayout";
import EditProfile from "./components/EditProfile";
import ChatPage from "./components/ChatPage";
import { io } from "socket.io-client"; // :)
import { useDispatch, useSelector } from "react-redux";
import { setSocket } from "./redux/socketSlice";
import { setOnlineUsers } from "./redux/chatSlice";
import Test from "./components/Test";
function App() {
  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/profile/:id", element: <Profile /> },
        { path: "/account/edit", element: <EditProfile /> },
        { path: "/chat", element: <ChatPage /> },
        {path:"/test",element:<Test/>}
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
  ]);

  const { user } = useSelector((store) => store.auth); //
  const { socket } = useSelector((store) => store.socketio); //
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketio = io(`http://localhost:8000`, {
        query: { userId: user?._id },
        transports: ["websocket"],
      });
      dispatch(setSocket(socketio)); //:)

      socketio.on("getOnlineUsers", (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers)); //:)
      });
      //  clean up function
      return () => {
        if (socketio) {
          socketio.close();
          dispatch(setSocket(null));//:)
        }
      };
    }
  }, [user, dispatch]);  

  return (
    <>
      <div>
        <RouterProvider router={appRouter} />
      </div>
    </>
  );
}

export default App;
