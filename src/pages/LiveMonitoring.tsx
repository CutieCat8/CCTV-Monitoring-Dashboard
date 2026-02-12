import { useState } from 'react';
import { CameraList } from '../components/CameraList';
import { LiveFeed } from '../components/LiveFeed';
import { EventsPanel } from '../components/EventsPanel';
import { TrafficAnalytics } from '../components/TrafficAnalytics';
import { EventDetailPanel } from '../components/EventDetailPanel';
import { Event } from '../data/events';

export function LiveMonitoring() {
  const [selectedCamera, setSelectedCamera] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  return (
    <div className="flex h-full">
      {/* Left Sidebar - Camera List */}
      <CameraList 
        selectedCamera={selectedCamera}
        onSelectCamera={setSelectedCamera}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          {/* Live Feed */}
          <div className="flex-1 p-6 overflow-auto">
            <LiveFeed selectedCamera={selectedCamera} />
            
            {/* Traffic Analytics */}
            <div className="mt-6">
              <TrafficAnalytics selectedCamera={selectedCamera} />
            </div>
          </div>
          
          {/* Right Panel - Events */}
          <EventsPanel 
            onEventClick={setSelectedEvent}
            selectedCamera={selectedCamera}
          />
        </div>
      </div>
      
      {/* Event Detail Slide-in Panel */}
      <EventDetailPanel 
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}