import { useState, useEffect } from 'react';
import { AlertTriangle, Calendar, Filter, Search, Download, Eye } from 'lucide-react';
import { Event, violationTypes } from '../data/events';
import { EventDetailPanel } from '../components/EventDetailPanel';
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
              cameraName: body.equipmentName || body.installationLocation || camera.name,
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

  return (
    <div className="p-6 overflow-auto h-full">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Detected Events</h2>
            <p className="text-gray-500 mt-1">
              {loading ? 'Loading events...' : `All traffic violations and incidents (${events.length} total)`}
            </p>
            {error && (
              <p className="text-sm text-orange-600 mt-1">⚠️ {error}</p>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="text-sm text-gray-600">Total Events</div>
            <div className="text-2xl font-bold text-gray-900 mt-1">{events.length}</div>
            <div className="text-xs text-gray-500 mt-1">Today</div>
          </div>
          
          {Object.entries(violationTypes).slice(0, 3).map(([type, info]) => {
            const count = events.filter(e => e.type === type).length;
            return (
              <div key={type} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="text-sm text-gray-600">{info.label}</div>
                <div className="text-2xl font-bold text-gray-900 mt-1">{count}</div>
                <div className="text-xs text-gray-500 mt-1">Cases</div>
              </div>
            );
          })}
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by camera location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Filter by violation type"
              >
                <option value="all">All Types</option>
                {Object.entries(violationTypes).map(([type, info]) => (
                  <option key={type} value={type}>{info.label}</option>
                ))}
              </select>
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Calendar className="w-4 h-4" />
              Date Range
            </button>
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-6">
          {Object.entries(groupedEvents).map(([date, dateEvents]) => (
            <div key={date}>
              <div className="flex items-center gap-3 mb-4">
                <h3 className="font-semibold text-gray-900">{date}</h3>
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="text-sm text-gray-500">{dateEvents.length} events</span>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                {dateEvents.map((event) => {
                  const violationType = violationTypes[event.type];
                  
                  return (
                    <div
                      key={event.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex items-start gap-4">
                        {/* Thumbnail */}
                        {event.thumbnail ? (
                          <img
                            src={event.thumbnail}
                            alt="Event snapshot"
                            className="w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden object-cover"
                          />
                        ) : (
                          <div className="relative w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                            <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
                          </div>
                        )}
                        
                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${violationType.color}`}>
                                {violationType.label}
                              </div>
                              <div className="text-sm text-gray-500">
                                Event ID: EV-{String(event.id).padStart(6, '0')}
                              </div>
                            </div>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEvent(event);
                              }}
                              className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              <span className="text-sm">View Details</span>
                            </button>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>{formatTime(event.timestamp)}</span>
                            </div>
                            
                            <div className="flex items-start gap-2 text-sm text-gray-600">
                              <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                              <span className="line-clamp-1">{event.cameraName}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">
                                Under Review
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No events found matching your filters</p>
          </div>
        )}
      </div>
      
      {/* Event Detail Slide-in Panel */}
      <EventDetailPanel 
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}