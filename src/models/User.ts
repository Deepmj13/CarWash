import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password?: string;
  role: 'USER' | 'OWNER' | 'ADMIN';
  noShowCount: number;
  isBlocked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: { type: String, enum: ['USER', 'OWNER', 'ADMIN'], default: 'USER' },
  noShowCount: { type: Number, default: 0 },
  isBlocked: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
