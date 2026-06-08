import mongoose, { Schema, Document } from 'mongoose'

export interface IService extends Document {
  name: string
  description: string
  price: number
  duration: number
  shopId: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const ServiceSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  duration: { type: Number, default: 30 },
  shopId: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
}, { timestamps: true })

export default mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema)
