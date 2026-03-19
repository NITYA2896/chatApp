const connectedUsers = new Map(); // socket.id -> { username, id }

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Setup user
    socket.on('register', (username) => {
      connectedUsers.set(socket.id, { username, id: socket.id });
      // Broadcast updated user list to everyone
      io.emit('users_list', Array.from(connectedUsers.values()));
      console.log(`${username} registered with ID ${socket.id}`);
    });

    // Handle 1-to-1 message
    socket.on('private_message', ({ to, text }) => {
      const sender = connectedUsers.get(socket.id);
      if (sender) {
        // Send to specific user
        io.to(to).emit('private_message', {
          from: socket.id,
          fromUsername: sender.username,
          text,
          timestamp: Date.now()
        });
      }
    });

    // Handle group message
    socket.on('group_message', ({ text }) => {
      const sender = connectedUsers.get(socket.id);
      if (sender) {
        // Broadcast to everyone
        io.emit('group_message', {
          from: socket.id,
          fromUsername: sender.username,
          text,
          timestamp: Date.now()
        });
      }
    });

    // Handle typing events
    socket.on('typing', ({ to, isGroup }) => {
      const sender = connectedUsers.get(socket.id);
      if (!sender) return;

      if (isGroup) {
        socket.broadcast.emit('typing', { from: socket.id, fromUsername: sender.username, isGroup: true });
      } else if (to) {
        io.to(to).emit('typing', { from: socket.id, fromUsername: sender.username, isGroup: false });
      }
    });

    socket.on('stop_typing', ({ to, isGroup }) => {
      const sender = connectedUsers.get(socket.id);
      if (!sender) return;

      if (isGroup) {
        socket.broadcast.emit('stop_typing', { from: socket.id, fromUsername: sender.username, isGroup: true });
      } else if (to) {
        io.to(to).emit('stop_typing', { from: socket.id, fromUsername: sender.username, isGroup: false });
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      const user = connectedUsers.get(socket.id);
      if (user) {
        console.log(`${user.username} disconnected`);
        connectedUsers.delete(socket.id);
        io.emit('users_list', Array.from(connectedUsers.values()));
      }
    });
  });
};
