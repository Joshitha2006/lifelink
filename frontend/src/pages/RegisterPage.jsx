import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HeartHandshake, User, Heart, Shield, Lock, Mail, Phone, MapPin, AlertCircle, ArrowRight } from 'lucide-react';

export const RegisterPage = () => {
  const [role, setRole] = useState('citizen');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    city: 'Metropolis',
    address: '',
    skills: 'First Aid, Community Support',
    serviceAreas: 'Metropolis Central',
    bloodGroup: '',
    isBloodDonor: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        role,
        skills: formData.skills.split(',').map((s) => s.trim()),
        serviceAreas: formData.serviceAreas.split(',').map((s) => s.trim()),
      };

      const data = await register(payload);
      if (role === 'volunteer') navigate('/volunteer/dashboard');
      else navigate('/citizen/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-6">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-[#0b132b] flex items-center justify-center text-teal-400 shadow-lg">
            <HeartHandshake className="w-7 h-7 stroke-[2.2]" />
          </div>
          <h2 className="mt-4 text-2xl font-extrabold text-slate-900 tracking-tight">
            Join the LifeLink Network
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Emergency Community Support & Disaster Relief
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-200/80 rounded-xl">
          <button
            type="button"
            onClick={() => setRole('citizen')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition ${
              role === 'citizen'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4 text-teal-500" />
            Citizen (Resident)
          </button>
          <button
            type="button"
            onClick={() => setRole('volunteer')}
            className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition ${
              role === 'volunteer'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Heart className="w-4 h-4 text-orange-500" />
            Volunteer (Responder)
          </button>
        </div>

        <div className="bg-white py-8 px-6 shadow-md rounded-2xl border border-slate-200">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Jane Doe"
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="jane@example.com"
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Min 6 characters"
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  City / Region
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Metropolis Central"
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Approximate Area / Sector
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. Sector 4, North Block"
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* Volunteer specific fields */}
            {role === 'volunteer' && (
              <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-200/80 space-y-3">
                <span className="text-xs font-bold text-teal-900 uppercase tracking-wider block">
                  Volunteer Qualifications
                </span>
                <div>
                  <label className="block text-xs font-semibold text-teal-800">
                    Skills (Comma separated)
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="e.g. First Aid, CPR, Driving, Heavy Lifting"
                    className="mt-1 block w-full px-3 py-2 bg-white border border-teal-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-teal-800">
                    Preferred Service Areas
                  </label>
                  <input
                    type="text"
                    name="serviceAreas"
                    value={formData.serviceAreas}
                    onChange={handleChange}
                    placeholder="e.g. Metropolis Central, North Hills"
                    className="mt-1 block w-full px-3 py-2 bg-white border border-teal-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
            )}

            {/* Blood Donor Opt-in */}
            <div className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-200/80 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isBloodDonor"
                  name="isBloodDonor"
                  checked={formData.isBloodDonor}
                  onChange={handleChange}
                  className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500"
                />
                <label htmlFor="isBloodDonor" className="text-xs font-bold text-slate-800 cursor-pointer">
                  Register as a Voluntary Emergency Blood Donor
                </label>
              </div>

              {formData.isBloodDonor && (
                <div className="pt-2">
                  <label className="block text-[11px] font-bold uppercase text-slate-600 mb-1">
                    Select Blood Group
                  </label>
                  <select
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 bg-white border border-rose-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500"
                  >
                    <option value="">-- Choose Blood Group --</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-[#0b132b] hover:bg-slate-800 transition shadow disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-teal-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight className="w-4 h-4 text-teal-400" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
            Already registered?{' '}
            <Link to="/login" className="font-bold text-teal-600 hover:text-teal-700">
              Sign In here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
