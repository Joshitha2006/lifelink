import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import {
  AlertTriangle,
  PlusCircle,
  Clock,
  CheckCircle2,
  Package,
  Droplet,
  MapPin,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';
import { MapViewer } from '../components/MapViewer';

export const CitizenDashboard = () => {
  const { user } = useAuth();
  const [myRequests, setMyRequests] = useState([]);
  const [supportCenters, setSupportCenters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCitizenData = async () => {
      try {
        const [reqRes, centerRes] = await Promise.all([
          api.get('/requests/my'),
          api.get('/support-centers'),
        ]);

        if (reqRes.data.success) {
          setMyRequests(reqRes.data.data);
        }
        if (centerRes.data.success) {
          setSupportCenters(centerRes.data.data);
        }
      } catch (err) {
        console.error('Error fetching citizen dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCitizenData();
  }, []);

  const pendingCount = myRequests.filter((r) => ['Pending', 'Verified'].includes(r.status)).length;
  const inProgressCount = myRequests.filter((r) => ['Volunteer Assigned', 'In Progress'].includes(r.status)).length;
  const completedCount = myRequests.filter((r) => r.status === 'Completed').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0b132b] to-[#1c2541] rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-3 border border-teal-500/30">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
              Citizen Emergency Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hello, {user?.name || 'Citizen'}
            </h1>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              Submit assistance requests, track assigned first responders in real-time, and access shared community aid.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/citizen/create-request"
              className="px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-orange-500/30 flex items-center gap-2 transition"
            >
              <PlusCircle className="w-4 h-4" />
              Create Help Request
            </Link>
            <Link
              to="/map"
              className="px-5 py-3 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 flex items-center gap-2 transition"
            >
              <MapPin className="w-4 h-4 text-teal-400" />
              Find Support Center
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
              Pending / Under Review
            </p>
            <h3 className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</h3>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
              Assigned / In Progress
            </p>
            <h3 className="text-2xl font-black text-indigo-600 mt-1">{inProgressCount}</h3>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-500 tracking-wider">
              Completed Assistance
            </p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">{completedCount}</h3>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Active Help Requests Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">My Emergency Requests</h3>
            <p className="text-xs text-slate-500">Real-time status of your submitted tickets</p>
          </div>
          <Link
            to="/citizen/my-requests"
            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            View all history <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-sm">Loading your requests...</div>
        ) : myRequests.length === 0 ? (
          <div className="p-12 text-center">
            <ShieldAlert className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="font-semibold text-slate-700 text-sm">No Active Help Requests</h4>
            <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto">
              If you or someone in your community needs medical, food, or emergency support, create a request now.
            </p>
            <Link
              to="/citizen/create-request"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-500 text-white font-bold text-xs"
            >
              <PlusCircle className="w-4 h-4" /> Create First Request
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {myRequests.slice(0, 4).map((req) => (
              <div
                key={req._id}
                className="p-4 sm:p-5 hover:bg-slate-50 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500">
                      {req.requestId}
                    </span>
                    <PriorityBadge priority={req.priority} />
                    <StatusBadge status={req.status} />
                    <span className="text-xs font-semibold text-slate-600">
                      • {req.category}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900 truncate">{req.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1">{req.description}</p>
                  <div className="text-[11px] text-slate-400">
                    Location: <strong>{req.location?.city}</strong> • Submitted:{' '}
                    {new Date(req.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {req.assignedVolunteer ? (
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-indigo-600 block">
                        Assigned Responder
                      </span>
                      <span className="text-xs font-bold text-slate-800">
                        {req.assignedVolunteer.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 italic">Volunteer Triage in progress</span>
                  )}
                  <Link
                    to="/citizen/my-requests"
                    className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-white text-xs font-semibold text-slate-700 transition"
                  >
                    Track Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Community Support Centers Map */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Nearby Relief & Support Centers</h3>
            <p className="text-xs text-slate-500">
              Community shelters, emergency medical stations, and food distribution hubs
            </p>
          </div>
          <Link
            to="/map"
            className="text-xs font-bold text-teal-600 hover:text-teal-700 flex items-center gap-1"
          >
            Explore Map <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <MapViewer
          height="320px"
          supportCenters={supportCenters}
          requests={myRequests}
        />
      </div>
    </div>
  );
};
