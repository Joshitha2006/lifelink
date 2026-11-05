import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import {
  Clock,
  PlusCircle,
  MessageSquare,
  UserCheck,
  Trash2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';

export const MyRequestsPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedRequest, setSelectedRequest] = useState(null);

  const fetchMyRequests = async () => {
    try {
      const res = await api.get('/requests/my');
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
    fetchMyRequests();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to cancel and delete this request?')) return;
    try {
      await api.delete(`/requests/${id}`);
      setRequests((prev) => prev.filter((r) => r._id !== id));
      if (selectedRequest?._id === id) setSelectedRequest(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete request');
    }
  };

  const filteredRequests = requests.filter((r) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') return ['Pending', 'Verified', 'Volunteer Assigned', 'In Progress'].includes(r.status);
    if (activeFilter === 'completed') return r.status === 'Completed';
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            My Help Requests History
          </h1>
          <p className="text-xs text-slate-500">
            Monitor real-time triage, assigned volunteers, and operational updates
          </p>
        </div>
        <Link
          to="/citizen/create-request"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          New Help Request
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            activeFilter === 'all'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Requests ({requests.length})
        </button>
        <button
          onClick={() => setActiveFilter('active')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            activeFilter === 'active'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Active / In Progress (
          {
            requests.filter((r) =>
              ['Pending', 'Verified', 'Volunteer Assigned', 'In Progress'].includes(r.status)
            ).length
          }
          )
        </button>
        <button
          onClick={() => setActiveFilter('completed')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            activeFilter === 'completed'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Completed ({requests.filter((r) => r.status === 'Completed').length})
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading requests history...</div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-slate-700 text-sm">No Requests Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            You currently have no requests matching this filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Requests List */}
          <div className="lg:col-span-2 space-y-4">
            {filteredRequests.map((req) => (
              <div
                key={req._id}
                onClick={() => setSelectedRequest(req)}
                className={`bg-white rounded-2xl border p-5 shadow-sm cursor-pointer transition ${
                  selectedRequest?._id === req._id
                    ? 'border-teal-500 ring-2 ring-teal-500/20'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-slate-500">
                      {req.requestId}
                    </span>
                    <PriorityBadge priority={req.priority} />
                    <StatusBadge status={req.status} />
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900">{req.title}</h3>
                <p className="text-xs text-slate-600 mt-1 line-clamp-2">{req.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-slate-500">
                    Category: <strong className="text-slate-700">{req.category}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    {req.status === 'Pending' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(req._id);
                        }}
                        className="p-1.5 rounded text-rose-500 hover:bg-rose-50 transition"
                        title="Cancel Request"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <span className="text-teal-600 font-bold flex items-center gap-1">
                      View Timeline <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Details / Timeline Card */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5 h-fit sticky top-24">
            {selectedRequest ? (
              <>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-teal-600">
                      {selectedRequest.requestId}
                    </span>
                    <StatusBadge status={selectedRequest.status} />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mt-2">
                    {selectedRequest.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    {selectedRequest.description}
                  </p>
                </div>

                {/* Assigned Volunteer Card */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase">
                    <UserCheck className="w-4 h-4 text-teal-600" />
                    Assigned Volunteer
                  </div>
                  {selectedRequest.assignedVolunteer ? (
                    <div>
                      <p className="font-bold text-sm text-slate-900">
                        {selectedRequest.assignedVolunteer.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        Phone: {selectedRequest.assignedVolunteer.phone || 'Protected Contact'}
                      </p>
                      <p className="text-xs text-slate-500">
                        City: {selectedRequest.assignedVolunteer.city}
                      </p>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">
                      Awaiting coordinator verification or volunteer pickup.
                    </p>
                  )}
                </div>

                {/* Progress Notes Timeline */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-indigo-500" />
                    Operational Log & Updates
                  </h4>

                  <div className="space-y-3">
                    {selectedRequest.progressNotes && selectedRequest.progressNotes.length > 0 ? (
                      selectedRequest.progressNotes.map((pn, i) => (
                        <div key={i} className="border-l-2 border-teal-500 pl-3 py-1">
                          <p className="text-xs font-semibold text-slate-800">{pn.note}</p>
                          <span className="text-[10px] text-slate-400">
                            {new Date(pn.updatedAt).toLocaleString()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">
                        No progress notes posted yet.
                      </p>
                    )}
                  </div>
                </div>

                {/* Location Details */}
                <div className="pt-3 border-t border-slate-100 text-xs text-slate-500">
                  <p>
                    <strong>Area:</strong> {selectedRequest.location?.city}
                  </p>
                  <p className="mt-0.5">
                    <strong>Coordinates:</strong>{' '}
                    {selectedRequest.location?.lat?.toFixed(4)},{' '}
                    {selectedRequest.location?.lng?.toFixed(4)}
                  </p>
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-slate-400">
                <ShieldCheck className="w-10 h-10 mx-auto text-slate-300 mb-2" />
                <p className="text-xs">Click on any request on the left to inspect its live timeline and responder notes.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
