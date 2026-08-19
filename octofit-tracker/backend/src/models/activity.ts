import mongoose, { Document, Schema } from 'mongoose';

export interface ActivityDocument extends Document {
  username: string;
  type: string;
  durationMinutes: number;
  points: number;
  date: Date;
}

const activitySchema = new Schema<ActivityDocument>({
  username: { type: String, required: true },
  type: { type: String, required: true },
  durationMinutes: { type: Number, required: true, min: 1 },
  points: { type: Number, required: true, min: 0 },
  date: { type: Date, required: true }
});

export default mongoose.model<ActivityDocument>('Activity', activitySchema);