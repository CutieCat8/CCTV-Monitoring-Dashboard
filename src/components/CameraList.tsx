import { Video, Circle } from 'lucide-react';
import { cameras } from '../data/cameras';

interface CameraListProps {
  selectedCamera: number;
  onSelectCamera: (id: number) => void;
}

export function CameraList({ selectedCamera, onSelectCamera }: CameraListProps) {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">CCTV Cameras</h2>
        <p className="text-sm text-gray-500 mt-1">{cameras.length} cameras active</p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {cameras.map((camera) => (
          <button
            key={camera.id}
            onClick={() => onSelectCamera(camera.id)}
            className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left ${
              selectedCamera === camera.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-1 p-2 rounded-lg ${
                selectedCamera === camera.id ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <Video className={`w-4 h-4 ${
                  selectedCamera === camera.id ? 'text-blue-600' : 'text-gray-600'
                }`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm">{camera.name}</div>
                <div className="flex items-center gap-2 mt-1">
                  <Circle className={`w-2 h-2 fill-current ${
                    camera.status === 'live' ? 'text-green-500' : 'text-gray-400'
                  }`} />
                  <span className={`text-xs ${
                    camera.status === 'live' ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {camera.status === 'live' ? 'Live' : 'Offline'}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
