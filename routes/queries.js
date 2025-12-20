import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  createQuery,
  listQueries,
  updateQuery,
  deleteQuery
} from "../controller/queryController.js";

const router = express.Router();

router.use(requireAuth);

router.post("/", createQuery);
router.get("/", listQueries);
router.put("/:id", updateQuery);
router.delete("/:id", deleteQuery);

export default router;
