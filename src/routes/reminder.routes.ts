import express from 'express';
import { sendReminder, receiveSMS, checkDB } from '../services/reminder.service';

const router = express.Router();

router.get('/sendSMS', sendReminder);
router.post('/receiveSMS', receiveSMS);
router.get('/checkDB', checkDB);

export default router;