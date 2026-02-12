import { motion, AnimatePresence } from 'motion/react';
import { X, MapPin, Clock, Camera, Download, Eye, CheckCircle } from 'lucide-react';
import { Event, violationTypes } from '../data/events';

interface EventDetailPanelProps {
  event: Event | null;
  onClose: () => void;
}

export function EventDetailPanel({ event, onClose }: EventDetailPanelProps) {
  if (!event) return null;

  const violationType = violationTypes[event.type];
  const eventId = event.apiId || `EV-${String(event.id).padStart(6, '0')}`;
  
  // Parse coordinate
  let latitude = '';
  let longitude = '';
  if (event.coordinate) {
    const coords = event.coordinate.split(',');
    if (coords.length === 2) {
      longitude = coords[0].trim();
      latitude = coords[1].trim();
    }
  }

  return (
    <AnimatePresence>
      {event && (
        <>
          {/* Background Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 z-40"
          />
          
          {/* Slide-in Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
            className="fixed right-0 top-0 bottom-0 w-[35%] bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2 ${violationType.color}`}>
                    {violationType.label}
                  </div>
                  <div className="text-sm text-gray-500">Event ID: {eventId}</div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close panel"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* Large Image */}
              <div className="relative rounded-lg overflow-hidden mb-6">
                <img
                  src={event.thumbnail}
                  alt="Event snapshot"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  DETECTED
                </div>
              </div>
              
              {/* Event Information */}
              <div className="space-y-4 mb-6">
                <h3 className="font-semibold text-gray-900">Event Information</h3>
                
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-gray-600 mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs">Time Detected</span>
                    </div>
                    <div className="font-semibold text-gray-900">
                      {event.timestamp.toLocaleTimeString('th-TH', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {event.timestamp.toLocaleDateString('th-TH', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-start gap-2 text-blue-700">
                    <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                    <div>
                      <div className="text-xs font-medium mb-1">Camera Location</div>
                      <div className="font-semibold">{event.cameraName}</div>
                      {event.installationArea && (
                        <div className="text-xs mt-1">Area: {event.installationArea}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Additional Details */}
              <div className="space-y-4 mb-6">
                <h3 className="font-semibold text-gray-900">Additional Details</h3>
                
                <div className="space-y-3">
                  {event.taskName && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Detection Task</span>
                      <span className="text-sm font-medium text-gray-900">{event.taskName}</span>
                    </div>
                  )}
                  
                  {event.apiId && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">API ID</span>
                      <span className="text-sm font-medium text-gray-900 font-mono">{event.apiId}</span>
                    </div>
                  )}
                  
                  {event.taskId && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Task ID</span>
                      <span className="text-sm font-medium text-gray-900 font-mono">{event.taskId}</span>
                    </div>
                  )}
                  
                  {event.boxCode && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Box Code</span>
                      <span className="text-sm font-medium text-gray-900 font-mono">{event.boxCode}</span>
                    </div>
                  )}
                  
                  {event.equipmentId && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Equipment ID</span>
                      <span className="text-sm font-medium text-gray-900 font-mono text-xs">{event.equipmentId}</span>
                    </div>
                  )}
                  
                  {event.equipmentName && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Equipment Name</span>
                      <span className="text-sm font-medium text-gray-900 flex items-center gap-2">
                        <Camera className="w-4 h-4" />
                        {event.equipmentName}
                      </span>
                    </div>
                  )}
                  
                  {latitude && longitude && (
                    <>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Latitude</span>
                        <span className="text-sm font-medium text-gray-900 font-mono">{latitude}</span>
                      </div>
                      
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Longitude</span>
                        <span className="text-sm font-medium text-gray-900 font-mono">{longitude}</span>
                      </div>
                    </>
                  )}
                  
                  {event.installationLocation && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Installation Location</span>
                      <span className="text-sm font-medium text-gray-900">{event.installationLocation}</span>
                    </div>
                  )}
                  
                  {event.eventTypeId !== undefined && (
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">Event Type ID</span>
                      <span className="text-sm font-medium text-gray-900">{event.eventTypeId}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Violation Type</span>
                    <span className="text-sm font-medium text-gray-900">{violationType.label}</span>
                  </div>
                  
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600">Camera ID</span>
                    <span className="text-sm font-medium text-gray-900">CAM-{String(event.cameraId).padStart(3, '0')}</span>
                  </div>
                </div>
              </div>
              
              {/* Traffic Rule Violated */}
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-red-900 mb-2">Traffic Rule Violated</h4>
                <p className="text-sm text-red-700">
                  {event.type === 'no-helmet' && 'Section 122: All motorcycle riders and passengers must wear safety helmets that meet standards.'}
                  {event.type === 'illegal-parking' && 'Section 118: Parking is prohibited on roads with yellow continuous lines or in restricted zones.'}
                  {event.type === 'red-light' && 'Section 118: Drivers must stop at red traffic lights and may not proceed until the green light is shown.'}
                  {event.type === 'wrong-lane' && 'Section 34: Vehicles must stay in designated lanes and follow road markings.'}
                </p>
              </div>
            </div>
            
            {/* Action Buttons - Fixed at Bottom */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="grid grid-cols-3 gap-3">
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">View Footage</span>
                </button>
                
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Mark Reviewed</span>
                </button>
                
                <button className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium">
                  <Download className="w-4 h-4" />
                  <span className="text-sm">Export</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
