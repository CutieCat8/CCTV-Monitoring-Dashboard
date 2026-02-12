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
import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

export function CitizenLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedDistrict, setSelectedDistrict] = useState('เมืองเชียงใหม่ - ช้างม่อย');
  const { isDarkMode, toggleTheme } = useTheme();

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
        <header className={`h-16 border-b flex items-center justify-between px-6 transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-neutral-950 border-neutral-800'
            : 'bg-white border-gray-200'
        }`}>
          {/* Location Selector */}
          <div className={`flex items-center gap-3 px-4 py-2 rounded-lg border transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-neutral-900 border-neutral-800'
              : 'bg-gray-50 border-gray-200'
          }`}>
            <MapPin className="w-5 h-5 text-orange-600 flex-shrink-0" />
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className={`bg-transparent text-sm border-none outline-none cursor-pointer appearance-none pr-6 transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}
              aria-label="เลือกเขต"
            >
              <option value="เมืองเชียงใหม่ - ช้างม่อย">เมืองเชียงใหม่ - ช้างม่อย</option>
              <option value="เมืองเชียงใหม่ - ท่าแพ">เมืองเชียงใหม่ - ท่าแพ</option>
              <option value="เมืองเชียงใหม่ - ศรีภูมิ">เมืองเชียงใหม่ - ศรีภูมิ</option>
              <option value="เมืองเชียงใหม่ - หายยา">เมืองเชียงใหม่ - หายยา</option>
              <option value="สันกำแพง">สันกำแพง</option>
              <option value="แม่ริม">แม่ริม</option>
            </select>
            <ChevronDown className="w-4 h-4 text-gray-400 -ml-4" />
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
          <Outlet />
        </main>
      </div>
    </div>
  );
}