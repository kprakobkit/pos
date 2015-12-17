import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  pin: Number
});

export default mongoose.model('User', userSchema);
