```
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors: { origin: "*", methods: ["GET","POST"] } });

app.use(express.static(__dirname));
app.get('/', (req,res)=> res.sendFile(__dirname + '/index.html'));

io.on('connection', socket => {
  socket.on('join-room', roomId => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected', roomId);
  });
  socket.on('offer', d => socket.to(d.roomId).emit('offer', d));
  socket.on('answer', d => socket.to(d.roomId).emit('answer', d));
  socket.on('ice-candidate', d => socket.to(d.roomId).emit('ice-candidate', d));
  socket.on('call-user', d => socket.broadcast.emit('incoming-call', d));
  socket.on('call-rejected', d => socket.to(d.roomId).emit('call-rejected', d));
  socket.on('end-call', d => socket.to(d.roomId).emit('call-ended', d));
  socket.on('chat-message', d => socket.to(d.roomId).emit('chat-message', d));
  socket.on('file-share', d => socket.to(d.roomId).emit('file-share', d));
  socket.on('voice-message', d => socket.to(d.roomId).emit('voice-message', d));
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, ()=> console.log('Server running on '+PORT));
```
