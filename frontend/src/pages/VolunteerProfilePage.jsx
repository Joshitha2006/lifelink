import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import {
  UserCheck,
  Check,
  AlertCircle,
  MapPin,
  Sparkles,
  Award,
  Save,
} from 'lucide-react';
import { LocationPicker } from '../components/LocationPicker';

export const VolunteerProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    skills: '',
    serviceCategories: [],
    serviceAreas: '',
    availabilityStatus: 'available',
    lat: 28.6139,
    lng: 77.2090,
    experienceNotes: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const allCategories = [
    'Medical assistance coordination',
    'Food and essential supplies',
    'Clothing donations',
    'Disaster relief support',
    'Road blockage reporting',
    'Elderly assistance',
    'General community support',
  ];

  const commonSkills = [
    'First Aid',
    'CPR Certified',
    'Paramedic',
    'Nurse (RN)',
    'Driving / 4x4 Vehicle',
    'Heavy Lifting',
    'Food Distribution',
    'Disaster Response',
    'Logistics & Dispatch',
    'Elderly Care',
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/volunteers/profile');
        if (res.data.success) {
          setProfile(res.data.data);
          const p = res.data.data;
          setFormData({
            skills: p.skills?.join(', ') || '',
            serviceCategories: p.serviceCategories || ['General Community Support'],
            serviceAreas: p.serviceAreas?.join(', ') || '',
            availabilityStatus: p.availabilityStatus || 'available',
            lat: p.lat || 28.6139,
            lng: p.lng || 77.2090,
            experienceNotes: p.experienceNotes || '',
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleToggleCategory = (cat) => {
    setFormData((prev) => {
      const exists = prev.serviceCategories.includes(cat);
      if (exists) {
        return {
          ...prev,
          serviceCategories: prev.serviceCategories.filter((c) => c !== cat),
        };
      } else {
        return {
          ...prev,
          serviceCategories: [...prev.serviceCategories, cat],
        };
      }
    });
  };

  const handleAddSkill = (skill) => {
    const current = formData.skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (!current.includes(skill)) {
      current.push(skill);
      setFormData((prev) => ({ ...prev, skills: current.join(', ') }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const payload = {
        skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
        serviceCategories: formData.serviceCategories,
        serviceAreas: formData.serviceAreas.split(',').map((s) => s.trim()).filter(Boolean),
        availabilityStatus: formData.availabilityStatus,
        lat: formData.lat,
        lng: formData.lng,
        experienceNotes: formData.experienceNotes,
      };

      const res = await api.put('/volunteers/profile', payload);
      if (res.data.success) {
        setMessage('Volunteer profile & matching preferences updated successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update volunteer profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading volunteer profile...</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Volunteer Responder Profile & Skills
          </h1>
          <p className="text-xs text-slate-500">
            Define your operational capabilities, service areas, and availability status.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {profile?.isApprovedByAdmin ? (
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300 flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Admin Verified
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300">
              Pending Admin Verification
            </span>
          )}
        </div>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Availability Status */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Current Operational Availability *
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { val: 'available', label: '🟢 Available to Respond', desc: 'Ready for alerts' },
              { val: 'busy', label: '🟡 Busy on Assignment', desc: 'Currently occupied' },
              { val: 'inactive', label: '⚪ Inactive / Off Duty', desc: 'No dispatch notifications' },
            ].map((st) => (
              <button
                type="button"
                key={st.val}
                onClick={() => setFormData({ ...formData, availabilityStatus: st.val })}
                className={`p-3 rounded-xl border text-left transition ${
                  formData.availabilityStatus === st.val
                    ? 'border-teal-500 bg-teal-50/50 ring-2 ring-teal-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold text-xs text-slate-900">{st.label}</div>
                <div className="text-[10px] text-slate-500 mt-0.5">{st.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Your Certified Skills & Training
          </label>
          <input
            type="text"
            value={formData.skills}
            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
            placeholder="e.g. First Aid, CPR, Heavy Lifting, Driving"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="text-[11px] text-slate-400 self-center mr-1">Quick Add:</span>
            {commonSkills.map((sk) => (
              <button
                type="button"
                key={sk}
                onClick={() => handleAddSkill(sk)}
                className="text-[11px] px-2 py-0.5 rounded-full bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 border border-slate-200 transition"
              >
                + {sk}
              </button>
            ))}
          </div>
        </div>

        {/* Service Categories */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Categories You Are Willing to Respond To *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {allCategories.map((cat) => {
              const selected = formData.serviceCategories.includes(cat);
              return (
                <div
                  key={cat}
                  onClick={() => handleToggleCategory(cat)}
                  className={`p-2.5 rounded-xl border cursor-pointer flex items-center justify-between text-xs font-semibold transition ${
                    selected
                      ? 'border-teal-500 bg-teal-50/60 text-teal-900'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{cat}</span>
                  {selected && <Check className="w-4 h-4 text-teal-600" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Service Areas */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Service Areas / Sectors (Comma separated)
          </label>
          <input
            type="text"
            value={formData.serviceAreas}
            onChange={(e) => setFormData({ ...formData, serviceAreas: e.target.value })}
            placeholder="e.g. Metropolis Central, North Hills, West Valley"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Location Coordinates for Matching */}
        <div className="pt-2 border-t border-slate-100">
          <LocationPicker
            initialLat={formData.lat}
            initialLng={formData.lng}
            onLocationSelect={(lat, lng) => setFormData({ ...formData, lat, lng })}
          />
        </div>

        {/* Experience Notes */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Experience Notes & Certifications
          </label>
          <textarea
            rows="3"
            value={formData.experienceNotes}
            onChange={(e) => setFormData({ ...formData, experienceNotes: e.target.value })}
            placeholder="e.g. 3 years volunteer firefighter, certified emergency medical responder, 4x4 recovery truck available."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition shadow disabled:opacity-50"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Profile Preferences
            </>
          )}
        </button>
      </form>
    </div>
  );
};
