// routes/reports.js
import express from 'express';
const router = express.Router();
import { generateReport } from '../controller/reportController.js';

router.post('/generate', generateReport);

export default router;
