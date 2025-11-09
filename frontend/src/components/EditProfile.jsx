import React, { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "./ui/input";
import { Eye, EyeOff } from "lucide-react"; // 👈 icons for toggle
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { setAuthUser } from "@/redux/authSlice";

function EditProfile() {
  const { user } = useSelector((store) => store.auth);
  const imageRef = useRef(); //

  const [showPassword, setShowPassword] = useState(false);
  const [input, setInput] = useState({
    profilePicture: user?.profilePicture,
    bio: user?.bio,
    gender: user?.gender,
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // __________________________________________________________________________________________
  // (File change handler)
  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, profilePicture: file });
    }
  };
  // (change event handler)
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };
  // (Edit profile handler)
  const editProfileHandler = async (e) => {
    const formData = new FormData();
    formData.append("bio", input.bio);
    formData.append("gender", input.gender);
    if (input?.password) {
      formData.append("password", input.password);
    }
    if (input?.profilePicture) {
      formData.append("profilePicture", input.profilePicture);
    }
    try {
      e.preventDefault();
      const res = await axios.post(
        `https://setup-uvx4.onrender.com/api/v1/user/profile/edit`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setAuthUser(res.data.user))
        
        navigate(`/`)
      }

      console.log(input);
    } catch (error) {
      console.log(error);
    }
  };
  // __________________________________________________________________________________________
  return (
    <div className="flex max-w-2xl mx-auto pl-10">
      <section className="flex flex-col gap-6 w-full my-8">
        <h1 className="font-bold text-xl">Edit Profile</h1>

        {/* Profile header */}
        <div className="flex items-center bg-gray-100 rounded-xl p-4 justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={user?.profilePicture} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div>
              <h1 className="font-semibold text-sm">{user?.username}</h1>
              <span className="text-gray-600">
                {user?.bio || "Bio here..."}
              </span>
            </div>
          </div>

          {/* Profile Photo */}
          <input
            type="file"
            className="hidden"
            ref={imageRef}
            onChange={fileChangeHandler}
          />
          <Button
            onClick={() => imageRef.current.click()}
            className="bg-[#0095F6] h-8 hover:bg-[#1b8dda]"
          >
            Change Photo
          </Button>
        </div>

        {/* Bio */}
        <div>
          <h1 className="font-bold text-xl mb-2">Bio</h1>
          <Textarea
            name="bio"
            value={input?.bio}
            className="focus-visible:ring-transparent"
            onChange={changeEventHandler}
          />
        </div>

        {/* Gender */}
        <div>
          <h1 className="font-bold text-xl mb-2">Gender</h1>
          <Select
            defaultValue={input.gender}
            onValueChange={(value) => setInput({ ...input, gender: value })}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Password */}
        <div>
          <h1 className="font-bold text-xl mb-2">Password</h1>
          <div className="relative w-full max-w-sm">
            <Input
              type={showPassword ? "text" : "password"}
              name={`password`}
              value={input?.password}
              onChange={changeEventHandler}
              className="border focus-visible:ring-transparent pr-10"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <Button
            className="w-fit bg-[#0095F6] hover:bg-[#2a8ccd]"
            onClick={editProfileHandler}
          >
            Submit
          </Button>
        </div>
      </section>
    </div>
  );
}

export default EditProfile;
