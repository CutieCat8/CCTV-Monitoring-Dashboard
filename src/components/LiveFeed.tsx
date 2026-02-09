import { Play, Pause, Maximize, Volume2, Settings, Circle } from 'lucide-react';
import { cameras } from '../data/cameras';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LiveFeedProps {
  selectedCamera: number;
}

export function LiveFeed({ selectedCamera }: LiveFeedProps) {
  const camera = cameras[selectedCamera];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-900">{camera.name}</h3>
          <p className="text-sm text-gray-500 mt-1">{camera.location}</p>
        </div>
        <div className="flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full">
          <Circle className="w-2 h-2 fill-current animate-pulse" />
          <span className="text-xs font-semibold">LIVE</span>
        </div>
      </div>
      
      <div className="relative bg-gray-900 aspect-video">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=675&fit=crop"
          alt="Live traffic feed"
          className="w-full h-full object-cover"
        />
        
        {/* Video Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <button className="hover:bg-white/20 p-2 rounded-lg transition-colors">
                <Play className="w-5 h-5" />
              </button>
              <button className="hover:bg-white/20 p-2 rounded-lg transition-colors">
                <Pause className="w-5 h-5" />
              </button>
              <button className="hover:bg-white/20 p-2 rounded-lg transition-colors">
                <Volume2 className="w-5 h-5" />
              </button>
              <span className="text-sm">
                {new Date().toLocaleTimeString('th-TH', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit'
                })}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="hover:bg-white/20 p-2 rounded-lg transition-colors">
                <Settings className="w-5 h-5" />
              </button>
              <button className="hover:bg-white/20 p-2 rounded-lg transition-colors">
                <Maximize className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
