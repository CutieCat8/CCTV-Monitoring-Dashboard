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
    <div className="flex h-full bg-[#f7f7f5] text-neutral-900">
      <CameraList selectedCamera={selectedCamera} onSelectCamera={setSelectedCamera} />

      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-10 py-8 space-y-12">
          <LiveFeed selectedCamera={selectedCamera} />
          <TrafficAnalytics selectedCamera={selectedCamera} />
        </div>
      </main>

      <EventsPanel onEventClick={setSelectedEvent} selectedCamera={selectedCamera} />

      <EventDetailPanel event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}
