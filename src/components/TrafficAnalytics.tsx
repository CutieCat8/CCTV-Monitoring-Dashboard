import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, Calendar, TrendingUp } from 'lucide-react';
import { cameras } from '../data/cameras';
import { generateTrafficData } from '../data/trafficData';

interface TrafficAnalyticsProps {
  selectedCamera: number;
}

export function TrafficAnalytics({ selectedCamera }: TrafficAnalyticsProps) {
  const [timeRange, setTimeRange] = useState<'today' | 'week'>('today');
  const camera = cameras[selectedCamera];
  const trafficData = generateTrafficData(selectedCamera);
  
  // Calculate total vehicles
  const totalVehicles = trafficData.reduce((sum, point) => sum + point.vehicles, 0);
  const avgPerHour = Math.floor(totalVehicles / trafficData.length);
  const peakHour = trafficData.reduce((max, point) => 
    point.vehicles > max.vehicles ? point : max
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="font-semibold text-gray-900">Traffic Volume Analysis</h3>
              <p className="text-sm text-gray-500 mt-1">{camera.name}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTimeRange('today')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === 'today'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Today
            </button>
            <button
              onClick={() => setTimeRange('week')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              This Week
            </button>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 p-6 border-b border-gray-200">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="text-sm text-blue-600 font-medium">Total Vehicles</div>
          <div className="text-2xl font-bold text-blue-900 mt-1">
            {totalVehicles.toLocaleString()}
          </div>
          <div className="text-xs text-blue-600 mt-1">Last 24 hours</div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <div className="text-sm text-green-600 font-medium">Average per Hour</div>
          <div className="text-2xl font-bold text-green-900 mt-1">
            {avgPerHour.toLocaleString()}
          </div>
          <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            +12% from yesterday
          </div>
        </div>
        
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="text-sm text-orange-600 font-medium">Peak Hour</div>
          <div className="text-2xl font-bold text-orange-900 mt-1">
            {peakHour.hour}
          </div>
          <div className="text-xs text-orange-600 mt-1">
            {peakHour.vehicles.toLocaleString()} vehicles
          </div>
        </div>
      </div>
      
      {/* Chart */}
      <div className="p-6">
        <h4 className="text-sm font-medium text-gray-700 mb-4">Hourly Vehicle Count</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={trafficData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="hour" 
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              stroke="#9ca3af"
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Bar 
              dataKey="vehicles" 
              fill="#3b82f6" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
