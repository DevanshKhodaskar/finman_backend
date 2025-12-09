// controller/authController.js
import crypto from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import USER from "../models/user.js";

// Pre-hash function (matches Python HMAC + SHA256)
function preHash(password) {
  const secret = process.env.PASSWORD_SECRET;
  if (!secret) throw new Error("PASSWORD_SECRET not set in env");
  return crypto.createHmac("sha256", secret).update(password).digest(); // returns Buffer
}

// JWT generation
function generateJWT(userId, phone_number) {
  return jwt.sign({ id: userId, phone_number: phone_number }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}


// Signup
export const signup = async (req, res) => {
  try {
    const { phone_number, password, name } = req.body;

    if (!phone_number || !password) {
      return res.status(400).json({ error: "phone_number and password required" });
    }

    const exists = await USER.findOne({ phone_number });
    if (exists) {
      return res.status(400).json({ error: "Phone number already registered" });
    }

    // Pre-hash password
    const pre = preHash(password);
    const password_hash = await bcrypt.hash(pre, 12);

    const newUser = await USER.create({
      phone_number,
      name: name || "",
      password_hash,
    });

    console.log("Signup successful:", newUser.phone_number);

    return res.json({
      ok: true,
      msg: "Signup successful. Please log in.",
      user: { phone_number, name: newUser.name },
    });
  } catch (err) {
    console.error("SIGNUP ERROR", err);
    return res.status(500).json({ error: "server error" });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { phone_number, password } = req.body;

    if (!phone_number || !password) {
      return res.status(400).json({ error: "phone_number and password required" });
    }

    // Find user
    const user = await USER.findOne({ phone_number });

    if (!user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Pre-hash the input password
    const pre = preHash(password); // Buffer

    const valid = await bcrypt.compare(pre, user.password_hash);

    if (!valid) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = generateJWT(user._id,user.phone_number);


    // Set cookie
    res.cookie("finman_auth_token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    console.log("Login successful for:", phone_number);

    return res.json({
      ok: true,
      msg: "Login successful",
      user: { phone_number, name: user.name },
    });
  } catch (err) {
    console.error("LOGIN ERROR", err);
    return res.status(500).json({ error: "server error" });
  }
};


//getme
export const getMe = async (req, res) => {
  try {
    const token = req.cookies.finman_auth_token;
    if (!token) return res.json({ user: null });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await USER.findById(decoded.id).lean();
    if (!user) return res.json({ user: null });

    return res.json({ user: { phone_number: user.phone_number, name: user.name } });
  } catch (err) {
    return res.json({ user: null });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    res.clearCookie("finman_auth_token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });

    return res.json({ ok: true, msg: "Logout successful" });

  } catch (err) {
    console.error("LOGOUT ERROR", err);
    return res.status(500).json({ error: "server error" });
  }
};