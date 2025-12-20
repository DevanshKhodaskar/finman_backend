import jwt from "jsonwebtoken";
import User from "../models/user.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

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

export default authMiddleware;
