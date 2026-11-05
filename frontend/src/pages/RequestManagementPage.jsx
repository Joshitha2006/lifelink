import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import {
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  UserCheck,
  MapPin,
  Sparkles,
  X,
  Check,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';

export const RequestManagementPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Volunteer Recommendation Matching Modal
  const [matchingRequest, setMatchingRequest] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loadingRecs, setLoadingRecs] = useState(false);
  const [assigningId, setAssigningId] = useState(null);

  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

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

  const fetchRequests = async () => {
    try {
      let url = '/requests?';
      if (statusFilter !== 'all') url += `status=${statusFilter}&`;
      if (categoryFilter !== 'all') url += `category=${encodeURIComponent(categoryFilter)}&`;

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
    fetchRequests();
  }, [statusFilter, categoryFilter]);

  const handleUpdateStatus = async (requestId, nextStatus) => {
    setActionError('');
    try {
      const res = await api.put(`/requests/${requestId}/status`, {
        status: nextStatus,
        note: `Status updated to ${nextStatus} by Administrator`,
      });
      if (res.data.success) {
        setActionSuccess(`Request status updated to ${nextStatus}`);
        await fetchRequests();
      }
    } catch (err) {
      setActionError('Failed to update status');
    }
  };

  const handleOpenMatchingModal = async (req) => {
    setMatchingRequest(req);
    setLoadingRecs(true);
    try {
      const res = await api.get(`/volunteers/recommendations/${req._id}`);
      if (res.data.success) {
        setRecommendations(res.data.data);
      }
    } catch (err) {
      alert('Failed to load volunteer recommendations');
    } finally {
      setLoadingRecs(false);
    }
  };

  const handleAssignVolunteer = async (volunteerUserId) => {
    if (!matchingRequest) return;
    setAssigningId(volunteerUserId);
    try {
      const res = await api.post('/assignments', {
        requestId: matchingRequest._id,
        volunteerId: volunteerUserId,
        notes: `Assigned via recommendation system matching`,
      });
      if (res.data.success) {
        setActionSuccess('Volunteer assigned successfully!');
        setMatchingRequest(null);
        await fetchRequests();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign volunteer');
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 text-xs font-bold border border-orange-200 mb-1">
            <ShieldAlert className="w-3.5 h-3.5" />
            Triage & Matching Console
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Emergency Help Request Management
          </h1>
          <p className="text-xs text-slate-500">
            Audit reported incidents, verify legitimacy, and dispatch matched volunteers based on skills and proximity.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">All Statuses</option>
            <option value="Pending">Pending Review</option>
            <option value="Verified">Verified</option>
            <option value="Volunteer Assigned">Volunteer Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'all' ? 'All Categories' : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess('')} className="text-emerald-700">
            &times;
          </button>
        </div>
      )}

      {/* Requests Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading requests triage...</div>
        ) : requests.length === 0 ? (
          <div className="p-12 text-center text-slate-500">No requests found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Ticket</th>
                  <th className="p-4">Category & Title</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Assigned Responder</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {requests.map((req) => (
                  <tr key={req._id} className="hover:bg-slate-50 transition">
                    <td className="p-4 font-mono font-bold text-slate-600">
                      {req.requestId}
                      <div className="text-[10px] text-slate-400 font-normal">
                        {req.location?.city}
                      </div>
                    </td>
                    <td className="p-4 max-w-sm">
                      <div className="text-[10px] uppercase font-bold text-teal-700">
                        {req.category}
                      </div>
                      <div className="font-bold text-slate-900 truncate">{req.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">
                        {req.description}
                      </div>
                    </td>
                    <td className="p-4">
                      <PriorityBadge priority={req.priority} />
                    </td>
                    <td className="p-4">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="p-4">
                      {req.assignedVolunteer ? (
                        <div className="font-semibold text-slate-800">
                          {req.assignedVolunteer.name}
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">None</span>
                      )}
                    </td>
                    <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                      {req.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(req._id, 'Verified')}
                            className="px-2.5 py-1 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-[11px] transition"
                          >
                            Verify
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(req._id, 'Rejected')}
                            className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-[11px] transition"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {['Pending', 'Verified'].includes(req.status) && (
                        <button
                          onClick={() => handleOpenMatchingModal(req)}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] transition inline-flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3 text-teal-400" />
                          Match Volunteer
                        </button>
                      )}

                      {['Volunteer Assigned', 'In Progress'].includes(req.status) && (
                        <button
                          onClick={() => handleUpdateStatus(req._id, 'Completed')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition"
                        >
                          Mark Completed
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Volunteer Matching Recommendation Modal */}
      {matchingRequest && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-teal-600">
                    {matchingRequest.requestId}
                  </span>
                  <span className="text-xs uppercase font-bold text-slate-400">
                    • {matchingRequest.category}
                  </span>
                </div>
                <h3 className="font-bold text-base text-slate-900 mt-1">
                  Algorithmic Volunteer Recommendations
                </h3>
              </div>
              <button
                onClick={() => setMatchingRequest(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
              Target Incident: <strong>{matchingRequest.title}</strong> at{' '}
              <strong>{matchingRequest.location?.city}</strong>. Scored on skill match, distance, availability, and category alignment.
            </div>

            {loadingRecs ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                Running matching algorithm across verified volunteers...
              </div>
            ) : recommendations.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No matching verified volunteers currently available in this sector.
              </div>
            ) : (
              <div className="space-y-3">
                {recommendations.map((rec, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200 hover:border-teal-400 transition flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">
                          {rec.volunteer?.user?.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 font-extrabold text-[11px] border border-teal-200">
                          Match Score: {rec.score}%
                        </span>
                        <span className="text-xs text-slate-400">
                          (~{rec.distanceKm} km away)
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-1">
                        {rec.matchReasons.map((m, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded"
                          >
                            ✓ {m}
                          </span>
                        ))}
                      </div>

                      <div className="text-[11px] text-slate-500">
                        Skills: {rec.volunteer?.skills?.join(', ')} • Completed:{' '}
                        {rec.volunteer?.completedTasksCount || 0}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAssignVolunteer(rec.volunteer?.user?._id)}
                      disabled={assigningId === rec.volunteer?.user?._id}
                      className="px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shrink-0 transition"
                    >
                      {assigningId === rec.volunteer?.user?._id ? 'Assigning...' : 'Assign'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
