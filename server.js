const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: "*", maxHttpBufferSize: 1e8 } });

app.use(express.static(__dirname));
app.get('/', (req,res)=> res.sendFile(__dirname + '/index.html'));

io.on('connection', socket => {
  socket.on('join-room', roomId => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected');
  });
  socket.on('offer', d => socket.to(d.roomId).emit('offer', d));
  socket.on('answer', d => socket.to(d.roomId).emit('answer', d));
  socket.on('ice-candidate', d => socket.to(d.roomId).emit('ice-candidate', d));
  
  socket.on('call-user', d => socket.to(d.roomId).emit('incoming-call', d));
  socket.on('call-rejected', d => socket.to(d.roomId).emit('call-rejected'));
  socket.on('end-call', d => socket.to(d.roomId).emit('call-ended'));

  socket.on('chat-message', d => io.to(d.roomId).emit('chat-message', d));
  socket.on('file-share', d => io.to(d.roomId).emit('file-share', d));
  socket.on('voice-message', d => io.to(d.roomId).emit('voice-message', d));
});

http.listen(process.env.PORT || 3000, ()=> console.log('Full App Running'));
