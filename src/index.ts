import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { jobRouter } from "./routes/jobRoutes";
import { authRouter } from "./routes/authRoutes";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const mongoDBURL =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/mydemoDB";

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("MongoDB Connection Successful");
  })
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
  });

app.use("/v1/api/auth", authRouter);
app.use("/v1/api/job", jobRouter);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
