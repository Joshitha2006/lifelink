import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import {
  MapPin,
  Building2,
  AlertTriangle,
  Package,
  Layers,
  ShieldCheck,
  Filter,
} from 'lucide-react';
import { MapViewer } from '../components/MapViewer';

export const CommunityMapPage = () => {
  const [requests, setRequests] = useState([]);
  const [supportCenters, setSupportCenters] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Layer filters
  const [showRequests, setShowRequests] = useState(true);
  const [showCenters, setShowCenters] = useState(true);
  const [showDonations, setShowDonations] = useState(true);
  const [selectedCity, setSelectedCity] = useState('all');

  useEffect(() => {
    const fetchMapEntities = async () => {
      try {
        const [reqRes, centerRes, donRes] = await Promise.all([
          api.get('/requests?status=all'),
          api.get('/support-centers'),
          api.get('/donations'),
        ]);

        if (reqRes.data.success) setRequests(reqRes.data.data);
        if (centerRes.data.success) setSupportCenters(centerRes.data.data);
        if (donRes.data.success) setDonations(donRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMapEntities();
  }, []);

  const cities = ['all', 'Metropolis Central', 'North Hills', 'West Valley', 'East Riverview', 'South Gateway'];

  const filteredRequests = requests.filter((r) => {
    if (!showRequests) return false;
    if (selectedCity === 'all') return true;
    return r.location?.city?.toLowerCase() === selectedCity.toLowerCase();
  });

  const filteredCenters = supportCenters.filter((c) => {
    if (!showCenters) return false;
    if (selectedCity === 'all') return true;
    return c.city?.toLowerCase() === selectedCity.toLowerCase();
  });

  const filteredDonations = donations.filter((d) => {
    if (!showDonations) return false;
    if (selectedCity === 'all') return true;
    return d.pickupLocation?.city?.toLowerCase() === selectedCity.toLowerCase();
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold border border-teal-200 mb-1">
            <MapPin className="w-3.5 h-3.5" />
            Geospatial Triage Map
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Community Emergency & Resource Map
          </h1>
          <p className="text-xs text-slate-500">
            OpenStreetMap live coordination layers with privacy-safe geolocation pinning.
          </p>
        </div>

        {/* Sector Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {cities.map((ct) => (
              <option key={ct} value={ct}>
                {ct === 'all' ? 'All Metropolitan Sectors' : ct}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Map Control Toggle Bar */}
      <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">
            Toggle Map Layers:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setShowRequests(!showRequests)}
            className={`px-3 py-1.5 rounded-lg font-semibold border transition flex items-center gap-1.5 ${
              showRequests
                ? 'bg-rose-50 border-rose-300 text-rose-800'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            Emergency Requests ({filteredRequests.length})
          </button>

          <button
            type="button"
            onClick={() => setShowCenters(!showCenters)}
            className={`px-3 py-1.5 rounded-lg font-semibold border transition flex items-center gap-1.5 ${
              showCenters
                ? 'bg-teal-50 border-teal-300 text-teal-800'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
            Support Centers & Shelters ({filteredCenters.length})
          </button>

          <button
            type="button"
            onClick={() => setShowDonations(!showDonations)}
            className={`px-3 py-1.5 rounded-lg font-semibold border transition flex items-center gap-1.5 ${
              showDonations
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-slate-50 border-slate-200 text-slate-400'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            Resource Supplies ({filteredDonations.length})
          </button>
        </div>

        <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> Privacy Protected
        </div>
      </div>

      {/* Main Map Component */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-2">
        <MapViewer
          height="600px"
          requests={filteredRequests}
          supportCenters={filteredCenters}
          donations={filteredDonations}
        />
      </div>

      {/* Legend & Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-1 text-xs font-bold text-slate-800">
            <span className="w-3 h-3 rounded-full bg-rose-600 inline-block" />
            Red / Orange / Blue Pins
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Help Requests with priority levels (Critical: Red, High: Orange, Medium: Yellow, Low: Blue). Click any pin for incident summary.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-1 text-xs font-bold text-slate-800">
            <span className="w-3 h-3 rounded-full bg-teal-600 inline-block" />
            Teal 'H' Pins
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Active Community Relief Camps, Medical Centers, and Emergency Shelters with operational hours, bed occupancy, and stockpiled provisions.
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 mb-1 text-xs font-bold text-slate-800">
            <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" />
            Green 'D' Pins
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Available community donations ready for pickup: dry rations, cold-weather apparel, and medical first-aid trauma kits.
          </p>
        </div>
      </div>
    </div>
  );
};
