import Server from 'socket.io';
import express from 'express';
import path from 'path';

var app = express();
const isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? process.env.PORT : 3000;
const distPath = path.resolve(__dirname, 'dist');
const io = new Server().attach(8090);

console.log('Server running...');

app.use(express.static(distPath));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

io.on('connection', (socket) => {
  console.log('connected!');
  socket.emit('connected', 'hello from the server');
});

