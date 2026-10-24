import { loginUser } from "../services/auth.service.js";
import { signToken } from "../utils/jwt.js";

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await loginUser({ email, password });
    const token = signToken({ sub: user.id, role: user.role, email: user.email });
    res.status(200).json({ user, token });
  } catch (error) {
    next(error);
  }
}


