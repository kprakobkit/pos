import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import constants  from '../src/constants';

const Entry = new Schema({
  item_id: { type: Schema.ObjectId, ref: 'Item' },
  status: { type: String, default: constants.OPEN },
  comment: String
});


const orderSchema = new Schema({
  id: String,
  status: { type: String, default: constants.OPEN },
  entries: [Entry]
});

export default mongoose.model('Order', orderSchema);
