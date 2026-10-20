import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { cameras, mapEquipmentNameToCameraName } from '../data/cameras';
import { violationTypes, Event } from '../data/events';
import { generateTrafficData } from '../data/trafficData';
import { getWebhooks, base64ToDataUrl, WebhookEntry } from '../utils/api';

export function Dashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Calculate overall statistics
  const totalCameras = cameras.length;
  const activeCameras = cameras.filter(c => c.status === 'live').length;
  const totalViolations = events.length;
  
  // Calculate total traffic from all cameras
  const allTrafficData = cameras.map(camera => {
    const data = generateTrafficData(camera.id);
    return {
      cameraName: camera.name,
      total: data.reduce((sum, point) => sum + point.vehicles, 0)
    };
  }).sort((a, b) => b.total - a.total).slice(0, 5);
  
  // Violations by type
  const violationsByType = Object.entries(violationTypes).map(([type, info]) => ({
    name: info.label,
    value: events.filter(e => e.type === type).length,
    color: ({ 'no-helmet': '#171717', 'illegal-parking': '#525252', 'red-light': '#a3a3a3', 'wrong-lane': '#d6d6d1' } as Record<string, string>)[type]
  }));
  
  // Traffic trend (last 7 days)
  const trafficTrend = [
    { day: 'Mon', vehicles: 8420 },
    { day: 'Tue', vehicles: 8650 },
    { day: 'Wed', vehicles: 7890 },
    { day: 'Thu', vehicles: 9120 },
    { day: 'Fri', vehicles: 9580 },
    { day: 'Sat', vehicles: 7200 },
    { day: 'Sun', vehicles: 6800 },
  ];
  
  // Peak hours data
  const peakHoursData = [
    { hour: '06:00', vehicles: 450 },
    { hour: '07:00', vehicles: 720 },
    { hour: '08:00', vehicles: 890 },
    { hour: '12:00', vehicles: 680 },
    { hour: '17:00', vehicles: 850 },
    { hour: '18:00', vehicles: 920 },
  ];

  const axis = { fontSize: 11, fill: '#a3a3a3' };
  const tooltipStyle = {
    background: '#fff',
    border: '1px solid #e8e8e4',
    borderRadius: 8,
    boxShadow: 'none',
    fontSize: 12,
  };
  const formatTime = (date: Date) =>
    date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

  const stats = [
    { label: 'Cameras', value: String(totalCameras), note: `${activeCameras} online`, dot: 'bg-emerald-500' },
    { label: 'Violations', value: loading ? '–' : String(totalViolations), note: 'From API' },
    { label: 'Vehicles', value: '127.5K', note: '+8.2% vs yesterday' },
    { label: 'Avg response', value: '3.2m', note: 'Per incident' },
  ];

  const Section = ({ title, children, className = '' }: { title: string; children: React.ReactNode; className?: string }) => (
    <section className={className}>
      <h3 className="text-sm font-light tracking-tight text-neutral-900 mb-5">{title}</h3>
      {children}
    </section>
  );

  return (
    <div className="h-full overflow-auto bg-[#f7f7f5] text-neutral-900">
      <div className="max-w-6xl mx-auto px-10 py-10">
        <header className="mb-10">
          <h1 className="text-2xl font-light tracking-tight">Overview</h1>
          <p className="text-sm text-neutral-400 mt-1">Real-time monitoring and analytics</p>
        </header>

        {/* Stats */}
        <dl className="grid grid-cols-4 mb-14">
          {stats.map((s, i) => (
            <div key={s.label} className={i > 0 ? 'pl-8 border-l border-neutral-200/80' : ''}>
              <dt className="text-xs text-neutral-400">{s.label}</dt>
              <dd className="mt-2 text-4xl font-extralight tracking-tight tabular-nums">{s.value}</dd>
              <p className="mt-1 text-xs text-neutral-400 flex items-center gap-1.5">
                {s.dot && <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />}
                {s.note}
              </p>
            </div>
          ))}
        </dl>

        {/* Row 1 */}
        <div className="grid grid-cols-3 gap-14 mb-14">
          <Section title="Weekly traffic" className="col-span-2">
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={trafficTrend}>
                <CartesianGrid vertical={false} stroke="#e8e8e4" />
                <XAxis dataKey="day" tick={axis} axisLine={false} tickLine={false} />
                <YAxis tick={axis} axisLine={false} tickLine={false} width={40} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: '#d6d6d1' }} />
                <Line
                  type="monotone"
                  dataKey="vehicles"
                  stroke="#171717"
                  strokeWidth={1.5}
                  dot={false}
                  activeDot={{ r: 4, fill: '#171717', stroke: '#fff', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Section>

          <Section title="Violations by type">
            <div className="relative">
              <ResponsiveContainer width="100%" height={170}>
                <PieChart>
                  <Pie
                    data={violationsByType}
                    dataKey="value"
                    innerRadius={54}
                    outerRadius={78}
                    paddingAngle={2}
                    stroke="none"
                  >
                    {violationsByType.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-extralight tabular-nums">{totalViolations}</span>
                <span className="text-[11px] text-neutral-400">total</span>
              </div>
            </div>
            <ul className="mt-5 space-y-2">
              {violationsByType.map((v) => (
                <li key={v.name} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-neutral-600">
                    <span className="w-2 h-2 rounded-full" style={{ background: v.color }} />
                    {v.name}
                  </span>
                  <span className="tabular-nums text-neutral-400">{v.value}</span>
                </li>
              ))}
            </ul>
          </Section>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-3 gap-14 mb-14">
          <Section title="Top 5 cameras by traffic" className="col-span-2">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={allTrafficData} layout="vertical" barCategoryGap="35%">
                <CartesianGrid horizontal={false} stroke="#e8e8e4" />
                <XAxis type="number" tick={axis} axisLine={false} tickLine={false} />
                <YAxis dataKey="cameraName" type="category" width={170} tick={axis} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                <Bar dataKey="total" fill="#171717" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Section>

          <Section title="Peak hours today">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={peakHoursData} barCategoryGap="30%">
                <CartesianGrid vertical={false} stroke="#e8e8e4" />
                <XAxis dataKey="hour" tick={axis} axisLine={false} tickLine={false} />
                <YAxis tick={axis} axisLine={false} tickLine={false} width={32} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(0,0,0,0.03)' }} />
                <Bar dataKey="vehicles" fill="#d6d6d1" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Section>
        </div>

        {/* Recent violations */}
        <Section title="Recent violations">
          {loading ? (
            <p className="py-10 text-sm font-light text-neutral-400">Loading…</p>
          ) : events.length === 0 ? (
            <p className="py-10 text-sm font-light text-neutral-400">No violations found</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-neutral-200/80 text-[11px] uppercase tracking-[0.14em] text-neutral-400">
                  <th className="py-3 pr-4 font-normal w-24">Time</th>
                  <th className="py-3 pr-4 font-normal">Violation</th>
                  <th className="py-3 pr-4 font-normal">Location</th>
                  <th className="py-3 font-normal text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {events.slice(0, 5).map((event) => (
                  <tr key={event.id} className="border-b border-neutral-100 hover:bg-white/70 transition-colors">
                    <td className="py-3.5 pr-4 text-sm tabular-nums text-neutral-500">{formatTime(event.timestamp)}</td>
                    <td className="py-3.5 pr-4 text-sm text-neutral-800">{violationTypes[event.type].label}</td>
                    <td className="py-3.5 pr-4 text-sm text-neutral-500">{event.cameraName}</td>
                    <td className="py-3.5 text-right text-xs text-neutral-400">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                        Under review
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Section>
      </div>
    </div>
  );
}
