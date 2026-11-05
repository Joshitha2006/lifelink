import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import {
  AlertTriangle,
  PlusCircle,
  Upload,
  Check,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
} from 'lucide-react';
import { LocationPicker } from '../components/LocationPicker';

export const CreateHelpRequestPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category: 'Medical assistance coordination',
    title: '',
    description: '',
    priority: 'High',
    address: '',
    city: 'Metropolis Central',
    lat: 28.6139,
    lng: 77.2090,
    imageUrl: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const categories = [
    'Medical assistance coordination',
    'Food and essential supplies',
    'Clothing donations',
    'Disaster relief support',
    'Road blockage reporting',
    'Elderly assistance',
    'General community support',
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationSelect = (lat, lng) => {
    setFormData((prev) => ({
      ...prev,
      lat,
      lng,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Please provide a title for your request.');
      return;
    }
    if (!formData.description.trim()) {
      setError('Please enter a clear description of the situation.');
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append('category', formData.category);
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('priority', formData.priority);
      data.append('address', formData.address || 'Local Sector');
      data.append('city', formData.city);
      data.append('lat', formData.lat);
      data.append('lng', formData.lng);

      if (imageFile) {
        data.append('image', imageFile);
      } else if (formData.imageUrl) {
        data.append('imageUrl', formData.imageUrl);
      }

      const res = await api.post('/requests', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/citizen/my-requests');
        }, 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit help request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Create Emergency Help Request
          </h1>
          <p className="text-xs text-slate-500">
            Submit critical incidents for triage, admin verification, and certified volunteer dispatch.
          </p>
        </div>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>
            Help request submitted successfully! Redirecting you to track updates...
          </span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        {/* Category & Priority */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Assistance Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Urgency Priority *
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleInputChange}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
            >
              <option value="Critical">🔴 Critical (Immediate Life / Safety Threat)</option>
              <option value="High">🟠 High (Urgent Medical / Sustenance Need)</option>
              <option value="Medium">🟡 Medium (Assistance Needed Today)</option>
              <option value="Low">🟢 Low (General Community Support)</option>
            </select>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Brief Request Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder="e.g. Urgent prescription medicine needed for stranded elder"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Detailed Situation Description *
          </label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleInputChange}
            required
            placeholder="Provide specific details about quantities needed, exact situation, accessibility constraints, etc."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          ></textarea>
        </div>

        {/* Location Section */}
        <div className="pt-2 border-t border-slate-100 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                City / Region *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                placeholder="e.g. Metropolis Central"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Neighborhood / Sector Details
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="e.g. Block C, near City Park"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <LocationPicker
            initialLat={formData.lat}
            initialLng={formData.lng}
            onLocationSelect={handleLocationSelect}
          />
        </div>

        {/* Photo Upload */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
            Upload Supporting Photograph (Optional)
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <label className="cursor-pointer border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-xl p-4 flex flex-col items-center justify-center w-full sm:w-1/2 text-center transition bg-slate-50/50">
              <Upload className="w-6 h-6 text-slate-400 mb-1" />
              <span className="text-xs font-semibold text-slate-700">
                {imageFile ? imageFile.name : 'Select photo from device'}
              </span>
              <span className="text-[10px] text-slate-400 mt-0.5">JPEG, PNG, WebP up to 5MB</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {imagePreview && (
              <div className="w-24 h-24 rounded-xl overflow-hidden border border-slate-200 shrink-0 relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Encrypted transmission & verified volunteer review</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-500/20 flex items-center gap-2 transition disabled:opacity-50"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <PlusCircle className="w-4 h-4" />
                Submit Emergency Request
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
