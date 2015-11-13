import mongoose, { Schema } from 'mongoose';
import constants  from '../src/constants';

const entrySchema = new Schema({
  id: String,
  item_id: { type: Schema.ObjectId, ref: 'Item' },
  status: { type: String, default: constants.OPEN },
  comment: String
});

export default mongoose.model('Entry', entrySchema);
