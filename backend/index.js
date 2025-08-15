import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./utils/db.js";

import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
const app = express();
dotenv.config(); // Automatically loads .env from the root directory
// middleware--------------------------------------------------------
app.use(express.json()); // Middleware to parse JSON requests
app.use(cookieParser());
app.use(express.urlencoded({ extended: true })); // Middleware to parse form data (x-www-form-urlencoded)
const PORT = process.env.PORT || 3000;

// CORS setup(start)~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const corsOptions = {
  origin: "http://localhost:5173", // Frontend URL
  credentials: true, // Allow cookies to be sent with requests
};
app.use(cors(corsOptions)); // Apply the CORS middleware
// CORS setup(end)~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// API'S___________________________________________________________________________

// app.get("/user", (req, res) => {
//   const { id, id2 } = req.body;

//   return res.status(200).json({
//     message: "i am from backend",
//     id,
//     id2,
//     success: true,
//   });
// });
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
// API'S___________________________________________________________________________

app.listen(PORT, () => {
  connectDB();
  console.log(`Listening to port ${PORT}`);
});
