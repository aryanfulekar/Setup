import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
function Signup() {
  const navigate = useNavigate();
  const [input, setInput] = useState({ username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false); // 👈 toggle state

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const SubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `https://setup-1-l50c.onrender.com/api/v1/user/register`,
        input,
        {
          headers: { "content-Type": "application/json" },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setInput({ username: "", email: "", password: "" }); // Reset form
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.response.data.message);
      setInput({ username: "", email: "", password: "" }); // Reset form
    }
  };

  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <form
        action=""
        className="shadow-lg flex flex-col gap-5 p-8"
        onSubmit={SubmitHandler}
      >
        <div>
          <h1 className="text-center font-bold text-xl">Signup</h1>
          <p className="text-sm text-center">
            Signup to see photos & videos from your friends
          </p>
        </div>

        <div>
          <Label className={"py-2 font-medium"}>Username</Label>
          <Input
            type="text"
            name="username"
            value={input.username}
            className={"focus-visible:ring-transparent"}
            onChange={changeEventHandler}
          />
        </div>

        <div>
          <Label className={"py-2 font-medium"}>Email</Label>
          <Input
            type="email"
            name="email"
            value={input.email}
            className={"focus-visible:ring-transparent"}
            onChange={changeEventHandler}
          />
        </div>

        <div className="relative">
          <Label className={"py-2 font-medium"}>Password</Label>
          <Input
            type={showPassword ? "text" : "password"} // 👈 toggle type
            name="password"
            value={input.password}
            className={"focus-visible:ring-transparent pr-10"} // padding for button
            onChange={changeEventHandler}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-2 top-9 text-sm text-blue-500"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <Button type="submit">Signup</Button>

        <span className="text-center">
          Already have an account
          <Link to={"/login"} className="text-blue-600">
            {" "}
            Login
          </Link>
        </span>
      </form>
    </div>
  );
}

export default Signup;
