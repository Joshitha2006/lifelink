import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
  Heart,
  CheckSquare,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  UserCheck,
  ShieldAlert,
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import { MapViewer } from '../components/MapViewer';

export const VolunteerDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [availableRequests, setAvailableRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchVolunteerData = async () => {
    try {
      const [profRes, assignRes, reqRes] = await Promise.all([
        api.get('/volunteers/profile'),
        api.get('/assignments/my'),
        api.get('/volunteers/available-requests'),
      ]);

      if (profRes.data.success) setProfile(profRes.data.data);
      if (assignRes.data.success) setAssignments(assignRes.data.data);
      if (reqRes.data.success) setAvailableRequests(reqRes.data.data.slice(0, 4));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteerData();
  }, []);

  const toggleAvailability = async () => {
    if (!profile) return;
    const nextStatus = profile.availabilityStatus === 'available' ? 'busy' : 'available';
    try {
      const res = await api.put('/volunteers/profile', {
        availabilityStatus: nextStatus,
      });
      if (res.data.success) {
        setProfile((prev) => ({ ...prev, availabilityStatus: nextStatus }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const activeAssignments = assignments.filter((a) =>
    ['Offered', 'Accepted', 'In Progress'].includes(a.status)
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#0b132b] via-[#152042] to-[#1c2541] rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-3 border border-teal-500/30">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
              Certified First Responder Workspace
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome Back, {user?.name}
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Thank you for standing ready to assist. Review nearby emergency requests and update ongoing community tasks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Availability Toggle */}
            <button
              onClick={toggleAvailability}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm ${
                profile?.availabilityStatus === 'available'
                  ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                  : 'bg-amber-500 text-white hover:bg-amber-600'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
              Status: {profile?.availabilityStatus === 'available' ? 'Available to Respond' : 'Busy on Task'}
            </button>

            <Link
              to="/volunteer/available-requests"
              className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 flex items-center gap-2 transition"
            >
              <Sparkles className="w-4 h-4" />
              Browse Matching Requests
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
              Active Assignments
            </p>
            <h3 className="text-2xl font-black text-indigo-600 mt-1">{activeAssignments.length}</h3>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <CheckSquare className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
              Completed Tasks
            </p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">
              {profile?.completedTasksCount || 0}
            </h3>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
              Available Nearby
            </p>
            <h3 className="text-2xl font-black text-orange-600 mt-1">
              {availableRequests.length}
            </h3>
          </div>
          <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
              Community Rating
            </p>
            <h3 className="text-2xl font-black text-teal-600 mt-1">
              ★ {profile?.rating ? profile.rating.toFixed(1) : '5.0'}
            </h3>
          </div>
          <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Active Tasks & Available Requests Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Assignments */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">Current Assignments</h3>
                <p className="text-xs text-slate-500">Tasks assigned or accepted by you</p>
              </div>
              <Link
                to="/volunteer/assignments"
                className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
              >
                Manage <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-4 space-y-3">
              {activeAssignments.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No active assignments currently in your queue.
                </div>
              ) : (
                activeAssignments.map((a) => (
                  <div
                    key={a._id}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs font-bold text-slate-500">
                          {a.request?.requestId}
                        </span>
                        <StatusBadge status={a.status} />
                      </div>
                      <h4 className="font-bold text-sm text-slate-900">
                        {a.request?.title}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Area: {a.request?.location?.city}
                      </p>
                    </div>
                    <Link
                      to="/volunteer/assignments"
                      className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shrink-0 transition"
                    >
                      Update Task
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Available Requests To Pick Up */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">Recommended Open Requests</h3>
                <p className="text-xs text-slate-500">Verified community requests awaiting response</p>
              </div>
              <Link
                to="/volunteer/available-requests"
                className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
              >
                Browse All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="p-4 space-y-3">
              {availableRequests.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  No unassigned requests right now. All clear!
                </div>
              ) : (
                availableRequests.map((r) => (
                  <div
                    key={r._id}
                    className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 transition flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <PriorityBadge priority={r.priority} />
                        <span className="text-xs font-semibold text-slate-600">
                          {r.category}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-900 line-clamp-1">{r.title}</h4>
                      <p className="text-[11px] text-slate-500">
                        Location: {r.location?.city}
                      </p>
                    </div>
                    <Link
                      to="/volunteer/available-requests"
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0 transition"
                    >
                      Inspect & Accept
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
