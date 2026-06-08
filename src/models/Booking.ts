import mongoose, { Schema, Document } from 'mongoose';

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  shopId: mongoose.Types.ObjectId;
  serviceId?: mongoose.Types.ObjectId;
  dateTime: Date;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'NO_SHOW';
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  shopId: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
  serviceId: { type: Schema.Types.ObjectId, ref: 'Service' },
  dateTime: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED', 'NO_SHOW'], 
    default: 'PENDING' 
  },
}, { timestamps: true });

export default mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);
