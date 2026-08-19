import mongoose, { Document, Schema } from 'mongoose';

export interface TeamDocument extends Document {
  name: string;
  members: string[];
  totalPoints: number;
}

const teamSchema = new Schema<TeamDocument>({
  name: { type: String, required: true, unique: true },
  members: { type: [String], default: [] },
  totalPoints: { type: Number, default: 0 }
});

export default mongoose.model<TeamDocument>('Team', teamSchema);