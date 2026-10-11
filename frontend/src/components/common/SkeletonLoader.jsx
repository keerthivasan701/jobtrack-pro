import React from 'react';

export const StatCardSkeleton = () => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm animate-pulse space-y-3">
    <div className="flex items-center justify-between">
      <div className="h-4 bg-slate-200 rounded w-24"></div>
      <div className="h-10 w-10 bg-slate-200 rounded-xl"></div>
    </div>
    <div className="h-8 bg-slate-200 rounded w-16"></div>
    <div className="h-3 bg-slate-100 rounded w-32"></div>
  </div>
);

export const TableRowSkeleton = ({ columns = 5 }) => (
  <tr className="animate-pulse border-b border-slate-100">
    {Array.from({ length: columns }).map((_, i) => (
      <td key={i} className="py-4 px-4">
        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
      </td>
    ))}
  </tr>
);

export const CardSkeleton = () => (
  <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm animate-pulse space-y-4">
    <div className="flex items-center justify-between">
      <div className="h-5 bg-slate-200 rounded w-1/2"></div>
      <div className="h-6 w-16 bg-slate-200 rounded-full"></div>
    </div>
    <div className="h-4 bg-slate-100 rounded w-1/3"></div>
    <div className="space-y-2 pt-2">
      <div className="h-3 bg-slate-100 rounded w-full"></div>
      <div className="h-3 bg-slate-100 rounded w-4/5"></div>
    </div>
  </div>
);

export default {
  StatCardSkeleton,
  TableRowSkeleton,
  CardSkeleton,
};
