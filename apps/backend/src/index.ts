import dotenv from "dotenv";
import express from "express";
// import { userRouter } from "./routes/users";
import { clerkMiddleware } from "@clerk/express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import checkoutRoutes from "./routes/checkoutRoutes/checkoutRoutes";
import categoryRoutes from "./routes/publicRoutes/categoryRoutes";
import publicRoutes from "./routes/publicRoutes/courseController";
import chapterRoutes from "./routes/teacherRoutes/chapterRoutes";
import courseRoutes from "./routes/teacherRoutes/courseRoutes";
import uploadRoutes from "./routes/teacherRoutes/uploadRoutes";
import userChaptersRoutes from "./routes/userRoutes/chapterRoutes";
import userCourseRoutes from "./routes/userRoutes/courseRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(morgan("tiny"));

app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000","https://lms.rcmade.me"],
  })
);
app.use(cookieParser());

app.use(clerkMiddleware());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/courses", courseRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/chapters", chapterRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/user", userCourseRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/chapter", userChaptersRoutes);
app.use("/api/checkout", checkoutRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
