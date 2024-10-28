import express from 'express';
import { chatToAi } from '../controllers/ai.controller.js';

const router = express.Router();

router.route("/chat").post(chatToAi);


export default router;