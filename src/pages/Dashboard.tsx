import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Video, AlertTriangle, TrendingUp, Activity, Users, Clock, MapPin } from 'lucide-react';
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
    color: type === 'no-helmet' ? '#f97316' : 
           type === 'illegal-parking' ? '#ef4444' :
           type === 'red-light' ? '#dc2626' : '#eab308'
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

  return (
    <div className="p-6 overflow-auto h-full">
      <div className="max-w-[1600px] mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">System Overview</h2>
          <p className="text-gray-500 mt-1">Real-time monitoring and analytics dashboard</p>
        </div>
        
        {/* Top Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Cameras</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{totalCameras}</p>
                <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                  <Activity className="w-4 h-4" />
                  {activeCameras} online
                </p>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                <Video className="w-7 h-7 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Violations</p>
                {loading ? (
                  <div className="flex items-center gap-2 mt-2">
                    <div className="w-8 h-8 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin"></div>
                  </div>
                ) : (
                  <>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{totalViolations}</p>
                    <p className="text-sm text-red-600 mt-2">From API</p>
                  </>
                )}
              </div>
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-red-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Vehicles</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">127.5K</p>
                <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +8.2% vs yesterday
                </p>
              </div>
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-7 h-7 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Response Time</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">3.2m</p>
                <p className="text-sm text-blue-600 mt-2">Per incident</p>
              </div>
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                <Clock className="w-7 h-7 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Charts Row 1 */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Traffic Trend */}
          <div className="col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Weekly Traffic Trend</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={trafficTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="vehicles" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {/* Violations by Type */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Violations by Type</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={violationsByType}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {violationsByType.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Charts Row 2 */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Top Cameras by Traffic */}
          <div className="col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Top 5 Cameras by Traffic Volume</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={allTrafficData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <YAxis 
                  dataKey="cameraName" 
                  type="category" 
                  width={200}
                  tick={{ fontSize: 11 }} 
                  stroke="#9ca3af" 
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="total" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Peak Hours */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Peak Hours Today</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={peakHoursData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="hour" tick={{ fontSize: 11 }} stroke="#9ca3af" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="vehicles" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Recent Violations */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Recent Violations</h3>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                <p className="text-gray-500">Loading violations...</p>
              </div>
            </div>
          ) : events.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">No violations found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Time</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Violation Type</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Location</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {events.slice(0, 5).map((event) => {
                    const violationType = violationTypes[event.type];
                    const formatTime = (date: Date) => {
                      return date.toLocaleTimeString('th-TH', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      });
                    };
                    
                    return (
                      <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900">
                          {formatTime(event.timestamp)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${violationType.color}`}>
                            {violationType.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {event.cameraName}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                            Under Review
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}