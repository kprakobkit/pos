import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name: String,
  price: Number // apparently mongo doesn't support decimal so will have store dollar amount in cents...
});

export default mongoose.model('Item', itemSchema);
