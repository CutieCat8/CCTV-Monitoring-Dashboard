import { Link, useLocation, useNavigate } from 'react-router';
import { Search, Bell, LogOut } from 'lucide-react';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/dashboard/live', label: 'Live Monitoring' },
  { to: '/dashboard/events', label: 'Events' },
];

export function TopNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <nav className="h-14 flex items-center justify-between px-8 bg-[#fafaf8] border-b border-neutral-200/70">
      <div className="flex items-center gap-12 h-full">
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-neutral-900" />
          <span className="text-sm font-light tracking-[0.12em] uppercase text-neutral-900">Smart City CCTV</span>
        </Link>

        <div className="flex items-center gap-8 h-full">
          {links.map(({ to, label }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`relative h-full flex items-center text-sm transition-colors ${
                  active ? 'text-neutral-900' : 'text-neutral-400 hover:text-neutral-700'
                }`}
              >
                {label}
                <span
                  className={`absolute left-0 right-0 bottom-0 h-px bg-neutral-900 transition-opacity ${
                    active ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </Link>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-5">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-0 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent text-sm text-neutral-800 pl-7 pr-2 py-1.5 w-48 border-b border-neutral-200 focus:border-neutral-900 focus:outline-none placeholder-neutral-400 transition-colors"
          />
        </div>

        <button
          className="relative p-1.5 rounded-full hover:bg-neutral-200/60 transition-colors"
          aria-label="การแจ้งเตือน"
        >
          <Bell className="w-[18px] h-[18px] text-neutral-500" strokeWidth={1.5} />
          <span className="absolute top-1 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
        </button>

        <div className="w-7 h-7 rounded-full bg-neutral-900 text-white text-[11px] flex items-center justify-center">
          TC
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-900 transition-colors"
          title="Logout"
        >
          <LogOut className="w-4 h-4" strokeWidth={1.5} />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
