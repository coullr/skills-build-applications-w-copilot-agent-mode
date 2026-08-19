import { Router } from 'express';
import User from '../models/user';

const router = Router();

router.get('/', async (_req, res) => {
  res.status(200).json(await User.find().lean());
});

export default router;