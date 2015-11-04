import Server from 'socket.io';
import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import makeStore from './store';
import socketEvents from './socket_events';
import constants from '../src/constants';
import Order from '../models/order';

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

const attachSocketEvents = socketEvents(store);

io.on('connection', (socket) => {
  console.log('connected!');
  socket.emit('connected', 'hello from the server');
  socket.emit('state', store.getState());
});

io.on('connection', attachSocketEvents);

store.subscribe(
  () => io.emit('state', store.getState())
);

// seeding for dev
function seedData() {
  Order.remove({}, () => {
    console.log('Orders collection dropped');
  });

  new Order({
    id: '15',
    status: constants.CLOSED
  }).save();

  new Order({
    id: '16',
    status: constants.OPEN
  }).save();

  new Order({
    id: '17',
    status: constants.READY_FOR_BILL
  }).save();

  new Order({
    id: '18',
    status: constants.CLOSED
  }).save();
}

seedData();
