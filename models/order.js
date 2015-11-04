import mongoose from 'mongoose';

let orderSchema = new mongoose.Schema({
  id: String,
  status: String,
  items: [{type: mongoose.Schema.ObjectId, ref: 'Item'}]
});

export default mongoose.model('Order', orderSchema);
