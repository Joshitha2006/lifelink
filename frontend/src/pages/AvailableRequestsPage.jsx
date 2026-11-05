import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
  Sparkles,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Filter,
  Check,
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';

export const AvailableRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [acceptingId, setAcceptingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const navigate = useNavigate();

  const categories = [
    'all',
    'Medical assistance coordination',
    'Food and essential supplies',
    'Clothing donations',
    'Disaster relief support',
    'Road blockage reporting',
    'Elderly assistance',
    'General community support',
  ];

  const fetchAvailableRequests = async () => {
    try {
      const url =
        selectedCategory === 'all'
          ? '/volunteers/available-requests'
          : `/volunteers/available-requests?category=${encodeURIComponent(selectedCategory)}`;
      const res = await api.get(url);
      if (res.data.success) {
        setRequests(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableRequests();
  }, [selectedCategory]);

  const handleAcceptRequest = async (requestId) => {
    setAcceptingId(requestId);
    setSuccessMessage('');
    try {
      const res = await api.post(`/assignments/${requestId}/accept`);
      if (res.data.success) {
        setSuccessMessage('Assignment accepted! You are now assigned to this ticket.');
        setTimeout(() => {
          navigate('/volunteer/assignments');
        }, 1200);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept assignment');
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            Live Dispatch Board
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Available Community Help Requests
          </h1>
          <p className="text-xs text-slate-500">
            Browse verified emergency requests that require active volunteer support.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'all' ? 'All Categories' : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading open requests...</div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
          <h3 className="font-bold text-slate-800 text-sm">All Clear!</h3>
          <p className="text-xs text-slate-500 mt-1">
            There are currently no unassigned emergency tickets in this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {requests.map((r) => (
            <div
              key={r._id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-teal-500/60 p-6 shadow-sm transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-slate-400">
                    {r.requestId}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <PriorityBadge priority={r.priority} />
                    <StatusBadge status={r.status} />
                  </div>
                </div>

                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    {r.category}
                  </span>
                  <h3 className="font-bold text-base text-slate-900 mt-2">
                    {r.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {r.description}
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-4 text-xs text-slate-500 border-t border-slate-100">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-orange-500" />
                    <span>{r.location?.city || 'Local Sector'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Requester: <strong>{r.user?.name || 'Citizen'}</strong>
                </span>

                <button
                  type="button"
                  onClick={() => handleAcceptRequest(r._id)}
                  disabled={acceptingId === r._id}
                  className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-sm disabled:opacity-50"
                >
                  {acceptingId === r._id ? (
                    'Claiming...'
                  ) : (
                    <>
                      <span>Accept Task</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
