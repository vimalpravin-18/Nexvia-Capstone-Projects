import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchLiveClasses } from '../../features/liveClass/liveClassSlice';
import { WebRTCClassroom } from '../../components/live/WebRTCClassroom';
import { 
  Video, 
  Users, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const LiveClassroomPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { classes, loading } = useSelector((state) => state.liveClass);

  const [activeRoomCode, setActiveRoomCode] = useState(searchParams.get('room') || null);
  const [activeTitle, setActiveTitle] = useState(searchParams.get('title') || 'Interactive Live Classroom');
  const [customRoomInput, setCustomRoomInput] = useState('');

  useEffect(() => {
    dispatch(fetchLiveClasses());
  }, [dispatch]);

  const handleJoinSession = (cls) => {
    setActiveRoomCode(cls.roomCode);
    setActiveTitle(cls.title);
    setSearchParams({ room: cls.roomCode, title: cls.title });
  };

  const handleJoinCustomRoom = (e) => {
    e.preventDefault();
    if (customRoomInput.trim()) {
      setActiveRoomCode(customRoomInput.trim().toUpperCase());
      setActiveTitle('Interactive Live Classroom');
      setSearchParams({ room: customRoomInput.trim().toUpperCase() });
    }
  };

  const handleLeaveSession = () => {
    setActiveRoomCode(null);
    setSearchParams({});
  };

  // If currently inside an active classroom session
  if (activeRoomCode) {
    return (
      <div className="space-y-4 animate-fade-in pb-12">
        <WebRTCClassroom
          roomCode={activeRoomCode}
          sessionTitle={activeTitle}
          onLeave={handleLeaveSession}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-wider">
            <Video className="w-4 h-4 animate-pulse" />
            Real-Time WebRTC Media Gateway
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Live Interactive Classrooms
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Participate in live interactive lectures, camera & mic discussions, real-time screen shares, and Q&A.
          </p>
        </div>

        {/* Join by Code Form */}
        <form onSubmit={handleJoinCustomRoom} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Room Code (e.g. NEX-DES-924)"
            value={customRoomInput}
            onChange={(e) => setCustomRoomInput(e.target.value)}
            className="px-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 uppercase font-mono"
          />
          <button type="submit" className="btn-primary text-xs bg-rose-600 hover:bg-rose-700 py-2 px-4 shadow-md">
            Join Room
          </button>
        </form>
      </div>

      {/* Scheduled and Ongoing Classrooms List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Active & Scheduled Sessions</h2>

        {loading ? (
          <div className="flex items-center justify-center min-h-[30vh]">
            <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : classes.length === 0 ? (
          <div className="card-saas p-12 text-center space-y-3 bg-white border border-slate-200 rounded-2xl">
            <Video className="w-12 h-12 text-slate-300 mx-auto" />
            <p className="text-base font-bold text-slate-800">No scheduled live classes right now.</p>
            <p className="text-xs text-slate-400">Instructors schedule live sessions for workshops, Q&A, and critiques.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classes.map((cls) => {
              const isLiveNow = cls.status === 'live';

              return (
                <div
                  key={cls._id}
                  className="card-saas p-6 bg-white border border-slate-200 rounded-3xl flex flex-col justify-between space-y-5 hover:border-rose-400 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      {isLiveNow ? (
                        <span className="badge-pill bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold animate-pulse">
                          ● BROADCASTING LIVE
                        </span>
                      ) : (
                        <span className="badge-pill bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold">
                          Scheduled Session
                        </span>
                      )}

                      <span className="text-xs font-mono font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                        {cls.roomCode}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base group-hover:text-rose-600 transition-colors">
                        {cls.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {cls.description || 'Live interactive video discussion and technical demonstration.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        Host: {cls.instructorName || 'Jenny Wilson'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {cls.durationMinutes || 60} mins
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-xs text-slate-400">
                      Starts: <span className="font-semibold text-slate-700">{new Date(cls.scheduledStartTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    <button
                      onClick={() => handleJoinSession(cls)}
                      className={`btn-primary text-xs py-2 px-4 ${
                        isLiveNow ? 'bg-rose-600 hover:bg-rose-700 animate-bounce' : 'bg-slate-900 hover:bg-slate-800'
                      }`}
                    >
                      {isLiveNow ? 'Join Live Stream' : 'Enter Classroom Room'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
