import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import {
  Package,
  PlusCircle,
  MapPin,
  Clock,
  CheckCircle2,
  Filter,
  Check,
  AlertCircle,
  X,
  Send,
  Boxes,
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';

export const ResourceSharingPage = () => {
  const { user } = useAuth();

  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // New Donation Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDonation, setNewDonation] = useState({
    title: '',
    category: 'Food',
    quantity: 10,
    unit: 'boxes',
    city: 'Metropolis Central',
    address: '',
    notes: '',
  });

  // Request Resource Modal
  const [selectedDonationForRequest, setSelectedDonationForRequest] = useState(null);
  const [reqQuantity, setReqQuantity] = useState(1);
  const [reqReason, setReqReason] = useState('');
  const [submittingRequest, setSubmittingRequest] = useState(false);

  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  const categories = ['all', 'Food', 'Clothes', 'Educational Materials', 'Essential Supplies', 'Other'];

  const fetchDonations = async () => {
    try {
      const url =
        selectedCategory === 'all'
          ? '/donations'
          : `/donations?category=${encodeURIComponent(selectedCategory)}`;
      const res = await api.get(url);
      if (res.data.success) {
        setDonations(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [selectedCategory]);

  const handleCreateDonation = async (e) => {
    e.preventDefault();
    setActionError('');
    try {
      const res = await api.post('/donations', newDonation);
      if (res.data.success) {
        setShowAddModal(false);
        setActionSuccess('Resource successfully listed! Thank you for supporting the community.');
        setNewDonation({
          title: '',
          category: 'Food',
          quantity: 10,
          unit: 'boxes',
          city: 'Metropolis Central',
          address: '',
          notes: '',
        });
        await fetchDonations();
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to list resource');
    }
  };

  const handleRequestResource = async (e) => {
    e.preventDefault();
    if (!selectedDonationForRequest) return;
    setSubmittingRequest(true);
    setActionError('');
    try {
      const res = await api.post(`/donations/${selectedDonationForRequest._id}/request`, {
        requestedQuantity: reqQuantity,
        reason: reqReason,
      });
      if (res.data.success) {
        setSelectedDonationForRequest(null);
        setActionSuccess('Resource request submitted to donor for fulfillment.');
        setReqReason('');
        setReqQuantity(1);
        await fetchDonations();
      }
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to request resource');
    } finally {
      setSubmittingRequest(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200 mb-1">
            <Package className="w-3.5 h-3.5" />
            Community Resource Stockpile
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Resource Sharing & Aid Stockpile
          </h1>
          <p className="text-xs text-slate-500">
            Share surplus food, clothes, emergency supplies, and educational materials with families in need.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Category Filter */}
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

          {user && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
            >
              <PlusCircle className="w-4 h-4" />
              List Donation / Resource
            </button>
          )}
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

      {loading ? (
        <div className="p-12 text-center text-slate-400">Loading resources...</div>
      ) : donations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <Boxes className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="font-bold text-slate-800 text-sm">No Resources In This Category</h3>
          <p className="text-xs text-slate-500 mt-1">Be the first to list a donation!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donations.map((d) => (
            <div
              key={d._id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-teal-500/50 p-6 shadow-sm transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {d.category}
                  </span>
                  <StatusBadge status={d.status} />
                </div>

                <h3 className="font-bold text-base text-slate-900 leading-snug">{d.title}</h3>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-baseline justify-between">
                  <span className="text-xs text-slate-500 font-medium">Available Quantity:</span>
                  <span className="text-base font-extrabold text-slate-900">
                    {d.quantity} <span className="text-xs font-semibold text-slate-500">{d.unit}</span>
                  </span>
                </div>

                {d.notes && (
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {d.notes}
                  </p>
                )}

                <div className="pt-2 flex items-center gap-1.5 text-xs text-slate-500 border-t border-slate-100">
                  <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span className="truncate">Pickup: {d.pickupLocation?.city}</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Donor: <strong>{d.donor?.name || 'Community Member'}</strong>
                </span>

                {user ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDonationForRequest(d);
                      setReqQuantity(1);
                    }}
                    disabled={d.status !== 'Available' || d.quantity <= 0}
                    className="px-3.5 py-1.5 rounded-lg bg-[#0b132b] hover:bg-slate-800 text-white font-bold text-xs transition disabled:opacity-40"
                  >
                    Request Items
                  </button>
                ) : (
                  <span className="text-[11px] text-teal-600 font-semibold">Sign in to request</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: List New Donation */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">List New Donation / Resource</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDonation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Item Title *
                </label>
                <input
                  type="text"
                  required
                  value={newDonation.title}
                  onChange={(e) => setNewDonation({ ...newDonation, title: e.target.value })}
                  placeholder="e.g. 20 Woolen Blankets, Sealed Canned Soups"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={newDonation.category}
                    onChange={(e) => setNewDonation({ ...newDonation, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    {categories.filter((c) => c !== 'all').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                    Quantity & Unit *
                  </label>
                  <div className="flex gap-1.5">
                    <input
                      type="number"
                      min="1"
                      required
                      value={newDonation.quantity}
                      onChange={(e) => setNewDonation({ ...newDonation, quantity: e.target.value })}
                      className="w-20 px-2 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <input
                      type="text"
                      placeholder="kits / units"
                      value={newDonation.unit}
                      onChange={(e) => setNewDonation({ ...newDonation, unit: e.target.value })}
                      className="flex-1 px-2 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Pickup City / Neighborhood *
                </label>
                <input
                  type="text"
                  required
                  value={newDonation.city}
                  onChange={(e) => setNewDonation({ ...newDonation, city: e.target.value })}
                  placeholder="e.g. Metropolis Central, Sector 2"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Additional Notes
                </label>
                <textarea
                  rows="2"
                  value={newDonation.notes}
                  onChange={(e) => setNewDonation({ ...newDonation, notes: e.target.value })}
                  placeholder="e.g. Cleaned, packed, ready for instant handover"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs"
                >
                  Confirm & List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Request Resource */}
      {selectedDonationForRequest && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Request Aid Supplies</h3>
              <button
                onClick={() => setSelectedDonationForRequest(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <p className="text-xs font-bold text-slate-800">{selectedDonationForRequest.title}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Available: {selectedDonationForRequest.quantity} {selectedDonationForRequest.unit}
              </p>
            </div>

            <form onSubmit={handleRequestResource} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Quantity Required *
                </label>
                <input
                  type="number"
                  min="1"
                  max={selectedDonationForRequest.quantity}
                  required
                  value={reqQuantity}
                  onChange={(e) => setReqQuantity(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                  Reason / Purpose for Request *
                </label>
                <textarea
                  rows="3"
                  required
                  value={reqReason}
                  onChange={(e) => setReqReason(e.target.value)}
                  placeholder="Describe where and how these resources will be distributed"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDonationForRequest(null)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingRequest}
                  className="px-4 py-2 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  {submittingRequest ? 'Submitting...' : 'Submit Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
