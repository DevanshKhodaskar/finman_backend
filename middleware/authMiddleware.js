// backend/middleware/authMiddleware.js
import jwt from "jsonwebtoken";


export const requireAuth = async (req, res, next) => {
  try {
    const token = req.cookies.finman_auth_token;
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      phone_number: decoded.phone_number,
    };

    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ error: "Invalid token" });
  }
};
