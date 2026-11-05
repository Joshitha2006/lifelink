import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import {
  HeartHandshake,
  AlertTriangle,
  Users,
  MapPin,
  Package,
  Droplet,
  ShieldCheck,
  ArrowRight,
  PhoneCall,
  Activity,
  Heart,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import { MapViewer } from '../components/MapViewer';

export const LandingPage = () => {
  const [stats, setStats] = useState({
    activeRequests: 4,
    volunteers: 6,
    resources: 12,
    bloodRequests: 3,
  });
  const [recentRequests, setRecentRequests] = useState([]);
  const [supportCenters, setSupportCenters] = useState([]);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const [reqRes, centerRes, donRes, bloodRes] = await Promise.all([
          api.get('/requests?status=all'),
          api.get('/support-centers'),
          api.get('/donations'),
          api.get('/blood-donations'),
        ]);

        if (reqRes.data.success) {
          setRecentRequests(reqRes.data.data.slice(0, 4));
          setStats((prev) => ({
            ...prev,
            activeRequests: reqRes.data.count,
          }));
        }
        if (centerRes.data.success) {
          setSupportCenters(centerRes.data.data);
        }
        if (donRes.data.success) {
          setStats((prev) => ({ ...prev, resources: donRes.data.count }));
        }
        if (bloodRes.data.success) {
          setStats((prev) => ({ ...prev, bloodRequests: bloodRes.data.count }));
        }
      } catch (err) {
        console.error('Failed to load landing data:', err);
      }
    };

    fetchLandingData();
  }, []);

  const categories = [
    { title: 'Medical Assistance', desc: 'Urgent prescriptions, first aid triage and emergency medicine delivery.', icon: Activity, color: 'from-rose-500 to-red-600' },
    { title: 'Food & Supplies', desc: 'Nutritious meals, potable water cans, and essential dry ration packages.', icon: Package, color: 'from-amber-500 to-orange-600' },
    { title: 'Disaster Relief', desc: 'Floods, severe storms, waterproof tarps, emergency blanket distribution.', icon: AlertTriangle, color: 'from-blue-600 to-indigo-700' },
    { title: 'Road Blockage Reporting', desc: 'Uprooted trees, fallen cables, and blocked ambulance evacuation corridors.', icon: Truck, color: 'from-slate-700 to-slate-900' },
    { title: 'Elderly Assistance', desc: 'Mobility support, grocery pick-ups, companionship, and urgent home care.', icon: Heart, color: 'from-teal-500 to-emerald-600' },
    { title: 'Blood Donation Coordination', desc: 'Connecting voluntary matched blood donors with urgent hospital requests.', icon: Droplet, color: 'from-rose-600 to-rose-700' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0b132b] via-[#101b3d] to-[#1c2541] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#06d6a0_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            {/* Live Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
              <span>LIFELINK COMMUNITY DISPATCH ACTIVE 24/7</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
              Connecting People, Help and Resources{' '}
              <span className="bg-gradient-to-r from-teal-300 via-emerald-400 to-cyan-300 bg-clip-text text-transparent">
                When Every Second Matters.
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed">
              LifeLink bridges community residents, dedicated certified volunteers, and relief distribution hubs in real-time. Transparent, role-based, privacy-first emergency coordination.
            </p>

            {/* Main Action CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <Link
                to="/citizen/create-request"
                className="px-6 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm tracking-wide shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 flex items-center gap-2 transform active:scale-95 transition"
              >
                <AlertTriangle className="w-4 h-4" />
                Request Emergency Help
              </Link>
              <Link
                to="/volunteer/available-requests"
                className="px-6 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 flex items-center gap-2 transform active:scale-95 transition"
              >
                <Users className="w-4 h-4" />
                Volunteer to Assist
              </Link>
              <Link
                to="/map"
                className="px-6 py-3.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 flex items-center gap-2 transition"
              >
                <MapPin className="w-4 h-4 text-teal-400" />
                Explore Community Map
              </Link>
            </div>
          </div>

          {/* Real-time stats card bar */}
          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/80 rounded-2xl p-5 text-center shadow-xl">
              <div className="text-3xl sm:text-4xl font-extrabold text-teal-400">
                {stats.activeRequests}
              </div>
              <div className="text-xs uppercase font-semibold text-slate-400 tracking-wider mt-1">
                Help Requests
              </div>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/80 rounded-2xl p-5 text-center shadow-xl">
              <div className="text-3xl sm:text-4xl font-extrabold text-orange-400">
                {stats.volunteers}
              </div>
              <div className="text-xs uppercase font-semibold text-slate-400 tracking-wider mt-1">
                Verified Volunteers
              </div>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/80 rounded-2xl p-5 text-center shadow-xl">
              <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400">
                {stats.resources}
              </div>
              <div className="text-xs uppercase font-semibold text-slate-400 tracking-wider mt-1">
                Resources Shared
              </div>
            </div>
            <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700/80 rounded-2xl p-5 text-center shadow-xl">
              <div className="text-3xl sm:text-4xl font-extrabold text-rose-400">
                {stats.bloodRequests}
              </div>
              <div className="text-xs uppercase font-semibold text-slate-400 tracking-wider mt-1">
                Active Blood Requests
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-teal-600 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Emergency Scope & Capabilities
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
            Comprehensive Community Assistance
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            LifeLink supports critical categories with automated volunteer skill recommendations and geo-proximity matching.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-teal-400/50 transition group flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white shadow-md mb-4 group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 group-hover:text-teal-700 transition">
                    {cat.title}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-600">
                  <span>Available on LifeLink</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Live Map Preview Section */}
      <section className="py-12 bg-slate-100 border-y border-slate-200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                Interactive Geospatial Engine
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
                Real-Time OpenStreetMap Integration
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm mt-1 max-w-xl">
                Visualize incident priorities, emergency relief camps, and volunteer coverage. Precise citizen locations are protected with privacy shields.
              </p>
            </div>
            <Link
              to="/map"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition"
            >
              <MapPin className="w-4 h-4 text-teal-400" />
              Open Fullscreen Community Map
            </Link>
          </div>

          <MapViewer
            height="460px"
            requests={recentRequests}
            supportCenters={supportCenters}
          />
        </div>
      </section>

      {/* Three User Roles Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Tailored Experiences For Every Role
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Seamless collaboration between affected citizens, verified volunteers, and system administrators.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Citizen */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg mb-4">
                A
              </div>
              <h3 className="font-bold text-lg text-slate-900">CITIZEN</h3>
              <p className="text-slate-500 text-xs font-medium uppercase mt-0.5">Community Resident</p>
              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Create detailed help requests with photos
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Pin approximate assistance location
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Track real-time status & volunteer notes
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Request available donation supplies
                </li>
              </ul>
            </div>
            <Link
              to="/citizen/dashboard"
              className="mt-6 w-full py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-center font-semibold text-xs transition"
            >
              Citizen Portal
            </Link>
          </div>

          {/* Volunteer */}
          <div className="bg-white rounded-2xl p-6 border-2 border-teal-500 shadow-md flex flex-col justify-between relative overflow-hidden">
            <span className="absolute top-0 right-0 bg-teal-500 text-slate-950 text-[10px] font-extrabold uppercase px-3 py-1 rounded-bl-lg">
              High Impact
            </span>
            <div>
              <div className="w-10 h-10 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-bold text-lg mb-4">
                B
              </div>
              <h3 className="font-bold text-lg text-slate-900">VOLUNTEER</h3>
              <p className="text-teal-600 text-xs font-semibold uppercase mt-0.5">First Responder</p>
              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Register skills, service areas & availability
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Browse nearby matching emergency requests
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Accept or decline assignments easily
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" /> Post progress notes & mark tasks completed
                </li>
              </ul>
            </div>
            <Link
              to="/volunteer/dashboard"
              className="mt-6 w-full py-2.5 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 text-center font-bold text-xs transition shadow-sm"
            >
              Volunteer Hub
            </Link>
          </div>

          {/* Admin */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-lg bg-orange-100 text-orange-700 flex items-center justify-center font-bold text-lg mb-4">
                C
              </div>
              <h3 className="font-bold text-lg text-slate-900">ADMIN</h3>
              <p className="text-orange-600 text-xs font-semibold uppercase mt-0.5">System Controller</p>
              <ul className="mt-4 space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-600" /> Verify citizens & approve volunteer profiles
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-600" /> Algorithm-assisted volunteer matching
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-600" /> Manage community relief support centers
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-orange-600" /> SaaS analytics, charts & monthly trends
                </li>
              </ul>
            </div>
            <Link
              to="/admin/dashboard"
              className="mt-6 w-full py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-center font-semibold text-xs transition"
            >
              Admin Console
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
