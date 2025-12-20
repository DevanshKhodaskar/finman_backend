import express from "express";
const router = express.Router();

import authMiddleware from "../middleware/authMiddleware.js";
import {
  createQuery,
  listQueries,
  updateQuery,
  deleteQuery
} from "../controller/queryController.js";

router.use(authMiddleware); // 🔥 applies to ALL routes below

router.post("/", createQuery);
router.get("/", listQueries);
router.put("/:id", updateQuery);
router.delete("/:id", deleteQuery);

export default router;
