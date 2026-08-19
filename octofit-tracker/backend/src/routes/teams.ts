import { Router } from 'express';
import Team from '../models/team';

const router = Router();

router.get('/', async (_req, res) => {
  res.status(200).json(await Team.find().lean());
});

export default router;