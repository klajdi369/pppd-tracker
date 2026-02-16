import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PenSquare, History, Settings } from 'lucide-react';

export default function NavBar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'} end>
        <LayoutDashboard size={22} />
        <span>Dashboard</span>
      </NavLink>
      <NavLink to="/log" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <PenSquare size={22} />
        <span>Log</span>
      </NavLink>
      <NavLink to="/history" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <History size={22} />
        <span>History</span>
      </NavLink>
      <NavLink to="/settings" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
        <Settings size={22} />
        <span>Settings</span>
      </NavLink>
    </nav>
  );
}
