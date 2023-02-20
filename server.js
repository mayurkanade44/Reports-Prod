import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";
import { dirname } from "path";
import { fileURLToPath } from "url";
import morgan from "morgan";
import path from "path";
import cors from "cors";

const app = express();
dotenv.config();
mongoose.set("strictQuery", false);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

import { notFoundError } from "./middleware/notFound.js";
import { authenticateUser } from "./middleware/auth.js";
import reportRouter from "./routes/ReportRoute.js";
import userRouter from "./routes/UserRoute.js";
import adminRouter from "./routes/AdminRoute.js";

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

const __dirname = dirname(fileURLToPath(import.meta.url));

// only when ready to deploy
app.use(express.static(path.resolve(__dirname, "./client/build")));


app.use(express.json());
app.use(fileUpload({ useTempFiles: true }));

app.use("/api/user", userRouter);
app.use("/api/report", authenticateUser, reportRouter);
app.use("/api/admin", authenticateUser, adminRouter);


app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

app.use(notFoundError);

const port = process.env.PORT || 5000;
const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(port, console.log("server is listing"));
  } catch (error) {
    console.log(error);
  }
};

start();
