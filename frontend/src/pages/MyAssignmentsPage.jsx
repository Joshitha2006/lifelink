import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Check,
  Send,
  AlertCircle,
  MapPin,
  Phone,
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';

export const MyAssignmentsPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [newNote, setNewNote] = useState('');
  const [submittingNote, setSubmittingNote] = useState(false);
  const [completingId, setCompletingId] = useState(null);

  const fetchAssignments = async () => {
    try {
      const res = await api.get('/assignments/my');
      if (res.data.success) {
        setAssignments(res.data.data);
        if (res.data.data.length > 0 && !selectedAssignment) {
          setSelectedAssignment(res.data.data[0]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleAccept = async (assignmentId) => {
    try {
      await api.post(`/assignments/${assignmentId}/accept`);
      await fetchAssignments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept assignment');
    }
  };

  const handleDecline = async (assignmentId) => {
    const reason = prompt('Please specify reason for declining:');
    if (reason === null) return;
    try {
      await api.post(`/assignments/${assignmentId}/decline`, { reason });
      await fetchAssignments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to decline assignment');
    }
  };

  const handleCompleteTask = async (assignmentId) => {
    const notes = prompt('Enter completion report / handover notes:');
    if (notes === null) return;

    setCompletingId(assignmentId);
    try {
      await api.post(`/assignments/${assignmentId}/complete`, {
        completionNotes: notes || 'Assistance successfully delivered.',
      });
      await fetchAssignments();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete task');
    } finally {
      setCompletingId(null);
    }
  };

  const handleAddProgressNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedAssignment?.request?._id) return;

    setSubmittingNote(true);
    try {
      const res = await api.post(`/requests/${selectedAssignment.request._id}/progress`, {
        note: newNote,
      });
      if (res.data.success) {
        setNewNote('');
        await fetchAssignments();
        // Update local selection
        setSelectedAssignment((prev) => ({
          ...prev,
          request: res.data.data,
        }));
      }
    } catch (err) {
      alert('Failed to post progress note');
    } finally {
      setSubmittingNote(false);
    }
  };

  const filteredAssignments = assignments.filter((a) => {
    if (activeTab === 'active') return ['Offered', 'Accepted', 'In Progress'].includes(a.status);
    if (activeTab === 'completed') return a.status === 'Completed';
    return true;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          My Volunteer Assignments
        </h1>
        <p className="text-xs text-slate-500">
          Coordinate on-site emergency assistance, report real-time progress, and mark tasks completed.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            activeTab === 'active'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Active Tasks ({assignments.filter((a) => ['Offered', 'Accepted', 'In Progress'].includes(a.status)).length})
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
            activeTab === 'completed'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Completed History ({assignments.filter((a) => a.status === 'Completed').length})
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading assignments...</div>
      ) : filteredAssignments.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <CheckSquare className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-slate-700 text-sm">No Assignments In This View</h3>
          <p className="text-xs text-slate-500 mt-1">
            Browse available requests to accept new community missions!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List of assignments */}
          <div className="lg:col-span-2 space-y-4">
            {filteredAssignments.map((a) => {
              const req = a.request;
              if (!req) return null;
              return (
                <div
                  key={a._id}
                  onClick={() => setSelectedAssignment(a)}
                  className={`bg-white rounded-2xl border p-5 shadow-sm cursor-pointer transition ${
                    selectedAssignment?._id === a._id
                      ? 'border-teal-500 ring-2 ring-teal-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-400">
                        {req.requestId}
                      </span>
                      <PriorityBadge priority={req.priority} />
                      <StatusBadge status={a.status} />
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {new Date(a.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900">{req.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">{req.description}</p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="text-slate-500 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-orange-500" />
                      <span>{req.location?.city}</span>
                    </div>

                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      {a.status === 'Offered' && (
                        <>
                          <button
                            onClick={() => handleAccept(a._id)}
                            className="px-3 py-1.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition"
                          >
                            <Check className="w-3.5 h-3.5" /> Accept
                          </button>
                          <button
                            onClick={() => handleDecline(a._id)}
                            className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1 transition"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Decline
                          </button>
                        </>
                      )}

                      {['Accepted', 'In Progress'].includes(a.status) && (
                        <button
                          onClick={() => handleCompleteTask(a._id)}
                          disabled={completingId === a._id}
                          className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition shadow"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Mark Completed
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Detail Panel: Citizen Contact, Progress Notes */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-5 h-fit sticky top-24">
            {selectedAssignment?.request ? (
              <>
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-teal-600">
                      {selectedAssignment.request.requestId}
                    </span>
                    <StatusBadge status={selectedAssignment.status} />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mt-2">
                    {selectedAssignment.request.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    {selectedAssignment.request.description}
                  </p>
                </div>

                {/* Requester Contact */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    Citizen In Need
                  </span>
                  <p className="font-bold text-sm text-slate-900">
                    {selectedAssignment.request.user?.name || 'Citizen'}
                  </p>
                  <p className="text-xs text-slate-600 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-teal-600" />
                    <span>{selectedAssignment.request.user?.phone || 'Provided via LifeLink coordination'}</span>
                  </p>
                  <p className="text-xs text-slate-500">
                    Location: {selectedAssignment.request.location?.city}
                  </p>
                </div>

                {/* Post Progress Note Form */}
                {selectedAssignment.status !== 'Completed' && (
                  <form onSubmit={handleAddProgressNote} className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Post Progress Update to Citizen
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="e.g. En route to scene, arriving in 10 mins"
                        className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                      />
                      <button
                        type="submit"
                        disabled={submittingNote || !newNote.trim()}
                        className="p-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold transition disabled:opacity-50"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </form>
                )}

                {/* Timeline Log */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                    Updates Log
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedAssignment.request.progressNotes &&
                    selectedAssignment.request.progressNotes.length > 0 ? (
                      selectedAssignment.request.progressNotes.map((pn, i) => (
                        <div key={i} className="border-l-2 border-teal-500 pl-2.5 py-1 text-xs">
                          <p className="font-semibold text-slate-800">{pn.note}</p>
                          <span className="text-[10px] text-slate-400">
                            {new Date(pn.updatedAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">No notes posted yet.</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                Select an assignment on the left to review details and post progress updates.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
