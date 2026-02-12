import { useState, useEffect } from 'react';
import { AlertTriangle, Clock, MapPin } from 'lucide-react';
import { Event, violationTypes } from '../data/events';
import { getWebhooks, base64ToDataUrl, WebhookEntry } from '../utils/api';
import { cameras, mapEquipmentNameToCameraName } from '../data/cameras';

interface EventsPanelProps {
  onEventClick: (event: Event) => void;
  selectedCamera?: number;
}

export function EventsPanel({ onEventClick, selectedCamera }: EventsPanelProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูลจาก API
  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const response = await getWebhooks(50);
        
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
        
        setEvents(apiEvents);
      } catch (err) {
        console.error('Error fetching events:', err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);
  
  // กรอง events ตามกล้องที่เลือก (โดยเทียบชื่อกล้อง)
  const selectedCameraObj = cameras.find(c => c.id === selectedCamera);
  const filteredEvents = selectedCamera !== undefined && selectedCameraObj
    ? events.filter(event => event.cameraName === selectedCameraObj.name)
    : events;
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h2 className="text-lg font-semibold text-gray-900">Detected Events</h2>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {loading ? 'Loading...' : `${filteredEvents.length} violations today`}
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 p-6">
            <AlertTriangle className="w-12 h-12 mb-3" />
            <p className="text-center">No violations detected for this camera</p>
          </div>
        ) : (
          filteredEvents.map((event) => {
          const violationType = violationTypes[event.type];
          
          return (
            <div
              key={event.id}
              onClick={() => onEventClick(event)}
              className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              {event.thumbnail ? (
                <img 
                  src={event.thumbnail} 
                  alt="Event thumbnail"
                  className="w-full rounded-lg overflow-hidden mb-3 bg-gray-200 h-28 object-cover"
                />
              ) : (
                <div className="relative rounded-lg overflow-hidden mb-3 bg-gray-200 h-28 flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-500 rounded-full animate-spin"></div>
                </div>
              )}
              
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${violationType.color}`}>
                {violationType.label}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(event.timestamp)}</span>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-2">{event.cameraName}</span>
                </div>
              </div>
            </div>
          );
        }))}
      </div>
    </div>
  );
}