import mongoose from 'mongoose';

var orderSchema = new mongoose.Schema({
  status: String
});

export default mongoose.model('Order', orderSchema);
