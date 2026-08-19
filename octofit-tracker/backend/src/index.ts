import express from 'express';
import db from './config/database';
import activitiesRouter from './routes/activities';
import leaderboardRouter from './routes/leaderboard';
import teamsRouter from './routes/teams';
import usersRouter from './routes/users';
import workoutsRouter from './routes/workouts';

const app = express();
const PORT = 8000;
const apiUrl = process.env.CODESPACE_NAME
  ? `https://${process.env.CODESPACE_NAME}-8000.app.github.dev`
  : `http://localhost:${PORT}`;

app.use(express.json());

app.get('/', (_req, res) => {
  res.status(200).json({
    service: 'octofit-backend',
    status: 'ok',
    port: PORT,
    apiUrl,
    endpoints: [
      '/api/health',
      '/api/users',
      '/api/teams',
      '/api/activities',
      '/api/leaderboard',
      '/api/workouts'
    ],
    mongodb: db.readyState === 1 ? 'connected' : 'connecting'
  });
});

app.use('/api/users', usersRouter);
app.use('/api/teams', teamsRouter);
app.use('/api/activities', activitiesRouter);
app.use('/api/leaderboard', leaderboardRouter);
app.use('/api/workouts', workoutsRouter);

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'octofit-backend',
    port: PORT,
    apiUrl,
    mongodb: db.readyState === 1 ? 'connected' : 'connecting'
  });
});

app.listen(PORT, () => {
  console.log(`OctoFit backend listening at ${apiUrl}`);
});
