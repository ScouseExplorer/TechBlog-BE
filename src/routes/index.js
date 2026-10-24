import express from "express";
import { isDatabaseReady } from "../config/db.js";
import authRoutes from "./auth.routes.js";
import postsRoutes from "./posts.routes.js";
import adminRoutes from "./admin.routes.js";

const router = express.Router();

router.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

router.get("/ready", async (req, res) => {
  const dbReady = await isDatabaseReady();
  if (!dbReady) {
    return res.status(503).json({ status: "degraded", dependencies: { database: "down" } });
  }

  return res.status(200).json({ status: "ok", dependencies: { database: "up" } });
});

router.use("/auth", authRoutes);
router.use("/posts", postsRoutes);
router.use("/admin", adminRoutes);

export default router;
