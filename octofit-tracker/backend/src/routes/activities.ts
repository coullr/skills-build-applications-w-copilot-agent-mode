import { Router } from 'express';
import Activity from '../models/activity';

const router = Router();

router.get('/', async (_req, res) => {
  res.status(200).json(await Activity.find().sort({ date: -1 }).lean());
});

export default router;