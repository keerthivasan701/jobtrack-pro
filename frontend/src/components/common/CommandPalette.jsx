import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  LayoutDashboard,
  Briefcase,
  Kanban,
  Calendar,
  Settings,
  Plus,
  Download,
  LogOut,
  Building,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { applicationsApi } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import { exportApplicationsToCSV } from '../../utils/csvExport';
import StatusBadge from './StatusBadge';

const STATIC_ACTIONS = [
  { id: 'nav-dash', title: 'Go to Dashboard', category: 'Navigation', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'nav-apps', title: 'View All Applications', category: 'Navigation', icon: Briefcase, path: '/applications' },
  { id: 'nav-pipe', title: 'Open Kanban Pipeline', category: 'Navigation', icon: Kanban, path: '/pipeline' },
  { id: 'nav-cal', title: 'View Interview Calendar', category: 'Navigation', icon: Calendar, path: '/calendar' },
  { id: 'nav-set', title: 'Profile & Settings', category: 'Navigation', icon: Settings, path: '/settings' },
  { id: 'act-new', title: 'Add New Job Application', category: 'Quick Action', icon: Plus, action: 'quick-add' },
  { id: 'act-csv', title: 'Export Applications to CSV', category: 'Quick Action', icon: Download, action: 'export-csv' },
];

const CommandPalette = ({ isOpen, onClose, onOpenQuickAdd }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [apps, setApps] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);

      // Fetch brief application list for instant command search
      applicationsApi.allItems().then((res) => {
        setApps(res.data || []);
      }).catch(() => {});
    }
  }, [isOpen]);

  // Filter actions and matching applications
  const matchingActions = STATIC_ACTIONS.filter((act) =>
    act.title.toLowerCase().includes(query.toLowerCase())
  );

  const matchingApps = apps
    .filter(
      (app) =>
        app.company_name.toLowerCase().includes(query.toLowerCase()) ||
        app.job_title.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 5);

  const allItems = [
    ...matchingActions.map((a) => ({ ...a, type: 'action' })),
    ...matchingApps.map((app) => ({
      id: `app-${app.id}`,
      title: `${app.job_title} at ${app.company_name}`,
      category: 'Job Applications',
      icon: Building,
      path: `/applications/${app.id}`,
      type: 'app',
      status: app.status,
    })),
  ];

  const handleSelect = (item) => {
    onClose();
    if (item.action === 'quick-add') {
      if (onOpenQuickAdd) onOpenQuickAdd();
    } else if (item.action === 'export-csv') {
      exportApplicationsToCSV(apps);
    } else if (item.path) {
      navigate(item.path);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (allItems.length || 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + (allItems.length || 1)) % (allItems.length || 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (allItems[selectedIndex]) {
          handleSelect(allItems[selectedIndex]);
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, allItems]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="relative max-w-xl mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden animate-slide-in">
        {/* Search input header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 bg-slate-50/50">
          <Search className="w-5 h-5 text-indigo-500 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, job title, company, or destination..."
            className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold text-slate-400 bg-white border border-slate-200 rounded-md shadow-xs">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-slate-100">
          {allItems.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No matching commands or job records found for "{query}"
            </div>
          ) : (
            allItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.title}</span>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {item.status && (
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.status}
                      </span>
                    )}
                    <span className={`text-[10px] uppercase tracking-wider font-semibold ${
                      isSelected ? 'text-indigo-200' : 'text-slate-400'
                    }`}>
                      {item.category}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <span className="flex items-center gap-1 text-indigo-600 font-medium">
            <Sparkles className="w-3 h-3" /> JobTrack Quick Command
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
