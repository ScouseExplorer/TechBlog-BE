import express from "express";
import { addPost, getPosts } from "../controllers/post.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { validatePostPayload } from "../validators/post.validator.js";

const router = express.Router();

router.get("/", getPosts);
router.post("/", requireAuth, validatePostPayload, addPost);

export default router;
