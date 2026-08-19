import { Router } from 'express';
import Leaderboard from '../models/leaderboard';

const router = Router();

router.get('/', async (_req, res) => {
  res.status(200).json(await Leaderboard.find().sort({ rank: 1 }).lean());
});

export default router;