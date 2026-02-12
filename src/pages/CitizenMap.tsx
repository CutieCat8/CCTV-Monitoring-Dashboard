import { useState } from 'react';
import { Layers, HelpCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

type IncidentType = 'accident' | 'congestion' | 'violation';

interface Incident {
  id: string;
  type: IncidentType;
  lat: number;
  lng: number;
  label: string;
  count?: number;
}

export function CitizenMap() {
  const { isDarkMode } = useTheme();
  const [filters, setFilters] = useState({
    accident: true,
    congestion: true,
    violation: true,
  });

  const incidents: Incident[] = [
    { id: '1', type: 'accident', lat: 25, lng: 50, label: 'อุบัติเหตุ', count: 2 },
    { id: '2', type: 'congestion', lat: 45, lng: 40, label: 'รถติด' },
    { id: '3', type: 'violation', lat: 35, lng: 25, label: 'การฝ่าฝืน', count: 1 },
    { id: '4', type: 'congestion', lat: 55, lng: 45, label: 'รถติด' },
    { id: '5', type: 'congestion', lat: 50, lng: 50, label: 'รถติด' },
  ];

  const getIncidentColor = (type: IncidentType) => {
    switch (type) {
      case 'accident':
        return 'bg-red-500';
      case 'congestion':
        return 'bg-orange-500';
      case 'violation':
        return 'bg-yellow-500';
    }
  };

  const getIncidentGlow = (type: IncidentType) => {
    switch (type) {
      case 'accident':
        return 'shadow-[0_0_80px_40px_rgba(239,68,68,0.4)]';
      case 'congestion':
        return 'shadow-[0_0_80px_40px_rgba(249,115,22,0.4)]';
      case 'violation':
        return 'shadow-[0_0_80px_40px_rgba(234,179,8,0.4)]';
    }
  };

  const toggleFilter = (type: IncidentType) => {
    setFilters(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const visibleIncidents = incidents.filter(incident => filters[incident.type]);

  const stats = {
    accident: incidents.filter(i => i.type === 'accident').length,
    congestion: incidents.filter(i => i.type === 'congestion').length,
    violation: incidents.filter(i => i.type === 'violation').length,
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className={`p-6 border-b ${isDarkMode ? 'border-neutral-800' : 'border-gray-200'}`}>
        <h1 className={`text-3xl font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>แผนที่เมือง</h1>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>แสดงจุดเหตุการณ์และสถานะการจราจร</p>
      </div>

      {/* Map Container */}
      <div className={`flex-1 relative overflow-hidden ${isDarkMode ? 'bg-gradient-to-br from-neutral-950 to-black' : 'bg-gradient-to-br from-gray-100 to-gray-200'}`}>
        {/* Grid Background */}
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path
                  d="M 40 0 L 0 0 0 40"
                  fill="none"
                  stroke="rgb(100, 100, 100)"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Layers Button - Top Right */}
        <div className="absolute top-6 right-6 z-20">
          <button className={`flex items-center gap-2 backdrop-blur-sm border px-4 py-2 rounded-lg transition-colors ${isDarkMode ? 'bg-neutral-950/80 border-neutral-800 text-white hover:bg-neutral-900/80' : 'bg-white/80 border-gray-300 text-gray-900 hover:bg-gray -50/80'}`}>
            <Layers className="w-5 h-5" />
            <span className="text-sm">เลเยอร์</span>
          </button>
        </div>

        {/* Filter Panel - Top Left */}
        <div className={`absolute top-6 left-6 backdrop-blur-sm rounded-xl p-5 border z-20 w-72 ${isDarkMode ? 'bg-neutral-950/80 border-neutral-800' : 'bg-white/80 border-gray-300'}`}>
          <div className="flex items-center gap-2 mb-4">
            <svg className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
            </svg>
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>ตัวกรอง</h3>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.accident}
                onChange={() => toggleFilter('accident')}
                className={`w-5 h-5 rounded cursor-pointer ${isDarkMode ? 'bg-neutral-900 border-neutral-700' : 'bg-gray-200 border-gray-400'}`}
              />
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>อุบัติเหตุ</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.congestion}
                onChange={() => toggleFilter('congestion')}
                className={`w-5 h-5 rounded cursor-pointer ${isDarkMode ? 'bg-neutral-900 border-neutral-700' : 'bg-gray-200 border-gray-400'}`}
              />
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>รถติด</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={filters.violation}
                onChange={() => toggleFilter('violation')}
                className={`w-5 h-5 rounded cursor-pointer ${isDarkMode ? 'bg-neutral-900 border-neutral-700' : 'bg-gray-200 border-gray-400'}`}
              />
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>การฝ่าฝืน</span>
            </label>
          </div>
        </div>

        {/* Stats Panel - Top Right (below layers button) */}
        <div className={`absolute top-20 right-6 backdrop-blur-sm rounded-xl p-5 border z-20 w-64 ${isDarkMode ? 'bg-neutral-950/80 border-neutral-800' : 'bg-white/80 border-gray-300'}`}>
          <h3 className={`font-semibold mb-4 text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>สถิติ</h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>อุบัติเหตุ</span>
              </div>
              <span className="text-red-400 font-bold text-xl">{stats.accident}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>รถติด</span>
              </div>
              <span className="text-orange-400 font-bold text-xl">{stats.congestion}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>การละเมิด</span>
              </div>
              <span className="text-yellow-400 font-bold text-xl">{stats.violation}</span>
            </div>
          </div>

          <div className={`mt-4 pt-3 border-t text-xs ${isDarkMode ? 'border-neutral-800 text-gray-500' : 'border-gray-300 text-gray-600'}`}>
            คลิกที่จุดเพื่อดูรายละเอียด
          </div>
        </div>

        {/* Incident Markers */}
        <div className="absolute inset-0 z-10">
          {visibleIncidents.map((incident) => (
            <div
              key={incident.id}
              className="absolute"
              style={{
                left: `${incident.lng}%`,
                top: `${incident.lat}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Glow Effect */}
              <div
                className={`absolute inset-0 rounded-full ${getIncidentColor(
                  incident.type
                )} ${getIncidentGlow(incident.type)} opacity-60 animate-pulse blur-3xl`}
                style={{ width: '120px', height: '120px', left: '-60px', top: '-60px' }}
              ></div>

              {/* Marker */}
              <div
                className={`relative w-4 h-4 ${getIncidentColor(
                  incident.type
                )} rounded-full cursor-pointer hover:scale-125 transition-transform z-20 shadow-lg`}
              >
                <div className="absolute inset-0 bg-white rounded-full opacity-40"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Info */}
        <div className={`absolute bottom-6 left-6 text-sm z-20 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          เชียงใหม่ | อำเภอเมืองเชียงใหม่
        </div>

        {/* Help Button - Bottom Right */}
        <div className="absolute bottom-6 right-6 z-20">
          <button className={`w-10 h-10 backdrop-blur-sm border rounded-lg flex items-center justify-center transition-colors ${isDarkMode ? 'bg-neutral-950/80 border-neutral-800 hover:bg-neutral-900/80' : 'bg-white/80 border-gray-300 hover:bg-gray-50/80'}`}>
            <HelpCircle className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
