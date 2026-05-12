import mongoose, { Schema, Document } from 'mongoose';

export interface IBadge extends Document {
  shopId: mongoose.Types.ObjectId;
  type: 'TOP_PERFORMER' | 'BEST_RATED' | 'FAST_SERVICE';
  awardedAt: Date;
}

const BadgeSchema = new Schema({
  shopId: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
  type: { 
    type: String, 
    enum: ['TOP_PERFORMER', 'BEST_RATED', 'FAST_SERVICE'], 
    required: true 
  },
}, { timestamps: true });

export default mongoose.models.Badge || mongoose.model<IBadge>('Badge', BadgeSchema);
