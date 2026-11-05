import React from 'react';
import { HeartHandshake, Shield, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#0b132b] border-t border-slate-800 text-slate-400 text-xs py-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Brand & Purpose */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <HeartHandshake className="w-5 h-5 text-teal-400" />
            <span className="font-bold text-white text-base">LIFELINK</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
            Connecting People, Help and Resources When Every Second Matters. A real-time MERN Stack Community Emergency Support System.
          </p>
        </div>

        {/* Training Team Credits */}
        <div className="text-center md:text-left border-y md:border-y-0 md:border-x border-slate-800 py-4 md:py-0 md:px-6">
          <div className="font-semibold text-slate-200 mb-1 flex items-center justify-center md:justify-start gap-1">
            <Shield className="w-3.5 h-3.5 text-teal-400" />
            MERN Stack Training Project Team
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Developed by a Team of 3 Members:
            <br />
            <strong>1. Lead Full-Stack Architect</strong>
            <br />
            <strong>2. Backend & Database Engineer</strong>
            <br />
            <strong>3. Frontend & UI/UX Specialist</strong>
          </p>
        </div>

        {/* Disclaimer */}
        <div className="text-right md:text-right">
          <span className="inline-block px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 text-[10px] font-bold border border-orange-500/30 mb-1.5">
            LEGAL DISCLAIMER
          </span>
          <p className="text-[11px] text-slate-400 leading-normal">
            LifeLink coordinates volunteer community assistance and blood donor connections. It does not replace 911/112 municipal emergency dispatch or hospital blood banks.
          </p>
          <p className="text-[10px] text-slate-500 mt-2">
            &copy; {new Date().getFullYear()} LifeLink Platform. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
