import Server from 'socket.io';

const io = new Server().attach(process.env.PORT || 8090);

console.log('Server running...');

io.on('connection', (socket) => {
  console.log('connected!');
  socket.emit('connected', 'hello from the server');
});

