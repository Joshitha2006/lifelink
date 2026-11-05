import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import {
  Users,
  ShieldAlert,
  Clock,
  CheckCircle2,
  Package,
  Droplet,
  Building2,
  TrendingUp,
  Activity,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await api.get('/admin/stats');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  const COLORS = ['#0d9488', '#f97316', '#3b82f6', '#ec4899', '#8b5cf6', '#eab308', '#64748b'];

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading admin analytics...</div>;
  }

  const s = stats || {};

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0b132b] via-[#101b3d] to-[#1c2541] rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-semibold mb-3 border border-orange-500/30">
              <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
              Administrative Command Center
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              LifeLink Platform Operations & Analytics
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Real-time situational awareness, emergency triage, volunteer dispatch verification, and community stockpile monitoring.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/requests"
              className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/30 flex items-center gap-1.5 transition"
            >
              <ShieldAlert className="w-4 h-4" />
              Triage Help Requests
            </Link>
            <Link
              to="/admin/users"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 flex items-center gap-1.5 transition"
            >
              <Users className="w-4 h-4 text-teal-400" />
              Manage Users & Volunteers
            </Link>
          </div>
        </div>
      </div>

      {/* 6 Key Performance Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Users</p>
          <div className="text-2xl font-black text-slate-900 mt-1">{s.totalUsers || 0}</div>
          <span className="text-[10px] text-teal-600 font-semibold">Registered Accounts</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Volunteers</p>
          <div className="text-2xl font-black text-teal-600 mt-1">{s.totalVolunteers || 0}</div>
          <span className="text-[10px] text-slate-400">{s.verifiedVolunteers || 0} Verified</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Help Tickets</p>
          <div className="text-2xl font-black text-slate-900 mt-1">{s.totalHelpRequests || 0}</div>
          <span className="text-[10px] text-slate-400">Total Logged</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Pending Triage</p>
          <div className="text-2xl font-black text-amber-600 mt-1">{s.pendingRequests || 0}</div>
          <span className="text-[10px] text-amber-600 font-semibold">Needs Approval</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Resolved Aid</p>
          <div className="text-2xl font-black text-emerald-600 mt-1">{s.completedRequests || 0}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">Safely Delivered</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Resources</p>
          <div className="text-2xl font-black text-indigo-600 mt-1">{s.availableResources || 0}</div>
          <span className="text-[10px] text-slate-400">Available Kits</span>
        </div>
      </div>

      {/* Recharts Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Requests vs Resolved Area Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-teal-600" />
                Monthly Request Volume & Resolution Trend
              </h3>
              <p className="text-xs text-slate-500">Comparison of emergency inquiries vs successfully delivered relief</p>
            </div>
            <span className="text-xs font-semibold text-slate-400">Last 5 Months</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={s.monthlyTrends || []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorRes" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0b132b',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="requests" stroke="#f97316" strokeWidth={2.5} fillOpacity={1} fill="url(#colorReq)" name="Emergency Requests" />
                <Area type="monotone" dataKey="resolved" stroke="#0d9488" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRes)" name="Resolved Aid" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Requests by Category Pie Chart */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              Incidents By Category
            </h3>
            <p className="text-xs text-slate-500">Category breakdown across all logged requests</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={s.categoryStats && s.categoryStats.length > 0 ? s.categoryStats : [{ category: 'Medical', count: 4 }, { category: 'Food', count: 3 }, { category: 'Disaster', count: 2 }]}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                  nameKey="category"
                >
                  {(s.categoryStats || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0b132b',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    color: '#fff',
                    fontSize: '11px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100 max-h-28 overflow-y-auto">
            {(s.categoryStats || []).map((cat, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 truncate">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  {cat.category}
                </span>
                <strong className="text-slate-800">{cat.count}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Action Triage Bar */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="font-extrabold text-base flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-teal-400" />
            Quick Administration Shortcut
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            You have <strong>{s.pendingRequests || 0}</strong> requests requiring verification and volunteer matching recommendation.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/requests"
            className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition"
          >
            Review Pending Requests
          </Link>
          <Link
            to="/admin/users"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
          >
            Review User Roster
          </Link>
        </div>
      </div>
    </div>
  );
};
