const express = require('express');
const socket = require('socket.io');

const app = express();

const tasks = [];

app.use((req, res) => {
   res.status(404).send( { message: 'Not found' });
});

const server = app.listen(process.env.PORT || 8000, () => {
    console.log('Server is running...');
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log(`New socket connected with ID: ${socket.id}`);

  socket.on('updateData', () => {
    socket.emit('updateData', tasks);
  });

  socket.on('addTask', (taskName) => {
    tasks.push(taskName);
    socket.broadcast.emit('addTask', taskName);
  });

  socket.on('removeTask', (taskIndex) => {
    tasks.splice(taskIndex, 1);
    socket.broadcast.emit('removeTask', taskIndex);
  });

  socket.on('disconnect', () => {
    console.log(`Socket with ID: ${socket.id} left`);
  });
});