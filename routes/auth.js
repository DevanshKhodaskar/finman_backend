// routes/auth.js
import express from 'express';
const router = express.Router();
import {signup,login,logout, getMe } from '../controller/authController.js';

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', getMe);

export default router;