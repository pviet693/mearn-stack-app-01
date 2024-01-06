import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import upload from "express-fileupload";
import path from "path";
import connect from "./database/database.js";
import { userRouter, postRouter } from "./routes/index.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import { authMiddleware } from "./middleware/authMiddleware.js";

dotenv.config();

const app = express();
const __dirname = path.resolve();
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(authMiddleware);
app.use(upload());
app.use("/uploads", express.static(__dirname + "/uploads"));

// routes
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);

// middlewares
app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT, async () => {
    await connect();
    console.log(`Server is running on port ${process.env.PORT}`);
});
