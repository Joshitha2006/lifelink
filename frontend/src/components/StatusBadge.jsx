import React from 'react';

export const StatusBadge = ({ status }) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Verified':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'Volunteer Assigned':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'In Progress':
        return 'bg-indigo-100 text-indigo-800 border-indigo-300 animate-pulse';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'Available':
        return 'bg-teal-100 text-teal-800 border-teal-300';
      case 'Claimed':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Active':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getBadgeStyle()}`}
    >
      <span className="w-1.5 h-1.5 mr-1.5 rounded-full bg-current"></span>
      {status}
    </span>
  );
};

export const PriorityBadge = ({ priority }) => {
  const getStyle = () => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-600 text-white animate-bounce';
      case 'High':
        return 'bg-orange-500 text-white';
      case 'Medium':
        return 'bg-amber-500 text-white';
      case 'Low':
        return 'bg-emerald-600 text-white';
      default:
        return 'bg-slate-600 text-white';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${getStyle()}`}
    >
      {priority}
    </span>
  );
};
