import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  RotateCcw, 
  CheckCircle,
  Settings
} from 'lucide-react';

export const VideoPlayer = ({ videoUrl, title, onEnded, onProgressUpdate }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);

  // Fallback sample video if empty
  const activeSrc = videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  // When active video source changes, reload video cleanly from beginning
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      setCurrentTime(0);
      setIsPlaying(false);
    }
  }, [activeSrc]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(err => console.warn('Autoplay prevented:', err));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (onProgressUpdate) {
        onProgressUpdate(videoRef.current.currentTime, videoRef.current.duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleRateChange = (rate) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const toggleFullScreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl group border border-slate-800"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      data-no-scroll="true"
    >
      <video
        ref={videoRef}
        src={activeSrc}
        className="w-full h-full object-contain cursor-pointer"
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          setIsPlaying(false);
          if (onEnded) onEnded();
        }}
        playsInline
      />

      {/* Big Play Overlay Button when paused */}
      {!isPlaying && (
        <button
          onClick={togglePlay}
          data-no-scroll="true"
          className="video-player-control absolute inset-0 m-auto w-16 h-16 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-20 backdrop-blur-sm"
        >
          <Play className="w-8 h-8 fill-white ml-1" />
        </button>
      )}

      {/* Top Banner (Lesson Title) */}
      <div className={`absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-300 z-10 pointer-events-none ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-white font-semibold text-sm drop-shadow">{title || 'Video Lesson'}</p>
      </div>

      {/* Custom Bottom Control Bar */}
      <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent transition-opacity duration-300 z-20 space-y-2 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* Scrubber Progress Bar */}
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          data-no-scroll="true"
          className="w-full h-1.5 bg-white/30 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:h-2.5 transition-all"
        />

        {/* Controls Row */}
        <div className="flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-3">
            <button 
              onClick={togglePlay} 
              data-no-scroll="true"
              className="video-player-control p-1 hover:text-blue-400 transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
            </button>

            <button 
              onClick={toggleMute} 
              data-no-scroll="true"
              className="video-player-control p-1 hover:text-blue-400 transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
            </button>

            <span className="font-mono text-slate-300">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Speed Selector */}
            <select
              value={playbackRate}
              onChange={(e) => handleRateChange(parseFloat(e.target.value))}
              data-no-scroll="true"
              className="bg-black/40 text-white border border-white/20 rounded px-1.5 py-0.5 text-xs focus:outline-none"
            >
              <option value="0.75" className="bg-slate-900">0.75x</option>
              <option value="1" className="bg-slate-900">1.0x</option>
              <option value="1.25" className="bg-slate-900">1.25x</option>
              <option value="1.5" className="bg-slate-900">1.5x</option>
              <option value="2" className="bg-slate-900">2.0x</option>
            </select>

            <button 
              onClick={toggleFullScreen} 
              data-no-scroll="true"
              className="video-player-control p-1 hover:text-blue-400 transition-colors"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
