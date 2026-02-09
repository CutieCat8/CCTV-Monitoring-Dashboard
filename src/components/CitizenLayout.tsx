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
  LogOut
} from 'lucide-react';
import { useState } from 'react';

export function CitizenLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedDistrict, setSelectedDistrict] = useState('เมืองเชียงใหม่ - ช้างม่อย');

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
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <aside className="w-[260px] bg-neutral-950 border-r border-neutral-800 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-neutral-800">
          <h1 className="text-orange-600 font-bold text-lg">Smart Chiang Mai</h1>
          <p className="text-gray-500 text-xs mt-1">Citizen Dashboard</p>
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
                    : 'text-gray-400 hover:bg-neutral-900 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Settings */}
        <div className="p-4 border-t border-neutral-800">
          <button className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-neutral-900 hover:text-white transition-all w-full">
            <Settings className="w-5 h-5" />
            <span className="text-sm">ตั้งค่า</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between px-6">
          {/* Location Selector */}
          <div className="flex items-center gap-3 bg-neutral-900 px-4 py-2 rounded-lg border border-neutral-800">
            <MapPin className="w-5 h-5 text-orange-600 flex-shrink-0" />
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-transparent text-white text-sm border-none outline-none cursor-pointer appearance-none pr-6"
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
            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-white transition-colors" aria-label="การแจ้งเตือน">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-orange-600 rounded-full"></span>
            </button>

            {/* User */}
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 transition-colors">
              <User className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-white">ผู้ใช้งาน</span>
            </button>

            {/* Logout */}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-400 hover:bg-neutral-900 hover:text-white transition-all"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}