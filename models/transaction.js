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

transactionSchema.statics.updateTransaction = function(transactionId, { cash, credit, tip }) {
  return this.findOneAndUpdate(
    { id: transactionId },
    { cash, credit, tip },
    { new: true }
  );
}

export default mongoose.model('Transaction', transactionSchema);
