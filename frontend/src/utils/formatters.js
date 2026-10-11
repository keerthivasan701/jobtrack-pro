export const formatDate = (dateString, includeTime = false) => {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    };
    
    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
    }
    
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } catch {
    return dateString;
  }
};

export const getRelativeDays = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  
  if (diffTime === 0) return 'Today';
  if (diffTime === 1) return 'Yesterday';
  if (diffTime > 1) return `${diffTime} days ago`;
  if (diffTime === -1) return 'Tomorrow';
  if (diffTime < -1) return `In ${Math.abs(diffTime)} days`;
  return '';
};

export const STATUS_CONFIG = {
  Wishlist: {
    label: 'Wishlist',
    bg: 'bg-slate-100',
    text: 'text-slate-700',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
    badge: 'bg-slate-50 text-slate-700 border-slate-200',
  },
  Applied: {
    label: 'Applied',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  Assessment: {
    label: 'Assessment',
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    border: 'border-purple-200',
    dot: 'bg-purple-500',
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  Interview: {
    label: 'Interview',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  Offer: {
    label: 'Offer',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  Rejected: {
    label: 'Rejected',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    border: 'border-rose-200',
    dot: 'bg-rose-500',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
  },
};

export const WORK_MODE_CONFIG = {
  Remote: { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  Hybrid: { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  'On-site': { bg: 'bg-amber-50 text-amber-700 border-amber-200' },
};
