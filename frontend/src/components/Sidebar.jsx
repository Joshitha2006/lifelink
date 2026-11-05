import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  Clock,
  MapPin,
  Package,
  Droplet,
  Users,
  ShieldCheck,
  Building2,
  Bell,
  UserCheck,
  CheckSquare,
  Sparkles,
} from 'lucide-react';

export const Sidebar = () => {
  const { user } = useAuth();
  if (!user) return null;

  const getRoleNavItems = () => {
    switch (user.role) {
      case 'admin':
        return [
          { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
          { label: 'Request Triage', path: '/admin/requests', icon: ShieldCheck },
          { label: 'User & Volunteers', path: '/admin/users', icon: Users },
          { label: 'Support Centers', path: '/map', icon: Building2 },
          { label: 'Blood Coordination', path: '/blood-donations', icon: Droplet },
          { label: 'Resource Stockpile', path: '/resources', icon: Package },
          { label: 'System Notifications', path: '/notifications', icon: Bell },
        ];
      case 'volunteer':
        return [
          { label: 'Volunteer Hub', path: '/volunteer/dashboard', icon: LayoutDashboard },
          { label: 'Available Requests', path: '/volunteer/available-requests', icon: Sparkles },
          { label: 'My Assignments', path: '/volunteer/assignments', icon: CheckSquare },
          { label: 'My Skills & Area', path: '/volunteer/profile', icon: UserCheck },
          { label: 'Emergency Map', path: '/map', icon: MapPin },
          { label: 'Resource Sharing', path: '/resources', icon: Package },
          { label: 'Blood Coordination', path: '/blood-donations', icon: Droplet },
        ];
      case 'citizen':
      default:
        return [
          { label: 'My Dashboard', path: '/citizen/dashboard', icon: LayoutDashboard },
          { label: 'Create Help Request', path: '/citizen/create-request', icon: PlusCircle },
          { label: 'My Requests History', path: '/citizen/my-requests', icon: Clock },
          { label: 'Community Map', path: '/map', icon: MapPin },
          { label: 'Resource Sharing', path: '/resources', icon: Package },
          { label: 'Blood Requests', path: '/blood-donations', icon: Droplet },
          { label: 'Notifications', path: '/notifications', icon: Bell },
        ];
    }
  };

  const navItems = getRoleNavItems();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Role banner */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold text-base">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-white truncate">{user.name}</h4>
            <p className="text-[11px] font-medium text-teal-400 uppercase tracking-wider">
              {user.role} workspace
            </p>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Navigation Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-500/20 to-teal-500/5 text-teal-300 border-l-4 border-teal-400 pl-2'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4 text-teal-400 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Emergency Hotline Badge */}
      <div className="p-3.5 m-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs">
        <div className="font-bold flex items-center gap-1.5 text-orange-400 mb-1">
          <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
          Emergency Hotline
        </div>
        <p className="text-[11px] text-slate-300 leading-tight">
          Police / Medical: <strong>112 / 911</strong>
          <br />
          Disaster Control: <strong>1070</strong>
        </p>
      </div>
    </aside>
  );
};
