import { Schema } from 'mongoose';
import constants  from '../src/constants';

const Entry = new Schema({
  item_id: { type: Schema.ObjectId, ref: 'Item' },
  status: { type: String, default: constants.OPEN },
  comment: String
});

export default Entry;
