import mongoose, { Document, Schema } from 'mongoose';

export interface WorkoutDocument extends Document {
  name: string;
  category: string;
  difficulty: string;
  durationMinutes: number;
  exercises: string[];
}

const workoutSchema = new Schema<WorkoutDocument>({
  name: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, required: true },
  durationMinutes: { type: Number, required: true, min: 1 },
  exercises: { type: [String], default: [] }
});

export default mongoose.model<WorkoutDocument>('Workout', workoutSchema);