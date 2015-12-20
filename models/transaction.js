import mongoose, { Schema } from 'mongoose';
import _ from 'ramda';

const transactionSchema = new Schema({
  orderId: String,
  cash: Number,
  credit: Number,
  tip: Number
});

transactionSchema.statics.getTransactions = function() {
  return this.find().then(_.map(toTransaction));
}

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

function toTransaction({ _id, orderId, cash, credit, tip }) {
  const createdAt = _id.getTimestamp();
  return {
    _id,
    orderId,
    cash,
    credit,
    tip,
    createdAt
  };
}

export default mongoose.model('Transaction', transactionSchema);
