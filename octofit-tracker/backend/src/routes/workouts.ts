import { Router } from 'express';
import Workout from '../models/workout';

const router = Router();

router.get('/', async (_req, res) => {
  res.status(200).json(await Workout.find().lean());
});

export default router;