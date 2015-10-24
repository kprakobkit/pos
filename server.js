import Server from 'socket.io';

const io = new Server().attach(8090);

io.on('connection', (socket) => {
  console.log('connected!');
  socket.emit('connected', 'hello from the server');
});

