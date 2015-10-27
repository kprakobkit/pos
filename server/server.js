import Server from 'socket.io';
import express from 'express';
import path from 'path';
import makeStore from './store';
import mongoose from 'mongoose';

const app = express();
const isProduction = process.env.NODE_ENV === 'production';
const port = isProduction ? process.env.PORT : 3000;
const distPath = path.resolve(__dirname, '..', 'dist');
const store = makeStore();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost');

console.log('Server running...');

app.use(express.static(distPath));

const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const io = Server.listen(server);

io.on('connection', (socket) => {
  console.log('connected!');
  socket.emit('connected', 'hello from the server');
  socket.emit('state', store.getState());
  socket.on('action', store.dispatch.bind(store));
});

store.subscribe(
  () => io.emit('state', store.getState())
);

const initialState = {
  type:  'SET_STATE',
  state: {
    orders: [
      { id: 1, status: 'open' },
      { id: 2, status: 'closed' }
    ]
  }
};
store.dispatch(initialState);
