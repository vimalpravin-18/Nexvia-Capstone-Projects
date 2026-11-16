import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getSocket, disconnectSocket } from '../../services/socketService';
import { 
  setMediaState, 
  setParticipants, 
  addParticipant, 
  removeParticipant, 
  updateParticipantMedia, 
  addMessage, 
  leaveClassroom 
} from '../../features/liveClass/liveClassSlice';
import { 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  ScreenShare, 
  PhoneOff, 
  Hand, 
  MessageSquare, 
  Users, 
  Send,
  AlertCircle,
  Wifi,
  Sparkles
} from 'lucide-react';

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
};

export const WebRTCClassroom = ({ roomCode, sessionTitle, onLeave }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { participants, messages, isVideoOn, isAudioOn, isHandRaised, isScreenSharing } = useSelector((state) => state.liveClass);

  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnections = useRef(new Map()); // socketId -> RTCPeerConnection

  const [connectionStatus, setConnectionStatus] = useState('Connecting to signaling gateway...');
  const [permissionError, setPermissionError] = useState(null);
  const [activeTab, setActiveTab] = useState('chat'); // 'chat' | 'participants'
  const [chatInput, setChatInput] = useState('');
  const [remoteStreams, setRemoteStreams] = useState(new Map()); // socketId -> MediaStream

  useEffect(() => {
    let isMounted = true;
    const socket = getSocket();

    // 1. Initialize Local Media Stream
    const startLocalMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });

        if (!isMounted) return;
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setPermissionError(null);

        // 2. Join Socket Signaling Room
        socket.emit('join-room', {
          roomCode,
          user: {
            id: user?.id || user?._id || 'anon',
            name: user?.name || 'Guest Student',
            role: user?.role || 'student',
            avatar: user?.avatar
          }
        });

        setConnectionStatus('Connected (Room Active)');
      } catch (err) {
        console.warn('[WebRTC] Camera/Mic access denied or unavailable:', err.message);
        setPermissionError('Camera or Microphone access was denied or is unavailable. You can still participate in audio/chat.');
        setConnectionStatus('Joined (Media Restricted)');

        // Still join signaling room so student can watch instructor stream and chat
        socket.emit('join-room', {
          roomCode,
          user: {
            id: user?.id || user?._id || 'anon',
            name: user?.name || 'Guest Student',
            role: user?.role || 'student',
            avatar: user?.avatar
          }
        });
      }
    };

    startLocalMedia();

    // 3. Socket Signaling Listeners
    socket.on('room-joined', ({ participants: existingList }) => {
      dispatch(setParticipants(existingList));

      // Initiate WebRTC peer connection to each existing participant
      existingList.forEach((peer) => {
        createPeerConnection(peer.socketId, true);
      });
    });

    socket.on('user-connected', (newParticipant) => {
      dispatch(addParticipant(newParticipant));
      createPeerConnection(newParticipant.socketId, false);
    });

    socket.on('offer', async ({ callerSocketId, sdp }) => {
      let pc = peerConnections.current.get(callerSocketId);
      if (!pc) {
        pc = createPeerConnection(callerSocketId, false);
      }
      try {
        await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        socket.emit('answer', { targetSocketId: callerSocketId, sdp: answer });
      } catch (e) {
        console.error('[WebRTC] Offer handling error:', e);
      }
    });

    socket.on('answer', async ({ answererSocketId, sdp }) => {
      const pc = peerConnections.current.get(answererSocketId);
      if (pc) {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(sdp));
        } catch (e) {
          console.error('[WebRTC] Answer handling error:', e);
        }
      }
    });

    socket.on('ice-candidate', async ({ senderSocketId, candidate }) => {
      const pc = peerConnections.current.get(senderSocketId);
      if (pc && candidate) {
        try {
          await pc.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error('[WebRTC] Candidate error:', e);
        }
      }
    });

    socket.on('participant-media-changed', (updatedParticipant) => {
      dispatch(updateParticipantMedia(updatedParticipant));
    });

    socket.on('participant-hand-raised', ({ name, isHandRaised }) => {
      if (isHandRaised) {
        dispatch(addMessage({
          id: 'sys_' + Date.now(),
          senderName: 'Classroom Bot',
          senderRole: 'system',
          text: `✋ ${name} raised their hand to ask a question.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));
      }
    });

    socket.on('new-message', (msg) => {
      dispatch(addMessage(msg));
    });

    socket.on('user-disconnected', ({ socketId, userName }) => {
      const pc = peerConnections.current.get(socketId);
      if (pc) {
        pc.close();
        peerConnections.current.delete(socketId);
      }
      setRemoteStreams((prev) => {
        const next = new Map(prev);
        next.delete(socketId);
        return next;
      });
      dispatch(removeParticipant({ socketId }));
    });

    // Cleanup on unmount
    return () => {
      isMounted = false;
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      peerConnections.current.forEach((pc) => pc.close());
      peerConnections.current.clear();
      socket.emit('leave-room');
      dispatch(leaveClassroom());
    };
  }, [roomCode]);

  // Peer Connection Factory
  const createPeerConnection = (targetSocketId, isInitiator) => {
    const socket = getSocket();
    const pc = new RTCPeerConnection(ICE_SERVERS);
    peerConnections.current.set(targetSocketId, pc);

    // Add local tracks if available
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        pc.addTrack(track, localStreamRef.current);
      });
    }

    // Handle remote track arrival
    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStreams((prev) => {
          const updated = new Map(prev);
          updated.set(targetSocketId, event.streams[0]);
          return updated;
        });
      }
    };

    // Relay local ICE candidates
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit('ice-candidate', {
          targetSocketId,
          candidate: event.candidate
        });
      }
    };

    // If initiator, create and dispatch SDP offer
    if (isInitiator) {
      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .then(() => {
          socket.emit('offer', {
            targetSocketId,
            sdp: pc.localDescription
          });
        })
        .catch((e) => console.error('[WebRTC] Create offer error:', e));
    }

    return pc;
  };

  // Media Controls Handlers
  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        dispatch(setMediaState({ isAudioOn: audioTrack.enabled }));
        getSocket().emit('media-state-change', { isAudioOn: audioTrack.enabled });
      }
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        dispatch(setMediaState({ isVideoOn: videoTrack.enabled }));
        getSocket().emit('media-state-change', { isVideoOn: videoTrack.enabled });
      }
    }
  };

  const toggleHandRaise = () => {
    const nextState = !isHandRaised;
    dispatch(setMediaState({ isHandRaised: nextState }));
    getSocket().emit('raise-hand', { isHandRaised: nextState });
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];

        // Replace video track in all active peer connections
        peerConnections.current.forEach((pc) => {
          const sender = pc.getSenders().find((s) => s.track && s.track.kind === 'video');
          if (sender) sender.replaceTrack(screenTrack);
        });

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }

        screenTrack.onended = () => {
          // Revert back to camera when user stops screen share
          if (localStreamRef.current) {
            const cameraTrack = localStreamRef.current.getVideoTracks()[0];
            peerConnections.current.forEach((pc) => {
              const sender = pc.getSenders().find((s) => s.track && s.track.kind === 'video');
              if (sender) sender.replaceTrack(cameraTrack);
            });
            if (localVideoRef.current) localVideoRef.current.srcObject = localStreamRef.current;
          }
          dispatch(setMediaState({ isScreenSharing: false }));
        };

        dispatch(setMediaState({ isScreenSharing: true }));
      } else {
        // Revert to camera
        if (localStreamRef.current) {
          const cameraTrack = localStreamRef.current.getVideoTracks()[0];
          peerConnections.current.forEach((pc) => {
            const sender = pc.getSenders().find((s) => s.track && s.track.kind === 'video');
            if (sender) sender.replaceTrack(cameraTrack);
          });
          if (localVideoRef.current) localVideoRef.current.srcObject = localStreamRef.current;
        }
        dispatch(setMediaState({ isScreenSharing: false }));
      }
    } catch (e) {
      console.warn('[WebRTC] Screen share cancelled or rejected:', e);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (chatInput.trim()) {
      getSocket().emit('send-message', { text: chatInput.trim() });
      setChatInput('');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
      
      {/* Main Video Stage */}
      <div className="flex-1 flex flex-col justify-between p-4 bg-slate-950 relative">
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <div>
              <h2 className="text-white font-bold text-sm tracking-tight">{sessionTitle || 'Interactive Live Classroom'}</h2>
              <p className="text-[11px] text-slate-400 font-mono">Room Code: {roomCode}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="badge-pill bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs">
              <Wifi className="w-3 h-3 mr-1" />
              {connectionStatus}
            </span>
          </div>
        </div>

        {/* Permission Notice Warning Banner */}
        {permissionError && (
          <div className="my-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-center gap-2 text-amber-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{permissionError}</span>
          </div>
        )}

        {/* Video Grid */}
        <div className="flex-1 my-3 grid grid-cols-1 md:grid-cols-2 gap-4 items-center justify-center overflow-y-auto">
          
          {/* Local User Video Tile */}
          <div className="relative aspect-video bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-md">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`w-full h-full object-cover ${!isVideoOn ? 'hidden' : ''}`}
            />
            {!isVideoOn && (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center text-lg font-bold text-white mb-2">
                  {user?.name?.[0] || 'U'}
                </div>
                <p className="text-xs font-semibold">{user?.name} (You)</p>
                <p className="text-[10px] text-slate-500">Camera Paused</p>
              </div>
            )}
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[11px] text-white font-medium flex items-center gap-1.5">
              <span>{user?.name} (You)</span>
              {!isAudioOn && <MicOff className="w-3 h-3 text-rose-400" />}
              {isHandRaised && <span>✋</span>}
            </div>
          </div>

          {/* Remote Peer Video Tiles */}
          {Array.from(remoteStreams.entries()).map(([peerSocketId, stream]) => {
            const peer = participants.find((p) => p.socketId === peerSocketId);
            return (
              <div key={peerSocketId} className="relative aspect-video bg-slate-800 rounded-xl overflow-hidden border border-slate-700 shadow-md">
                <video
                  autoPlay
                  playsInline
                  ref={(el) => {
                    if (el && el.srcObject !== stream) el.srcObject = stream;
                  }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[11px] text-white font-medium flex items-center gap-1.5">
                  <span>{peer?.name || 'Peer Participant'}</span>
                  {peer?.role === 'instructor' && <span className="text-[9px] bg-blue-600 px-1 rounded font-bold">HOST</span>}
                </div>
              </div>
            );
          })}

          {/* If no peers joined yet */}
          {remoteStreams.size === 0 && (
            <div className="aspect-video bg-slate-900/60 border border-dashed border-slate-700 rounded-xl flex flex-col items-center justify-center text-slate-400 p-6 text-center">
              <Users className="w-10 h-10 text-slate-600 mb-2" />
              <p className="text-xs font-bold text-slate-300">Classroom Open</p>
              <p className="text-[11px] text-slate-500 max-w-xs mt-1">
                Share room code <strong className="text-blue-400">{roomCode}</strong>. Video peer streams will connect automatically via WebRTC.
              </p>
            </div>
          )}
        </div>

        {/* Bottom Classroom Controls Dock */}
        <div className="flex items-center justify-center gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={toggleAudio}
            className={`p-3 rounded-full transition-all ${
              isAudioOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-600/30'
            }`}
            title={isAudioOn ? 'Mute Microphone' : 'Unmute Microphone'}
          >
            {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>

          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full transition-all ${
              isVideoOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-600/30'
            }`}
            title={isVideoOn ? 'Turn Camera Off' : 'Turn Camera On'}
          >
            {isVideoOn ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </button>

          <button
            onClick={toggleScreenShare}
            className={`p-3 rounded-full transition-all ${
              isScreenSharing ? 'bg-blue-600 text-white' : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
            title="Share Screen"
          >
            <ScreenShare className="w-5 h-5" />
          </button>

          <button
            onClick={toggleHandRaise}
            className={`p-3 rounded-full transition-all ${
              isHandRaised ? 'bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/30' : 'bg-slate-800 text-white hover:bg-slate-700'
            }`}
            title="Raise Hand"
          >
            <Hand className="w-5 h-5" />
          </button>

          <button
            onClick={onLeave}
            className="p-3 rounded-full bg-rose-600 text-white hover:bg-rose-700 shadow-lg shadow-rose-600/40 transition-all ml-2"
            title="Leave Classroom"
          >
            <PhoneOff className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Right Rail: Chat & Participants Panel */}
      <div className="w-full lg:w-80 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col">
        {/* Panel Tabs */}
        <div className="flex border-b border-slate-800">
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'chat'
                ? 'border-blue-500 text-blue-400 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Live Chat
          </button>

          <button
            onClick={() => setActiveTab('participants')}
            className={`flex-1 py-3 text-xs font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${
              activeTab === 'participants'
                ? 'border-blue-500 text-blue-400 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            Attendees ({participants.length + 1})
          </button>
        </div>

        {/* Tab 1: Live Chat */}
        {activeTab === 'chat' ? (
          <div className="flex-1 flex flex-col justify-between overflow-hidden">
            <div className="flex-1 p-3 overflow-y-auto space-y-3">
              {messages.length === 0 ? (
                <p className="text-center text-xs text-slate-500 my-8 italic">
                  No messages yet. Send a message to everyone in the classroom!
                </p>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className="text-xs">
                    {m.senderRole === 'system' ? (
                      <div className="p-2 rounded-lg bg-slate-800/60 text-amber-300 text-[11px] italic">
                        {m.text}
                      </div>
                    ) : (
                      <div className="space-y-0.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className={`font-bold ${m.senderRole === 'instructor' ? 'text-blue-400' : 'text-slate-300'}`}>
                            {m.senderName}
                          </span>
                          <span className="text-slate-500 font-mono text-[10px]">{m.timestamp}</span>
                        </div>
                        <p className="text-slate-200 bg-slate-800/70 p-2 rounded-lg break-words">
                          {m.text}
                        </p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 flex gap-2">
              <input
                type="text"
                placeholder="Message classroom..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          /* Tab 2: Participants Roster */
          <div className="flex-1 p-3 overflow-y-auto space-y-2">
            <div className="p-2.5 rounded-xl bg-slate-800/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  {user?.name?.[0] || 'Y'}
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{user?.name} (You)</p>
                  <p className="text-[10px] text-slate-400 capitalize">{user?.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                {isAudioOn ? <Mic className="w-3.5 h-3.5 text-emerald-400" /> : <MicOff className="w-3.5 h-3.5 text-rose-400" />}
                {isVideoOn ? <VideoIcon className="w-3.5 h-3.5 text-emerald-400" /> : <VideoOff className="w-3.5 h-3.5 text-rose-400" />}
              </div>
            </div>

            {participants.map((p) => (
              <div key={p.socketId} className="p-2.5 rounded-xl bg-slate-800/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-slate-700 text-slate-200 flex items-center justify-center text-xs font-bold">
                    {p.name?.[0] || 'P'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-200">{p.name}</p>
                    <p className="text-[10px] text-slate-400 capitalize">{p.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {p.isHandRaised && <span className="text-xs">✋</span>}
                  {p.isAudioOn ? <Mic className="w-3.5 h-3.5 text-emerald-400" /> : <MicOff className="w-3.5 h-3.5 text-rose-400" />}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
