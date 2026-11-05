import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  Droplet,
  PlusCircle,
  Shield,
  Heart,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Hospital,
  MapPin,
  Check,
  AlertCircle,
  X,
  Lock,
} from 'lucide-react';
import { StatusBadge, PriorityBadge } from '../components/StatusBadge';

export const BloodDonationPage = () => {
  const { user, updateUser } = useAuth();

  const [bloodRequests, setBloodRequests] = useState([]);
  const [registeredDonors, setRegisteredDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState('all');

  // Blood Request Modal
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [newRequest, setNewRequest] = useState({
    patientName: '',
    bloodGroup: 'O-',
    unitsNeeded: 1,
    hospitalName: '',
    city: 'Metropolis Central',
    urgency: 'Immediate',
    contactPerson: '',
    contactPhone: '',
    additionalNotes: '',
  });

  const [isDonorToggling, setIsDonorToggling] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  const bloodGroups = ['all', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const fetchBloodData = async () => {
    try {
      const url =
        selectedGroup === 'all'
          ? '/blood-donations'
          : `/blood-donations?bloodGroup=${encodeURIComponent(selectedGroup)}`;

      const [reqRes, donorRes] = await Promise.all([
        api.get(url),
        user ? api.get(`/blood-donations/donors${selectedGroup !== 'all' ? `?bloodGroup=${selectedGroup}` : ''}`) : Promise.resolve({ data: { data: [] } }),
      ]);

      if (reqRes.data.success) {
        setBloodRequests(reqRes.data.data);
      }
      if (donorRes.data.success) {
        setRegisteredDonors(donorRes.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBloodData();
  }, [selectedGroup, user]);

  const handleToggleDonorStatus = async () => {
    if (!user) return;
    setIsDonorToggling(true);
    setActionError('');
    try {
      const nextStatus = !user.isBloodDonor;
      const res = await api.put('/auth/profile', {
        isBloodDonor: nextStatus,
        bloodGroup: user.bloodGroup || 'O+',
      });
      if (res.data.success) {
        updateUser(res.data.user);
        setActionSuccess(
          nextStatus
            ? 'Thank you! You are now registered in the LifeLink Voluntary Donor Registry.'
            : 'You have toggled off active blood donor alerts.'
        );
        await fetchBloodData();
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to update donor status');
    } finally {
      setIsDonorToggling(false);
    }
  };

  const handleCreateBloodRequest = async (e) => {
    e.preventDefault();
    setActionError('');
    try {
      const res = await api.post('/blood-donations', newRequest);
      if (res.data.success) {
        setShowRequestModal(false);
        setActionSuccess('Emergency Blood Request registered! LifeLink coordinates matching donors.');
        setNewRequest({
          patientName: '',
          bloodGroup: 'O-',
          unitsNeeded: 1,
          hospitalName: '',
          city: 'Metropolis Central',
          urgency: 'Immediate',
          contactPerson: '',
          contactPhone: '',
          additionalNotes: '',
        });
        await fetchBloodData();
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to submit blood request');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header & Donor Registration Card */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 text-xs font-bold border border-rose-200 mb-1">
            <Droplet className="w-3.5 h-3.5" />
            Emergency Blood Coordination
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Urgent Blood Donation Coordination
          </h1>
          <p className="text-xs text-slate-500">
            Rapid matching of certified volunteer donors with verified hospital requirements.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {user && (
            <button
              onClick={handleToggleDonorStatus}
              disabled={isDonorToggling}
              className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition shadow-sm ${
                user.isBloodDonor
                  ? 'bg-rose-100 text-rose-800 border border-rose-300 hover:bg-rose-200'
                  : 'bg-rose-600 hover:bg-rose-500 text-white'
              }`}
            >
              <Heart className="w-4 h-4 fill-current" />
              {user.isBloodDonor
                ? `Registered Donor (${user.bloodGroup || 'Active'})`
                : 'Register as Blood Donor'}
            </button>
          )}

          <button
            onClick={() => setShowRequestModal(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition shadow"
          >
            <PlusCircle className="w-4 h-4 text-teal-400" />
            Submit Blood Request
          </button>
        </div>
      </div>

      {/* Mandatory Regulatory Disclaimer */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 flex items-start gap-3">
        <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs leading-relaxed">
          <strong>LEGAL & CLINICAL DISCLAIMER:</strong> LifeLink coordinates emergency volunteer donor availability and alerts eligible matched citizens. LifeLink is <strong>not</strong> a certified blood bank or hospital and does not collect or process blood. All blood transfusions, serological screening, and medical testing must occur exclusively through registered healthcare facilities.
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{actionSuccess}</span>
          </div>
          <button onClick={() => setActionSuccess('')}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {actionError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError('')}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Blood Group Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
        <span className="text-xs font-bold text-slate-500 mr-2">Filter by Blood Group:</span>
        {bloodGroups.map((bg) => (
          <button
            key={bg}
            onClick={() => setSelectedGroup(bg)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              selectedGroup === bg
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {bg === 'all' ? 'All Blood Groups' : bg}
          </button>
        ))}
      </div>

      {/* Main Grid: Blood Requests & Registered Donors */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Urgent Blood Requests */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">
              Active Hospital Blood Requests ({bloodRequests.length})
            </h3>
            <span className="text-xs text-slate-400">Sorted by urgency</span>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400">Loading blood requests...</div>
          ) : bloodRequests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <h3 className="font-bold text-slate-800 text-sm">No Active Blood Requests</h3>
              <p className="text-xs text-slate-500 mt-1">
                There are currently no active blood donor shortages matching this group.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bloodRequests.map((req) => (
                <div
                  key={req._id}
                  className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-rose-400 transition space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-extrabold text-sm tracking-wide shadow-sm">
                        {req.bloodGroup}
                      </span>
                      <PriorityBadge priority={req.urgency === 'Immediate' ? 'Critical' : 'High'} />
                      <StatusBadge status={req.status} />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Units Needed: <strong className="text-slate-900">{req.unitsNeeded} unit(s)</strong>
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-base text-slate-900">{req.patientName}</h4>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                      <Hospital className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>{req.hospitalName}</span>
                    </div>
                    {req.additionalNotes && (
                      <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        "{req.additionalNotes}"
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-orange-500" />
                      <span>{req.hospitalAddress?.city}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-slate-700 font-semibold flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-teal-600" />
                        <span>{req.contactPerson}: {req.contactPhone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Voluntary Donors Registry Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4 h-fit">
          <div className="border-b border-slate-100 pb-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">Voluntary Donors Registry</h3>
              <span className="text-[10px] uppercase font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                Verified Ready
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Privacy Protected: Exact phone numbers are never publicly broadcast.
            </p>
          </div>

          <div className="space-y-3">
            {registeredDonors.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No registered donors visible. Sign in to view coordination counts.
              </div>
            ) : (
              registeredDonors.slice(0, 6).map((donor, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-800">{donor.name}</p>
                    <p className="text-[10px] text-slate-400">{donor.city}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-extrabold text-xs">
                    {donor.bloodGroup}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 flex items-center gap-1">
            <Lock className="w-3 h-3 text-slate-400" /> LifeLink End-to-End Privacy Shield Active
          </div>
        </div>
      </div>

      {/* Modal: Submit Blood Request */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Submit Emergency Blood Request</h3>
              <button onClick={() => setShowRequestModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBloodRequest} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Blood Group *
                  </label>
                  <select
                    value={newRequest.bloodGroup}
                    onChange={(e) => setNewRequest({ ...newRequest, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    {bloodGroups.filter((b) => b !== 'all').map((bg) => (
                      <option key={bg} value={bg}>
                        {bg}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Units Needed *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    required
                    value={newRequest.unitsNeeded}
                    onChange={(e) => setNewRequest({ ...newRequest, unitsNeeded: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Patient Identifier / Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Patient #ICU-902 or initials"
                  value={newRequest.patientName}
                  onChange={(e) => setNewRequest({ ...newRequest, patientName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Hospital / Clinic Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Metropolis General Hospital"
                    value={newRequest.hospitalName}
                    onChange={(e) => setNewRequest({ ...newRequest, hospitalName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    City / Sector *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Metropolis Central"
                    value={newRequest.city}
                    onChange={(e) => setNewRequest({ ...newRequest, city: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Contact Coordinator *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Hayes / In-Charge"
                    value={newRequest.contactPerson}
                    onChange={(e) => setNewRequest({ ...newRequest, contactPerson: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Direct Phone Number *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. +1 555-BLOOD-01"
                    value={newRequest.contactPhone}
                    onChange={(e) => setNewRequest({ ...newRequest, contactPhone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Urgency Level *
                </label>
                <select
                  value={newRequest.urgency}
                  onChange={(e) => setNewRequest({ ...newRequest, urgency: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Immediate">🔴 Immediate (Needed in 1-2 hours)</option>
                  <option value="Urgent">🟠 Urgent (Needed within 12 hours)</option>
                  <option value="Normal">🟡 Normal (Scheduled Surgery / Maintenance)</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowRequestModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
