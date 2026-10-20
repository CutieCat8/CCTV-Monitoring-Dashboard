import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { 
  Home, 
  Map, 
  Megaphone, 
  MessageSquareWarning, 
  Calendar,
  Settings,
  MapPin,
  Bell,
  User,
  ChevronDown,
  LogOut,
  Sun,
  Moon
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export interface CitizenArea {
  id: string;
  label: string;
  district: string;
  subdistrict?: string;
  latitude: number;
  longitude: number;
}

const CITIZEN_AREAS: CitizenArea[] = [
  {
    id: 'mueang-chang-moi',
    label: 'อ.เมืองเชียงใหม่ - ต.ช้างม่อย',
    district: 'อ.เมืองเชียงใหม่',
    subdistrict: 'ต.ช้างม่อย',
    latitude: 18.7942,
    longitude: 98.9952,
  },
  {
    id: 'mueang-tha-phae',
    label: 'อ.เมืองเชียงใหม่ - ต.ท่าแพ',
    district: 'อ.เมืองเชียงใหม่',
    subdistrict: 'ต.ท่าแพ',
    latitude: 18.7878,
    longitude: 98.9931,
  },
  {
    id: 'mueang-si-phum',
    label: 'อ.เมืองเชียงใหม่ - ต.ศรีภูมิ',
    district: 'อ.เมืองเชียงใหม่',
    subdistrict: 'ต.ศรีภูมิ',
    latitude: 18.7938,
    longitude: 98.9851,
  },
  {
    id: 'mueang-hai-ya',
    label: 'อ.เมืองเชียงใหม่ - ต.หายยา',
    district: 'อ.เมืองเชียงใหม่',
    subdistrict: 'ต.หายยา',
    latitude: 18.7765,
    longitude: 98.9894,
  },
  {
    id: 'mueang-suthep',
    label: 'อ.เมืองเชียงใหม่ - ต.สุเทพ',
    district: 'อ.เมืองเชียงใหม่',
    subdistrict: 'ต.สุเทพ',
    latitude: 18.7904,
    longitude: 98.9515,
  },
  {
    id: 'sankamphaeng',
    label: 'อ.สันกำแพง',
    district: 'อ.สันกำแพง',
    latitude: 18.7486,
    longitude: 99.1229,
  },
  {
    id: 'mae-rim',
    label: 'อ.แม่ริม',
    district: 'อ.แม่ริม',
    latitude: 18.9132,
    longitude: 98.9606,
  },
];

export function CitizenLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedAreaId, setSelectedAreaId] = useState('mueang-chang-moi');
  const [isAreaMenuOpen, setIsAreaMenuOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const selectedArea = CITIZEN_AREAS.find((area) => area.id === selectedAreaId) ?? CITIZEN_AREAS[0];
  const areaDropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!areaDropdownRef.current) {
        return;
      }

      if (!areaDropdownRef.current.contains(event.target as Node)) {
        setIsAreaMenuOpen(false);
      }
    };

    window.addEventListener('mousedown', handleClickOutside);

    return () => {
      window.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  const navigation = [
    { name: 'ภาพรวม', path: '/citizen', icon: Home },
    { name: 'แผนที่เมือง', path: '/citizen/map', icon: Map },
    { name: 'ประกาศข่าว', path: '/citizen/announcements', icon: Megaphone },
    { name: 'ร้องเรียน', path: '/citizen/report', icon: MessageSquareWarning },
    { name: 'อีเวนท์', path: '/citizen/events', icon: Calendar },
  ];

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${
      isDarkMode ? 'bg-black' : 'bg-gray-50'
    }`}>
      {/* Sidebar */}
      <aside className={`w-[260px] border-r flex flex-col transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-neutral-950 border-neutral-800' 
          : 'bg-white border-gray-200'
      }`}>
        {/* Logo */}
        <div className={`p-6 border-b transition-colors duration-300 ${
          isDarkMode ? 'border-neutral-800' : 'border-gray-200'
        }`}>
          <h1 className="text-orange-600 font-bold text-lg">Smart Chiang Mai</h1>
          <p className={`text-xs mt-1 transition-colors duration-300 ${
            isDarkMode ? 'text-gray-500' : 'text-gray-600'
          }`}>Citizen Dashboard</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                  isActive
                    ? 'bg-orange-600/20 text-orange-400 border border-orange-600/30'
                    : isDarkMode
                      ? 'text-gray-400 hover:bg-neutral-900 hover:text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Settings */}
        <div className={`p-4 border-t transition-colors duration-300 ${
          isDarkMode ? 'border-neutral-800' : 'border-gray-200'
        }`}>
          <button className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full ${
            isDarkMode 
              ? 'text-gray-400 hover:bg-neutral-900 hover:text-white'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}>
            <Settings className="w-5 h-5" />
            <span className="text-sm">ตั้งค่า</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className={`relative z-[1200] h-16 border-b flex items-center justify-between px-6 transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-neutral-950 border-neutral-800'
            : 'bg-white border-gray-200'
        }`}>
          {/* Location Selector */}
          <div className="relative" ref={areaDropdownRef}>
            <button
              type="button"
              onClick={() => setIsAreaMenuOpen((prev) => !prev)}
              className={`w-[360px] h-[46px] rounded-xl border px-4 flex items-center justify-between text-sm transition-all duration-200 ${
                isDarkMode
                  ? 'bg-neutral-900 border-neutral-700 text-white hover:border-neutral-500'
                  : 'bg-white border-gray-300 text-gray-900 hover:border-orange-300 shadow-sm'
              }`}
              aria-haspopup="listbox"
              aria-label="เลือกพื้นที่ (อำเภอ/ตำบล)"
            >
              <span className="flex items-center gap-3 min-w-0">
                <MapPin className="w-5 h-5 text-orange-600 flex-shrink-0" />
                <span className="truncate font-medium">{selectedArea.label}</span>
              </span>
              <ChevronDown
                className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                  isAreaMenuOpen ? 'rotate-180' : ''
                } ${isDarkMode ? 'text-gray-300' : 'text-gray-500'}`}
              />
            </button>

            {isAreaMenuOpen && (
              <div
                className={`absolute mt-2 w-[360px] rounded-xl border overflow-hidden z-[1300] ${
                  isDarkMode ? 'bg-neutral-900 border-neutral-700' : 'bg-white border-gray-300 shadow-lg'
                }`}
              >
                <div className={`${isDarkMode ? 'bg-neutral-800' : 'bg-blue-50 border-b border-blue-200'} px-4 py-2 text-xs font-semibold ${isDarkMode ? 'text-gray-300' : 'text-blue-700'}`}>
                  เลือกพื้นที่
                </div>
                <div className="max-h-64 overflow-auto py-1">
                  {CITIZEN_AREAS.map((area) => {
                    const isSelected = area.id === selectedAreaId;
                    return (
                      <button
                        key={area.id}
                        type="button"
                        onClick={() => {
                          setSelectedAreaId(area.id);
                          setIsAreaMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          isSelected
                            ? isDarkMode
                              ? 'bg-neutral-800 text-orange-300'
                              : 'bg-orange-50 text-orange-700'
                            : isDarkMode
                              ? 'text-gray-200 hover:bg-neutral-800'
                              : 'text-gray-800 hover:bg-gray-50'
                        }`}
                      >
                        {area.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <div className={`relative flex items-center rounded-full p-1 w-[160px] transition-all duration-300 ${
              isDarkMode 
                ? 'bg-neutral-800 border border-neutral-700' 
                : 'bg-gray-200 border border-gray-300'
            }`}>
              {/* Light Mode Button */}
              <button
                onClick={() => toggleTheme()}
                disabled={!isDarkMode}
                className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 flex-1 text-xs font-medium ${
                  !isDarkMode
                    ? 'bg-white text-gray-800 shadow-md'
                    : 'text-gray-500 hover:text-gray-400'
                }`}
                aria-label="Light Mode"
              >
                <Sun className="w-4 h-4" />
                <span>LIGHT</span>
              </button>
              
              {/* Dark Mode Button */}
              <button
                onClick={() => toggleTheme()}
                disabled={isDarkMode}
                className={`flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 flex-1 text-xs font-medium ${
                  isDarkMode
                    ? 'bg-neutral-700 text-white shadow-md'
                    : 'text-gray-500 hover:text-gray-600'
                }`}
                aria-label="Dark Mode"
              >
                <Moon className="w-4 h-4" />
                <span>DARK</span>
              </button>
            </div>

            {/* Notifications */}
            <button className={`relative p-2 transition-colors ${
              isDarkMode 
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`} aria-label="การแจ้งเตือน">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-orange-600 rounded-full"></span>
            </button>

            {/* User */}
            <button className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              isDarkMode 
                ? 'bg-neutral-900 hover:bg-neutral-800'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}>
              <User className={`w-5 h-5 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`} />
              <span className={`text-sm ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>ผู้ใช้งาน</span>
            </button>

            {/* Logout */}
            <button 
              onClick={handleLogout}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                isDarkMode
                  ? 'text-gray-400 hover:bg-neutral-900 hover:text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className={`flex-1 overflow-auto transition-colors duration-300 ${
          isDarkMode ? 'bg-black' : 'bg-gray-50'
        }`}>
          <Outlet context={{ selectedArea }} />
        </main>
      </div>
    </div>
  );
}