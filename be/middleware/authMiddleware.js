import jwt from "jsonwebtoken";
import { HttpError } from "../models/index.js";

export const authMiddleware = async (req, res, next) => {
    // bypass login, register
    console.log(req.url);
    if (
        ["/api/users/login", "/api/users/register"].includes(req.url)
        || (req.url.includes("/api/posts") && req.method === "GET")
        || (req.url.includes("/api/posts/categories") && req.method === "GET")
        || (req.url.includes("/api/posts/users") && req.method === "GET")
        || (req.url.includes("/api/users") && req.method === "GET")
        || req.url.includes("/uploads/")
    ) {
        next();
        return;
    }

    const token = req.headers?.authorization?.split(" ")[1];

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (error, info) => {
            if (error) {
                return next(new HttpError("Unauthorized. Invalid token.", 403));
            }

            req.user = info;
            next();
        });
    } else {
        return next(new HttpError("Unauthorized. No token.", 402));
    }
};
