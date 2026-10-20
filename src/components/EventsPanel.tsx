import { useState, useEffect } from 'react';
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
    <aside className="w-72 shrink-0 bg-[#fafaf8] border-l border-neutral-200/70 flex flex-col">
      <header className="px-6 pt-7 pb-3">
        <h2 className="text-base font-light tracking-tight text-neutral-900">Events</h2>
        <p className="text-xs text-neutral-400 mt-1">
          {loading ? "Loading…" : `${filteredEvents.length} violations today`}
        </p>
      </header>

      <div className="flex-1 overflow-y-auto">
        {filteredEvents.length === 0 ? (
          <p className="px-6 py-10 text-sm font-light text-neutral-400">
            {loading ? "" : "No violations for this camera"}
          </p>
        ) : (
          filteredEvents.map((event) => {
            const violationType = violationTypes[event.type];

            return (
              <button
                key={event.id}
                onClick={() => onEventClick(event)}
                className="w-full text-left flex items-center gap-3 px-6 py-3 hover:bg-white transition-colors"
              >
                {event.thumbnail ? (
                  <img
                    src={event.thumbnail}
                    alt=""
                    className="w-14 h-10 rounded-md object-cover bg-neutral-200 shrink-0"
                  />
                ) : (
                  <div className="w-14 h-10 rounded-md bg-neutral-100 shrink-0" />
                )}
                <span className="min-w-0">
                  <span className="block text-[13px] text-neutral-800 truncate">{violationType.label}</span>
                  <span className="block text-[11px] text-neutral-400 truncate">
                    {formatTime(event.timestamp)} · {event.cameraName}
                  </span>
                </span>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
}
