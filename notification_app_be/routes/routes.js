import express from 'express';
const router = express.Router();
import { getPriorityNotifications } from '../controllers/controller.js';

router.get('/priority-notifications', getPriorityNotifications);

export default router;