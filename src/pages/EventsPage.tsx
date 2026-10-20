import { useState, useEffect } from 'react';
import { Calendar, Search, Download } from 'lucide-react';
import { Event, violationTypes } from '../data/events';
import { EventDetailPanel } from '../components/EventDetailPanel';
import { FilterDropdown } from '../components/FilterDropdown';
import { getWebhooks, base64ToDataUrl, WebhookEntry } from '../utils/api';
import { cameras, mapEquipmentNameToCameraName } from '../data/cameras';

export function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ดึงข้อมูลจาก API
  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const response = await getWebhooks(100);
        
        // แปลง webhook data เป็น Event format
        const apiEvents: Event[] = response.webhooks
          .filter(webhook => webhook.body && Object.keys(webhook.body).length > 0)
          .map((webhook: WebhookEntry) => {
            const body = webhook.body;
            
            // Map equipment name ไปเป็นชื่อกล้อง
            const mappedCameraName = mapEquipmentNameToCameraName(body.equipmentName);
            
            // หา camera จากชื่อที่ map ได้
            let camera = cameras[0];
            let cameraId = 0;
            
            if (mappedCameraName) {
              const foundCamera = cameras.find(c => c.name === mappedCameraName);
              if (foundCamera) {
                camera = foundCamera;
                cameraId = foundCamera.id;
              }
            } else if (body.boxCode) {
              // fallback ไปใช้ boxCode
              cameraId = parseInt(body.boxCode.replace('box_', '').replace(/^0+/, '')) || 0;
              camera = cameras.find(c => c.id === cameraId) || cameras[0];
            }
            
            // กำหนด violation type จาก taskName
            let violationType: 'no-helmet' | 'illegal-parking' | 'red-light' | 'wrong-lane' = 'no-helmet';
            if (body.taskName?.toLowerCase().includes('helmet')) {
              violationType = 'no-helmet';
            } else if (body.taskName?.toLowerCase().includes('parking')) {
              violationType = 'illegal-parking';
            } else if (body.taskName?.toLowerCase().includes('red') || body.taskName?.toLowerCase().includes('light')) {
              violationType = 'red-light';
            } else if (body.taskName?.toLowerCase().includes('lane')) {
              violationType = 'wrong-lane';
            }
            
            return {
              id: webhook.id,
              apiId: body.id,
              type: violationType,
              cameraId: cameraId,
              cameraName: mappedCameraName || camera.name,
              timestamp: body.sendTime ? new Date(body.sendTime) : new Date(webhook.timestamp),
              thumbnail: body.imageUrl ? base64ToDataUrl(body.imageUrl) : '',
              taskId: body.taskId,
              boxCode: body.boxCode,
              strRes: body.strRes,
              taskName: body.taskName,
              coordinate: body.coordinate,
              equipmentId: body.equipmentId,
              equipmentName: body.equipmentName,
              installationArea: body.installationArea,
              installationLocation: body.installationLocation,
              sendTime: body.sendTime,
              eventTypeId: body.eventTypeId
            };
          });
        
        // ใช้เฉพาะข้อมูลจาก API
        setEvents(apiEvents);
        setError(null);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events from API.');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  // Filter events
  const filteredEvents = events.filter(event => {
    const matchesType = filterType === 'all' || event.type === filterType;
    const matchesSearch = event.cameraName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Group events by date
  const groupedEvents = filteredEvents.reduce((groups, event) => {
    const dateKey = event.timestamp.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(event);
    return groups;
  }, {} as Record<string, Event[]>);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('th-TH', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const stats = [
    { label: 'Total events', value: events.length, note: 'Today' },
    ...Object.entries(violationTypes).slice(0, 3).map(([type, info]) => ({
      label: info.label,
      value: events.filter((e) => e.type === type).length,
      note: 'Cases',
    })),
  ];

  const filters = [
    { key: 'all', label: 'All', count: events.length },
    ...Object.entries(violationTypes).map(([key, info]) => ({
      key,
      label: info.label,
      count: events.filter((e) => e.type === key).length,
    })),
  ];

  return (
    <div className="h-full overflow-auto bg-[#f7f7f5] text-neutral-900">
      <div className="max-w-6xl mx-auto px-10 py-10">
        {/* Header */}
        <header className="flex items-end justify-between mb-10">
          <div>
            <h1 className="text-2xl font-light tracking-tight">Events</h1>
            <p className="text-sm text-neutral-400 mt-1">
              {loading ? 'Loading…' : `All traffic violations and incidents · ${events.length} total`}
            </p>
            {error && (
              <p className="text-xs text-amber-600 mt-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                {error}
              </p>
            )}
          </div>

          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-900 text-white text-sm hover:bg-neutral-700 transition-colors">
            <Download className="w-4 h-4" />
            Export report
          </button>
        </header>

        {/* Stats */}
        <dl className="grid grid-cols-4 mb-12">
          {stats.map((s, i) => (
            <div key={s.label} className={i > 0 ? 'pl-8 border-l border-neutral-200/80' : ''}>
              <dt className="text-xs text-neutral-400">{s.label}</dt>
              <dd className="mt-2 text-4xl font-extralight tracking-tight tabular-nums">{s.value}</dd>
              <p className="mt-1 text-xs text-neutral-400">{s.note}</p>
            </div>
          ))}
        </dl>

        {/* Filters */}
        <div className="flex items-end justify-between gap-8 border-b border-neutral-200/80 mb-2">
          <div className="pb-2">
            <FilterDropdown
              value={filterType}
              options={filters}
              onChange={setFilterType}
              ariaLabel="Filter by violation type"
            />
          </div>

          <div className="flex items-center gap-6 pb-2 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-0 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search camera"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm pl-7 pr-2 py-1 w-44 border-b border-transparent focus:border-neutral-900 focus:outline-none placeholder-neutral-400 transition-colors"
              />
            </div>
            <button className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-900 transition-colors">
              <Calendar className="w-4 h-4" strokeWidth={1.5} />
              Date range
            </button>
          </div>
        </div>

        {/* Events list */}
        <div>
          {Object.entries(groupedEvents).map(([date, dateEvents]) => (
            <section key={date} className="pt-8">
              <h3 className="flex items-baseline gap-3 mb-3 text-[11px] uppercase tracking-[0.14em] text-neutral-400">
                {date}
                <span className="tabular-nums">{dateEvents.length}</span>
              </h3>

              <ul>
                {dateEvents.map((event) => {
                  const violationType = violationTypes[event.type];

                  return (
                    <li key={event.id}>
                      <button
                        onClick={() => setSelectedEvent(event)}
                        className="w-full text-left flex items-center gap-6 py-4 border-b border-neutral-100 hover:bg-white/70 transition-colors"
                      >
                        {event.thumbnail ? (
                          <img
                            src={event.thumbnail}
                            alt=""
                            className="w-28 h-[72px] shrink-0 rounded-lg object-cover bg-neutral-200"
                          />
                        ) : (
                          <div className="w-28 h-[72px] shrink-0 rounded-lg bg-neutral-100" />
                        )}

                        <div className="flex-1 min-w-0">
                          <p className="text-[15px] text-neutral-900">{violationType.label}</p>
                          <p className="text-xs text-neutral-400 mt-1 font-mono">
                            EV-{String(event.id).padStart(6, '0')}
                          </p>
                        </div>

                        <p className="w-56 text-sm text-neutral-500 truncate">{event.cameraName}</p>
                        <p className="w-14 text-sm tabular-nums text-neutral-500">{formatTime(event.timestamp)}</p>

                        <span className="w-28 flex items-center justify-end gap-1.5 text-xs text-neutral-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          Under review
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>

        {filteredEvents.length === 0 && (
          <p className="py-16 text-center text-sm font-light text-neutral-400">
            {loading ? '' : 'No events match your filters'}
          </p>
        )}
      </div>

      <EventDetailPanel event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  );
}
