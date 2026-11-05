import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
  HeartHandshake,
  Bell,
  MapPin,
  Package,
  Droplet,
  Shield,
  User,
  LogOut,
  Menu,
  X,
  CheckCircle,
  ExternalLink,
} from 'lucide-react';

export const Navbar = () => {
  const { user, logout, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.data.slice(0, 5));
        setUnreadCount(res.data.unreadCount);
      }
    } catch (err) {
      // ignore
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, [user]);

  const handleMarkAsRead = async (id, link) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
      setNotificationsOpen(false);
      if (link) navigate(link);
    } catch (err) {
      console.error(err);
    }
  };



  const navLinks = [
    { name: 'Community Map', path: '/map', icon: MapPin },
    { name: 'Resource Sharing', path: '/resources', icon: Package },
    { name: 'Blood Donation', path: '/blood-donations', icon: Droplet },
  ];

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin/dashboard';
    if (user.role === 'volunteer') return '/volunteer/dashboard';
    return '/citizen/dashboard';
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0b132b] text-white shadow-lg border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <HeartHandshake className="w-6 h-6 text-slate-950 stroke-[2.2]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight text-white">
                    LIFE<span className="text-teal-400">LINK</span>
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    24/7 LIVE
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 hidden sm:block -mt-1 font-medium">
                  Smart Emergency Assistance
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 text-teal-400" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Controls / Auth */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2.5">
                {/* Notifications Bell */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationsOpen(!notificationsOpen)}
                    className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-orange-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Flyout */}
                  {notificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 overflow-hidden">
                      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800">
                        <span className="font-semibold text-sm text-white">Notifications</span>
                        <Link
                          to="/notifications"
                          onClick={() => setNotificationsOpen(false)}
                          className="text-xs text-teal-400 hover:underline"
                        >
                          View all
                        </Link>
                      </div>
                      <div className="max-h-72 overflow-y-auto divide-y divide-slate-800">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-6 text-center text-sm text-slate-400">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <div
                              key={n._id}
                              onClick={() => handleMarkAsRead(n._id, n.link)}
                              className={`p-3 hover:bg-slate-800/80 cursor-pointer transition flex items-start gap-2.5 ${
                                !n.isRead ? 'bg-slate-800/40' : ''
                              }`}
                            >
                              <div className="w-2 h-2 mt-1.5 rounded-full bg-teal-400 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-slate-200">{n.title}</p>
                                <p className="text-xs text-slate-400 truncate">{n.message}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Dashboard Button */}
                <Link
                  to={getDashboardPath()}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs tracking-wide transition shadow-sm"
                >
                  <Shield className="w-4 h-4" />
                  Dashboard
                </Link>

                {/* Profile Pill & Logout */}
                <div className="flex items-center gap-2 pl-1 border-l border-slate-700">
                  <div className="flex flex-col text-right hidden sm:block">
                    <span className="text-xs font-semibold text-white leading-tight">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-teal-400 tracking-wider">
                      {user.role}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 transition shadow-sm"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-2">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800"
            >
              <item.icon className="w-4 h-4 text-teal-400" />
              {item.name}
            </Link>
          ))}
          {user && (
            <Link
              to={getDashboardPath()}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-bold bg-teal-500 text-slate-950"
            >
              <Shield className="w-4 h-4" />
              Access {user.role.toUpperCase()} Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
