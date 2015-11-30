import mongoose, { Schema } from 'mongoose';

const transactionSchema = new Schema({
  orderId: String,
  total: Number,
  cash: Number,
  credit: Number,
  tip: Number
});

transactionSchema.statics.addTransaction = function(orderId, { cash, credit, tip }) {
  return this({
    orderId,
    total: cash + credit,
    cash,
    credit,
    tip
  }).save();
}

export default mongoose.model('Transaction', transactionSchema);
