import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  Kanban,
  Plus,
  Search,
  Building,
  MapPin,
  Calendar,
  ExternalLink,
  DollarSign,
  GripVertical,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { applicationsApi } from '../api/client';
import { formatDate, getRelativeDays, STATUS_CONFIG } from '../utils/formatters';
import WorkModeBadge from '../components/common/WorkModeBadge';
import { useToast } from '../context/ToastContext';

const PIPELINE_COLUMNS = [
  { id: 'Wishlist', title: 'Wishlist', headerBg: 'border-slate-300 text-slate-700 bg-slate-100/70', dot: 'bg-slate-400' },
  { id: 'Applied', title: 'Applied', headerBg: 'border-blue-300 text-blue-700 bg-blue-50/70', dot: 'bg-blue-500' },
  { id: 'Assessment', title: 'Assessment', headerBg: 'border-purple-300 text-purple-700 bg-purple-50/70', dot: 'bg-purple-500' },
  { id: 'Interview', title: 'Interview', headerBg: 'border-amber-300 text-amber-700 bg-amber-50/70', dot: 'bg-amber-500' },
  { id: 'Offer', title: 'Offer', headerBg: 'border-emerald-300 text-emerald-700 bg-emerald-50/70', dot: 'bg-emerald-500' },
  { id: 'Rejected', title: 'Rejected', headerBg: 'border-rose-300 text-rose-700 bg-rose-50/70', dot: 'bg-rose-500' },
];

const PipelinePage = () => {
  const { onOpenQuickAdd, refreshKey } = useOutletContext();
  const toast = useToast();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedAppId, setDraggedAppId] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const fetchAllApplications = async () => {
    try {
      setLoading(true);
      const res = await applicationsApi.allItems();
      setApplications(res.data || []);
    } catch {
      toast.error('Failed to load application pipeline.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllApplications();
  }, [refreshKey]);

  // Drag and drop handlers
  const handleDragStart = (e, appId) => {
    e.dataTransfer.setData('text/plain', appId);
    setDraggedAppId(appId);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleDragLeave = (e, columnId) => {
    if (dragOverColumn === columnId) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = async (e, targetStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const appId = parseInt(e.dataTransfer.getData('text/plain') || draggedAppId, 10);
    if (!appId) return;

    const currentApp = applications.find((a) => a.id === appId);
    if (!currentApp || currentApp.status === targetStatus) return;

    // Optimistic UI Update
    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: targetStatus } : app))
    );

    try {
      await applicationsApi.updateStatus(appId, targetStatus);
      toast.success(`Moved ${currentApp.company_name} to ${targetStatus}`);
    } catch {
      toast.error('Failed to update stage. Reverting...');
      fetchAllApplications();
    } finally {
      setDraggedAppId(null);
    }
  };

  const handleSelectStatus = async (appId, targetStatus) => {
    const currentApp = applications.find((a) => a.id === appId);
    if (!currentApp || currentApp.status === targetStatus) return;

    setApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: targetStatus } : app))
    );

    try {
      await applicationsApi.updateStatus(appId, targetStatus);
      toast.success(`Moved ${currentApp.company_name} to ${targetStatus}`);
    } catch {
      toast.error('Failed to update stage.');
      fetchAllApplications();
    }
  };

  const filteredApps = applications.filter((app) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      app.company_name.toLowerCase().includes(q) ||
      app.job_title.toLowerCase().includes(q) ||
      (app.job_location && app.job_location.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Kanban className="w-6 h-6 text-indigo-600" />
            Application Pipeline
          </h2>
          <p className="text-sm text-slate-500">
            Drag-and-drop or select stages to progress your hiring pipeline in real-time
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pipeline..."
              className="pl-9 pr-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm w-48 sm:w-64"
            />
          </div>

          <button
            onClick={onOpenQuickAdd}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Add Application
          </button>
        </div>
      </div>

      {/* Kanban Columns Grid (Horizontal scroll on smaller screens) */}
      <div className="overflow-x-auto pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-4 min-w-[1100px] xl:min-w-0">
          {PIPELINE_COLUMNS.map((column) => {
            const columnApps = filteredApps.filter((a) => a.status === column.id);
            const isDragOver = dragOverColumn === column.id;

            return (
              <div
                key={column.id}
                onDragOver={(e) => handleDragOver(e, column.id)}
                onDragLeave={(e) => handleDragLeave(e, column.id)}
                onDrop={(e) => handleDrop(e, column.id)}
                className={`flex flex-col bg-slate-100/70 rounded-2xl border transition-all min-h-[550px] ${
                  isDragOver
                    ? 'border-indigo-500 bg-indigo-50/40 ring-2 ring-indigo-500/20'
                    : 'border-slate-200/80'
                }`}
              >
                {/* Column Header */}
                <div className={`p-3.5 rounded-t-2xl border-b flex items-center justify-between ${column.headerBg}`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${column.dot}`} />
                    <span className="text-xs font-bold uppercase tracking-wider">{column.title}</span>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-white/80 border border-slate-200">
                    {columnApps.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="flex-1 p-2.5 space-y-2.5 overflow-y-auto">
                  {loading ? (
                    <div className="space-y-2.5 animate-pulse">
                      <div className="h-28 bg-white rounded-xl border border-slate-200"></div>
                      <div className="h-28 bg-white rounded-xl border border-slate-200"></div>
                    </div>
                  ) : columnApps.length === 0 ? (
                    <div className="h-32 flex flex-col items-center justify-center text-center p-3 text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
                      <span>No jobs in {column.title}</span>
                      <span className="text-[11px] text-slate-400 mt-1">Drop card here</span>
                    </div>
                  ) : (
                    columnApps.map((app) => (
                      <div
                        key={app.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, app.id)}
                        className={`bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group select-none relative ${
                          draggedAppId === app.id ? 'opacity-40' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1 mb-1.5">
                          <h4 className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                            {app.job_title}
                          </h4>
                          <GripVertical className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                        </div>

                        <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1">
                          <Building className="w-3 h-3 text-slate-400" />
                          {app.company_name}
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2.5">
                          <WorkModeBadge mode={app.work_mode} />
                          {app.salary_range && (
                            <span className="font-medium text-slate-700 truncate max-w-[100px]">
                              {app.salary_range}
                            </span>
                          )}
                        </div>

                        {app.interview_date && (
                          <div className="mb-2 text-[11px] font-semibold text-amber-700 bg-amber-50 p-1.5 rounded-lg border border-amber-200/60 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Interview: {formatDate(app.interview_date, true)}
                          </div>
                        )}

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                          <span className="text-slate-400">{formatDate(app.application_date)}</span>

                          {/* Move to dropdown */}
                          <div className="flex items-center gap-1.5">
                            <select
                              value={app.status}
                              onChange={(e) => handleSelectStatus(app.id, e.target.value)}
                              className="text-[11px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded-md px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                              title="Move stage"
                            >
                              <option value="Wishlist">Wishlist</option>
                              <option value="Applied">Applied</option>
                              <option value="Assessment">Assessment</option>
                              <option value="Interview">Interview</option>
                              <option value="Offer">Offer</option>
                              <option value="Rejected">Rejected</option>
                            </select>

                            <Link
                              to={`/applications/${app.id}`}
                              title="View details"
                              className="p-1 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded transition-colors"
                            >
                              <ArrowRight className="w-3 h-3" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PipelinePage;
