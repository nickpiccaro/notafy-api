import express from 'express';
import { wishBirthday } from '../services/birthday.service';

const router = express.Router();

router.get('/wish', wishBirthday);

export default router;