import { Outlet } from 'react-router';
import { TopNavigation } from './TopNavigation';

export function Layout() {
  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      <TopNavigation />
      <div className="h-[calc(100vh-56px)]">
        <Outlet />
      </div>
    </div>
  );
}