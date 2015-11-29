import mongoose, { Schema } from 'mongoose';

const transactionSchema = new Schema({
  orderId: { type: Schema.ObjectId, ref: 'Order' },
  total: Number,
  cash: Number,
  credit: Number,
  creditTip: Number
});

export default mongoose.model('Transaction', transactionSchema);
