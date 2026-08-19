import { execSync } from 'node:child_process';
import mongoose from 'mongoose';
import Activity from '../models/activity';
import Leaderboard from '../models/leaderboard';
import Team from '../models/team';
import User from '../models/user';
import Workout from '../models/workout';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

function checkMongoDbRunning(): void {
  try {
    const output = execSync('ps aux | grep mongod', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    if (!output || !output.includes('mongod')) {
      throw new Error('MongoDB is not running. Start mongod before seeding octofit_db.');
    }
  } catch (_error) {
    console.error('MongoDB prerequisite not met: run `ps aux | grep mongod` and start MongoDB before seeding.');
    process.exit(1);
  }
}

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    checkMongoDbRunning();
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');

    await Promise.all([
      User.deleteMany({}),
      Team.deleteMany({}),
      Activity.deleteMany({}),
      Leaderboard.deleteMany({}),
      Workout.deleteMany({})
    ]);

    await User.insertMany([
      { username: 'alex', email: 'alex@example.com', name: 'Alex Morgan', team: 'Trail Blazers' },
      { username: 'jamie', email: 'jamie@example.com', name: 'Jamie Lee', team: 'Trail Blazers' },
      { username: 'riley', email: 'riley@example.com', name: 'Riley Chen', team: 'Peak Performers' }
    ]);
    await Team.insertMany([
      { name: 'Trail Blazers', members: ['alex', 'jamie'], totalPoints: 340 },
      { name: 'Peak Performers', members: ['riley'], totalPoints: 280 }
    ]);
    await Activity.insertMany([
      { username: 'alex', type: 'Running', durationMinutes: 30, points: 180, date: new Date() },
      { username: 'jamie', type: 'Cycling', durationMinutes: 40, points: 160, date: new Date() },
      { username: 'riley', type: 'Strength', durationMinutes: 35, points: 140, date: new Date() }
    ]);
    await Leaderboard.insertMany([
      { username: 'alex', points: 420, rank: 1 },
      { username: 'riley', points: 380, rank: 2 },
      { username: 'jamie', points: 340, rank: 3 }
    ]);
    await Workout.insertMany([
      { name: 'Morning Momentum', category: 'Cardio', difficulty: 'Beginner', durationMinutes: 25, exercises: ['Warm-up walk', 'Intervals', 'Cool down'] },
      { name: 'Full Body Builder', category: 'Strength', difficulty: 'Intermediate', durationMinutes: 40, exercises: ['Squats', 'Push-ups', 'Rows', 'Plank'] }
    ]);

    console.log('Database seeding complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
