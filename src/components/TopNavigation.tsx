import { Link, useLocation, useNavigate } from 'react-router';
import { Search, Bell, Video, LayoutDashboard, Monitor, AlertTriangle, LogOut } from 'lucide-react';

export function TopNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };
  
  return (
    <nav className="bg-gray-900 text-white h-14 flex items-center justify-between px-8">
      <div className="flex items-center gap-12">
        <div className="flex items-center gap-2">
          <Video className="w-6 h-6 text-blue-400" />
          <h1 className="text-base font-medium">Smart City CCTV</h1>
        </div>
        
        <div className="flex items-center gap-1">
          <Link
            to="/dashboard"
            className={`px-5 py-2 rounded-md transition-colors text-sm ${
              location.pathname === '/dashboard' 
                ? 'bg-gray-800 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Dashboard
          </Link>
          
          <Link
            to="/dashboard/live"
            className={`px-5 py-2 rounded-md transition-colors text-sm ${
              location.pathname === '/dashboard/live' 
                ? 'bg-gray-800 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Live Monitoring
          </Link>
          
          <Link
            to="/dashboard/events"
            className={`px-5 py-2 rounded-md transition-colors text-sm ${
              location.pathname === '/dashboard/events' 
                ? 'bg-gray-800 text-white' 
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            Events
          </Link>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            className="bg-gray-800 text-white text-sm pl-9 pr-4 py-1.5 rounded-md w-64 focus:outline-none focus:ring-1 focus:ring-gray-700 placeholder-gray-500"
          />
        </div>
        
        <button className="relative p-1.5 hover:bg-gray-800 rounded-md transition-colors" aria-label="การแจ้งเตือน">
          <Bell className="w-5 h-5 text-gray-400" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
          TC
        </div>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-800 rounded-md transition-colors text-sm text-gray-400 hover:text-white"
          title="Logout"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}