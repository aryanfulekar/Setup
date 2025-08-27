import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { readFileAsDataURL } from "@/lib/utils";
import axios from "axios";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "../redux/postSlice.js";
function CreatePost({ open, setOpen }) {
  const { user } = useSelector((store) => store.auth);
  const {posts} = useSelector((store)=>store.post)

  const dispatch = useDispatch();
  const imageRef = useRef();
  const [input, setInput] = useState({
    file: "",
    caption: "",
  });
  const [imagePreview, setImagePreview] = useState("");

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
    const dataUrl = await readFileAsDataURL(file);
    setImagePreview(dataUrl);
  };

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const createPostHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("caption", input.caption);
    if (imagePreview) {
      formData.append("image", input.file);
    }
    try {
      const res = await axios.post(
        `http://localhost:8000/api/v1/post/addpost`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setInput({ file: "", caption: "" });
        setImagePreview("");
        setOpen(false);
        dispatch(setPosts([res.data.post,...posts]))
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div>
      <Dialog open={open} className="">
        <DialogContent onInteractOutside={() => setOpen(false)} className={""}>
          <DialogHeader className="text-center font-semibold">
            <DialogTitle></DialogTitle>
            Create New Post
          </DialogHeader>
          <div className="flex gap-3 items-center">
            <Avatar>
              <AvatarImage
                src={user?.profilePicture}
                alt="img"
                className="w-[36px] h-[36px] rounded-full"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="font-semibold text-xs">{user?.username}</h1>
              <span className="text-gray-600 text-xs">Bio here...</span>
            </div>
          </div>
          <Textarea
            value={input.caption}
            name="caption"
            className={"focus-visible:ring-transparent border-0 "}
            onChange={changeEventHandler}
          ></Textarea>
          {imagePreview && (
            <div className="w-full h-64 flex items-center justify-center">
              <img
                src={imagePreview}
                alt="preview_img"
                className="object-cover h-full w-full rounded-md"
              />
            </div>
          )}
          <input
            type="file"
            className="hidden"
            ref={imageRef}
            onChange={fileChangeHandler}
          />
          <Button
            className={"w-fit mx-auto bg-[#0095F6] hover:bg-[#0984d6]"}
            onClick={() => imageRef.current.click()}
          >
            Select from computer
          </Button>
          {imagePreview && (
            <Button
              onClick={createPostHandler}
              type="submit"
              className={"w-full"}
            >
              Post
            </Button>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreatePost;
