import mongoose, { Schema, Document } from 'mongoose';

const CURRENCIES = ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'] as const
export type Currency = typeof CURRENCIES[number]

export interface IShop extends Document {
  name: string;
  description: string;
  address: string;
  priceRange: string;
  minPrice: number;
  maxPrice: number;
  currency: Currency;
  rating: number;
  totalBookings: number;
  ownerId: mongoose.Types.ObjectId;
  operatingHours?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ShopSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  priceRange: { type: String, required: true },
  minPrice: { type: Number, default: 0 },
  maxPrice: { type: Number, default: 0 },
  currency: { type: String, enum: CURRENCIES, default: 'USD' },
  rating: { type: Number, default: 0 },
  totalBookings: { type: Number, default: 0 },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  operatingHours: { type: String },
}, { timestamps: true });

export { CURRENCIES }

export default mongoose.models.Shop || mongoose.model<IShop>('Shop', ShopSchema);
