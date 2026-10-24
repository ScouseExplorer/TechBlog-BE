import express from "express";
import {
	deleteArticle,
	getArticle,
	getStats,
	listArticles,
	updateArticle,
} from "../controllers/admin.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";
import { requireRole } from "../middlewares/role.middleware.js";

const router = express.Router();

router.use(requireAuth, requireRole("admin"));

router.get("/stats", getStats);
router.get("/articles", listArticles);
router.get("/articles/:articleId", getArticle);
router.patch("/articles/:articleId", updateArticle);
router.delete("/articles/:articleId", deleteArticle);

export default router;
