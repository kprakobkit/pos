import mongoose from 'mongoose';

let orderSchema = new mongoose.Schema({
  id: String,
  status: String
});

export default mongoose.model('Order', orderSchema);
