import { motion, AnimatePresence } from 'motion/react';
import { X, Download, Eye, CheckCircle } from 'lucide-react';
import { Event, violationTypes } from '../data/events';

interface EventDetailPanelProps {
  event: Event | null;
  onClose: () => void;
}

const rules = {
  'no-helmet': 'Section 122: All motorcycle riders and passengers must wear safety helmets that meet standards.',
  'illegal-parking': 'Section 118: Parking is prohibited on roads with yellow continuous lines or in restricted zones.',
  'red-light': 'Section 118: Drivers must stop at red traffic lights and may not proceed until the green light is shown.',
  'wrong-lane': 'Section 34: Vehicles must stay in designated lanes and follow road markings.',
};

function Row({ label, value, mono }: { label: string; value?: string | number; mono?: boolean }) {
  if (value === undefined || value === '') return null;
  return (
    <div className="flex items-baseline justify-between gap-6 py-2.5 border-b border-neutral-100">
      <dt className="text-xs text-neutral-400 shrink-0">{label}</dt>
      <dd className={`text-sm text-neutral-800 text-right break-all ${mono ? 'font-mono text-xs' : ''}`}>{value}</dd>
    </div>
  );
}

export function EventDetailPanel({ event, onClose }: EventDetailPanelProps) {
  if (!event) return null;

  const violationType = violationTypes[event.type];
  const eventId = event.apiId || `EV-${String(event.id).padStart(6, '0')}`;

  let latitude = '';
  let longitude = '';
  if (event.coordinate) {
    const coords = event.coordinate.split(',');
    if (coords.length === 2) {
      longitude = coords[0].trim();
      latitude = coords[1].trim();
    }
  }

  const actions = [
    { icon: Eye, label: 'View footage', primary: true },
    { icon: CheckCircle, label: 'Mark reviewed' },
    { icon: Download, label: 'Export' },
  ];

  return (
    <AnimatePresence>
      {event && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 z-40"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
            className="fixed right-0 top-0 bottom-0 w-[35%] min-w-[360px] bg-[#fafaf8] shadow-[-12px_0_40px_rgba(0,0,0,0.06)] z-50 flex flex-col"
          >
            <header className="px-8 pt-8 pb-5 flex items-start justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.14em] text-neutral-400">{eventId}</p>
                <h2 className="text-xl font-light tracking-tight text-neutral-900 mt-2">{violationType.label}</h2>
                <p className="text-sm text-neutral-400 mt-1">
                  {event.timestamp.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
                  {' · '}
                  {event.timestamp.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 -mr-2 rounded-full hover:bg-neutral-200/60 transition-colors"
                aria-label="Close panel"
              >
                <X className="w-4 h-4 text-neutral-500" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-8 pb-8">
              {event.thumbnail && (
                <img
                  src={event.thumbnail}
                  alt="Event snapshot"
                  className="w-full h-60 object-cover rounded-xl bg-neutral-200 mb-8"
                />
              )}

              <dl className="mb-8">
                <Row label="Camera" value={event.cameraName} />
                <Row label="Camera ID" value={`CAM-${String(event.cameraId).padStart(3, '0')}`} />
                <Row label="Area" value={event.installationArea} />
                <Row label="Installation" value={event.installationLocation} />
                <Row label="Detection task" value={event.taskName} />
                <Row label="Task ID" value={event.taskId} mono />
                <Row label="Box code" value={event.boxCode} mono />
                <Row label="Equipment" value={event.equipmentName} />
                <Row label="Equipment ID" value={event.equipmentId} mono />
                <Row label="Latitude" value={latitude} mono />
                <Row label="Longitude" value={longitude} mono />
                <Row label="Event type ID" value={event.eventTypeId} />
              </dl>

              <div className="border-l-2 border-neutral-900 pl-4">
                <h3 className="text-xs uppercase tracking-[0.14em] text-neutral-400 mb-2">Rule violated</h3>
                <p className="text-sm font-light leading-relaxed text-neutral-700">{rules[event.type]}</p>
              </div>
            </div>

            <footer className="px-8 py-5 border-t border-neutral-200/70 flex gap-2">
              {actions.map(({ icon: Icon, label, primary }) => (
                <button
                  key={label}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm transition-colors ${
                    primary
                      ? 'bg-neutral-900 text-white hover:bg-neutral-700'
                      : 'bg-white text-neutral-700 ring-1 ring-neutral-200 hover:bg-neutral-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </footer>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
