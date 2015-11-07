import mongoose from 'mongoose';
import constants  from '../src/constants';

let orderSchema = new mongoose.Schema({
  id: String,
  status: { type: String, default: constants.OPEN },
  items: [{type: mongoose.Schema.ObjectId, ref: 'Item'}]
});

export default mongoose.model('Order', orderSchema);
