import jwt from "jsonwebtoken";
// dotenv----------------------------
import dotenv from "dotenv";
dotenv.config();

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token; //here we are taking token from cookies

    if (!token) {
      return res.status(401).json({
        message: "User not authenticated.",
        success: false,
      });
    }

    // jwt.verify() return the payload
    const decode = await jwt.verify(token, process.env.TOKEN_SECRET);

    if (!decode) {
      return res.status(401).json({ message: "Invalid token", success: false });
    }

    // here we are just storing userId in req in user key, it could be any name like user123, userId, etc...
    req.id = decode.userId;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      message: "Invalid or expired token.",
      success: false,
    });
  }
};

export default isAuthenticated;

