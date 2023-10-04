import express from 'express';
import birthdayRoutes from './birthday.routes';
import reminderRoutes from './reminder.routes'

const router = express.Router();

router.use('/birthday', birthdayRoutes);
router.use('/remind', reminderRoutes);

export default router;