import jwt from "jsonwebtoken";
import User from "../models/user.js";

const AUTH_COOKIE_NAMES = ["finman_auth_token", "token"];

function getAuthToken(req) {
  const cookieToken = AUTH_COOKIE_NAMES.find((cookieName) => req.cookies?.[cookieName]);
  if (cookieToken) {
    return req.cookies[cookieToken];
  }

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice(7).trim();
  }

  return null;
}

const authMiddleware = async (req, res, next) => {
  try {
    const token = getAuthToken(req);

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.phone_number) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const user = await User.findOne({ phone_number: decoded.phone_number });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = {
      phone_number: user.phone_number,
      id: user._id,
    };

    next();
  } catch (err) {
    console.error("AUTH MIDDLEWARE ERROR:", err); // 🔥 THIS IS KEY
    return res.status(401).json({ error: "Authentication failed" });
  }
};

// Named export for compatibility with imports like: import { requireAuth } from './middleware/authMiddleware.js'
export const requireAuth = authMiddleware;
export default authMiddleware;
