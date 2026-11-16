/**
 * WebRTC Live Classroom Signaling Server (Socket.io)
 * Handles room signaling, SDP offers/answers, ICE candidate relay,
 * participant rosters, media status (audio/video mute), and classroom chat.
 */

const setupLiveClassSocket = (io) => {
  // Store active rooms in-memory: roomCode -> Map of socketId -> participant data
  const rooms = new Map();

  io.on('connection', (socket) => {
    let currentRoom = null;
    let currentUser = null;

    // Join Live Classroom Room
    socket.on('join-room', ({ roomCode, user }) => {
      currentRoom = roomCode;
      currentUser = user;

      socket.join(roomCode);

      if (!rooms.has(roomCode)) {
        rooms.set(roomCode, new Map());
      }

      const roomParticipants = rooms.get(roomCode);
      const participantInfo = {
        socketId: socket.id,
        userId: user.id || user._id,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        isVideoOn: true,
        isAudioOn: true,
        isHandRaised: false
      };

      roomParticipants.set(socket.id, participantInfo);

      // Send existing participants list back to the newly joined user
      const existingParticipants = Array.from(roomParticipants.values()).filter(p => p.socketId !== socket.id);
      socket.emit('room-joined', {
        roomCode,
        self: participantInfo,
        participants: existingParticipants
      });

      // Notify others in the room that a new peer has connected
      socket.to(roomCode).emit('user-connected', participantInfo);

      console.log(`[Socket] User ${user.name} (${user.role}) joined room ${roomCode}. Total: ${roomParticipants.size}`);
    });

    // WebRTC Signaling: SDP Offer relay
    socket.on('offer', ({ targetSocketId, sdp }) => {
      io.to(targetSocketId).emit('offer', {
        callerSocketId: socket.id,
        callerUser: currentUser,
        sdp
      });
    });

    // WebRTC Signaling: SDP Answer relay
    socket.on('answer', ({ targetSocketId, sdp }) => {
      io.to(targetSocketId).emit('answer', {
        answererSocketId: socket.id,
        sdp
      });
    });

    // WebRTC Signaling: ICE Candidate relay
    socket.on('ice-candidate', ({ targetSocketId, candidate }) => {
      io.to(targetSocketId).emit('ice-candidate', {
        senderSocketId: socket.id,
        candidate
      });
    });

    // Media state toggles (Camera / Mic mute)
    socket.on('media-state-change', ({ isVideoOn, isAudioOn }) => {
      if (currentRoom && rooms.has(currentRoom)) {
        const participant = rooms.get(currentRoom).get(socket.id);
        if (participant) {
          if (isVideoOn !== undefined) participant.isVideoOn = isVideoOn;
          if (isAudioOn !== undefined) participant.isAudioOn = isAudioOn;
          io.to(currentRoom).emit('participant-media-changed', participant);
        }
      }
    });

    // Hand Raising feature
    socket.on('raise-hand', ({ isHandRaised }) => {
      if (currentRoom && rooms.has(currentRoom)) {
        const participant = rooms.get(currentRoom).get(socket.id);
        if (participant) {
          participant.isHandRaised = isHandRaised;
          io.to(currentRoom).emit('participant-hand-raised', {
            socketId: socket.id,
            name: participant.name,
            isHandRaised
          });
        }
      }
    });

    // Classroom Real-Time Chat Message
    socket.on('send-message', ({ text }) => {
      if (currentRoom && currentUser) {
        const messagePayload = {
          id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          senderName: currentUser.name,
          senderRole: currentUser.role,
          senderAvatar: currentUser.avatar,
          text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        io.to(currentRoom).emit('new-message', messagePayload);
      }
    });

    // Instructor starts/ends screen share
    socket.on('screen-share-status', ({ isSharing }) => {
      if (currentRoom) {
        socket.to(currentRoom).emit('screen-share-changed', {
          socketId: socket.id,
          isSharing
        });
      }
    });

    // User leaves or disconnects
    const handleLeave = () => {
      if (currentRoom && rooms.has(currentRoom)) {
        const roomParticipants = rooms.get(currentRoom);
        roomParticipants.delete(socket.id);

        socket.to(currentRoom).emit('user-disconnected', {
          socketId: socket.id,
          userName: currentUser ? currentUser.name : 'Participant'
        });

        if (roomParticipants.size === 0) {
          rooms.delete(currentRoom);
        }
      }
    };

    socket.on('leave-room', handleLeave);
    socket.on('disconnect', handleLeave);
  });
};

module.exports = setupLiveClassSocket;
