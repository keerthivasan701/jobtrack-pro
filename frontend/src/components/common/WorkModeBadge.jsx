import React from 'react';
import { WORK_MODE_CONFIG } from '../../utils/formatters';

const WorkModeBadge = ({ mode }) => {
  const config = WORK_MODE_CONFIG[mode] || { bg: 'bg-slate-50 text-slate-700 border-slate-200' };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${config.bg}`}
    >
      {mode || 'Remote'}
    </span>
  );
};

export default WorkModeBadge;
