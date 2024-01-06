import { Router } from "express";
import { userController } from "../controllers/index.js";

const router = Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.get("/:id", userController.getUser);
router.get("/", userController.getAuthors);
router.post("/change-avatar", userController.changeAvatar);
router.patch("/edit-user", userController.editUser);

export default router;
