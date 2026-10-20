import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Play, Pause, Maximize, Volume2, VolumeX, VideoOff } from 'lucide-react';
import { cameras } from '../data/cameras';

interface LiveFeedProps {
  selectedCamera: number;
}

export function LiveFeed({ selectedCamera }: LiveFeedProps) {
  const camera = cameras.find((c) => c.id === selectedCamera) ?? cameras[0];
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(true);
  const [failed, setFailed] = useState(false);
  const [now, setNow] = useState(new Date());

  const streamUrl = camera.status === 'live' ? camera.streamUrl : undefined;

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    setFailed(false);
    setPlaying(true);
    if (!video || !streamUrl) return;

    let hls: Hls | null = null;
    if (Hls.isSupported()) {
      hls = new Hls({ liveSyncDurationCount: 2 });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(() => {}));
      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) setFailed(true);
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      video.play().catch(() => {});
    } else {
      setFailed(true);
    }

    return () => {
      hls?.destroy();
      video.removeAttribute('src');
      video.load();
    };
  }, [streamUrl]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const fullscreen = () => containerRef.current?.requestFullscreen?.();

  const showVideo = !!streamUrl && !failed;

  return (
    <section className="max-w-2xl mx-auto">
      <header className="flex items-end justify-between mb-4">
        <div>
          <h1 className="text-2xl font-light tracking-tight text-neutral-900">{camera.name}</h1>
          <p className="text-sm text-neutral-400 mt-1">{camera.location}</p>
        </div>
        <div className="flex items-center gap-2 text-xs tracking-[0.14em] uppercase text-neutral-500">
          <span
            className={`w-1.5 h-1.5 rounded-full ${showVideo ? "bg-red-500 animate-pulse" : "bg-neutral-300"}`}
          />
          {showVideo ? "Live" : "Offline"}
        </div>
      </header>

      <div
        ref={containerRef}
        className="group relative aspect-video overflow-hidden rounded-xl bg-neutral-900 ring-1 ring-black/5"
      >
        {showVideo ? (
          <video ref={videoRef} className="w-full h-full object-cover" muted playsInline autoPlay />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500 gap-3">
            <VideoOff className="w-8 h-8" strokeWidth={1.25} />
            <span className="text-sm font-light">
              {failed ? "ไม่สามารถโหลดสัญญาณภาพได้" : "กล้องออฟไลน์"}
            </span>
          </div>
        )}

        {showVideo && (
          <div className="absolute top-4 left-4 text-[11px] tabular-nums tracking-wider text-white/80 [text-shadow:0_1px_2px_rgba(0,0,0,.6)]">
            {now.toLocaleDateString("th-TH", { day: "2-digit", month: "short", year: "numeric" })}
            <span className="mx-2 text-white/40">/</span>
            {now.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </div>
        )}

        <div className="absolute inset-x-0 bottom-0 px-4 pb-3 pt-10 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-1">
              <button
                onClick={togglePlay}
                disabled={!showVideo}
                aria-label={playing ? "Pause" : "Play"}
                className="p-2 rounded-full hover:bg-white/15 transition-colors disabled:opacity-30"
              >
                {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={toggleMute}
                disabled={!showVideo}
                aria-label={muted ? "Unmute" : "Mute"}
                className="p-2 rounded-full hover:bg-white/15 transition-colors disabled:opacity-30"
              >
                {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
            <button
              onClick={fullscreen}
              aria-label="Fullscreen"
              className="p-2 rounded-full hover:bg-white/15 transition-colors"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {showVideo && camera.streamSource && (
        <p className="mt-3 text-xs text-neutral-400">
          Demo feed · {camera.streamSource} · Caltrans
        </p>
      )}
    </section>
  );
}
