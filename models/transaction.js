import mongoose, { Schema } from 'mongoose';

const transactionSchema = new Schema({
  orderId: String,
  cash: Number,
  credit: Number,
  tip: Number
});

transactionSchema.statics.addTransaction = function(orderId, { cash, credit, tip }) {
  return this({
    orderId,
    cash,
    credit,
    tip
  }).save();
}

export default mongoose.model('Transaction', transactionSchema);
