const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', socket.id);
  });

  socket.on('offer', data => {
    socket.to(data.roomId).emit('offer', data);
  });

  socket.on('answer', data => {
    socket.to(data.roomId).emit('answer', data);
  });

  socket.on('ice-candidate', data => {
    socket.to(data.roomId).emit('ice-candidate', data);
  });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => console.log('Server chal raha hai'));
