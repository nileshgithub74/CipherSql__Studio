import express from 'express';
import { getHint, getProgressiveHint } from '../controller/hintController.js';

const router = express.Router();

// Get AI-generated hint for an assignment
router.post('/assignment/:assignmentId', getHint);

// Get progressive hint (multiple levels)
router.post('/progressive/:assignmentId', getProgressiveHint);

export default router;