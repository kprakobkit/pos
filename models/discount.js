import mongoose from 'mongoose';

const discountSchema = new mongoose.Schema({
  value: Number,
  description: String,
  type: String
});

export default mongoose.model('Discount', discountSchema);
