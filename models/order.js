import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import constants  from '../src/constants';

const Item = new Schema({
  item_id: { type: Schema.ObjectId, ref: 'Item' },
  status: { type: String, default: constants.OPEN },
  comments: String
});


let orderSchema = new Schema({
  id: String,
  status: { type: String, default: constants.OPEN },
  items: [Item]
});

export default mongoose.model('Order', orderSchema);
