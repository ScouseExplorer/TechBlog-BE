import express from "express";
import { login } from "../controllers/auth.controller.js";
import { validateAuthPayload } from "../validators/auth.validator.js";
import { createRateLimiter } from "../middlewares/rate-limit.middleware.js";
import env from "../config/env.js";

const router = express.Router();

const loginRateLimiter = createRateLimiter({
	windowMs: env.AUTH_RATE_LIMIT_WINDOW_MS,
	max: env.AUTH_RATE_LIMIT_MAX,
	keyFn: (req) => {
		const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
		return `${req.ip}:${email}`;
	},
	message: "Too many login attempts. Please try again later.",
});

router.post("/login", loginRateLimiter, validateAuthPayload, login);

export default router;
