import { Router } from "express";
import { postController } from "../controllers/index.js";

const router = Router();

router.post("/", postController.createPost);
router.get("/", postController.getPosts);
router.get("/:id", postController.getPost);
router.get("/categories/:category", postController.getCatPosts);
router.get("/users/:id", postController.getUserPosts);
router.patch("/:id", postController.editPost);
router.delete("/:id", postController.deletePost);

export default router;
