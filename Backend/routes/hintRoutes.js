import express from 'express';
import { getHint, getProgressiveHint } from '../controller/hintController.js';

const router = express.Router();

router.post('/assignment/:assignmentId', getHint);

router.post('/progressive/:assignmentId', getProgressiveHint);

export default router;