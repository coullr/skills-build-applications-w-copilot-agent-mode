import mongoose, { Document, Schema } from 'mongoose';

export interface LeaderboardDocument extends Document {
  username: string;
  points: number;
  rank: number;
}

const leaderboardSchema = new Schema<LeaderboardDocument>({
  username: { type: String, required: true, unique: true },
  points: { type: Number, required: true, min: 0 },
  rank: { type: Number, required: true, min: 1 }
});

export default mongoose.model<LeaderboardDocument>('Leaderboard', leaderboardSchema);