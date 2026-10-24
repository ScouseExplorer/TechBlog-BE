import express from "express";
import authRoutes from "./auth.routes.js";
import postsRoutes from "./posts.routes.js";
import adminRoutes from "./admin.routes.js";

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

router.use("/auth", authRoutes);
router.use("/posts", postsRoutes);
router.use("/admin", adminRoutes);

export default router;
