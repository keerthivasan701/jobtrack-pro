import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Eye,
  SlidersHorizontal,
  Building,
  MapPin,
  Calendar,
  Layers,
} from 'lucide-react';
import { applicationsApi } from '../api/client';
import { formatDate } from '../utils/formatters';
import StatusBadge from '../components/common/StatusBadge';
import WorkModeBadge from '../components/common/WorkModeBadge';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { TableRowSkeleton } from '../components/common/SkeletonLoader';
import EmptyState from '../components/common/EmptyState';
import { useToast } from '../context/ToastContext';

const STATUS_OPTIONS = ['All', 'Wishlist', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected'];
const WORK_MODE_OPTIONS = ['All', 'Remote', 'Hybrid', 'On-site'];
const SORT_OPTIONS = [
  { label: 'Newest First', value: '-application_date' },
  { label: 'Oldest First', value: 'application_date' },
  { label: 'Company (A-Z)', value: 'company_name' },
  { label: 'Company (Z-A)', value: '-company_name' },
];

const ApplicationsPage = () => {
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const [applications, setApplications] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters & State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'All');
  const [selectedWorkMode, setSelectedWorkMode] = useState(searchParams.get('work_mode') || 'All');
  const [selectedSort, setSelectedSort] = useState(searchParams.get('ordering') || '-application_date');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [pageSize, setPageSize] = useState(10);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        page_size: pageSize,
        ordering: selectedSort,
      };

      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (selectedStatus !== 'All') params.status = selectedStatus;
      if (selectedWorkMode !== 'All') params.work_mode = selectedWorkMode;

      const res = await applicationsApi.list(params);
      setApplications(res.data.results || []);
      setTotalCount(res.data.count || 0);
    } catch (err) {
      toast.error('Failed to load applications.');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, selectedSort, searchQuery, selectedStatus, selectedWorkMode, toast]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchApplications();
  };

  const handleQuickStatusChange = async (appId, newStatus) => {
    try {
      await applicationsApi.updateStatus(appId, newStatus);
      toast.success('Status updated successfully.');
      setApplications((prev) =>
        prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
      );
    } catch {
      toast.error('Failed to update status.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteLoading(true);
      await applicationsApi.delete(deleteTarget.id);
      toast.success(`Deleted application for ${deleteTarget.job_title}.`);
      setDeleteTarget(null);
      fetchApplications();
    } catch {
      toast.error('Failed to delete application.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header and Add CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Job Applications</h2>
          <p className="text-sm text-slate-500">
            Search, filter, and track every application in your pipeline ({totalCount} total)
          </p>
        </div>
        <Link
          to="/applications/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Add Application
        </Link>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company, job title, location, or notes..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Search
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Status Filter
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {STATUS_OPTIONS.map((st) => (
                <option key={st} value={st}>
                  {st === 'All' ? 'All Statuses' : st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Work Mode
            </label>
            <select
              value={selectedWorkMode}
              onChange={(e) => {
                setSelectedWorkMode(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {WORK_MODE_OPTIONS.map((wm) => (
                <option key={wm} value={wm}>
                  {wm === 'All' ? 'All Work Modes' : wm}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Sort By
            </label>
            <select
              value={selectedSort}
              onChange={(e) => {
                setSelectedSort(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Applications Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-4">
            <table className="w-full">
              <tbody>
                <TableRowSkeleton columns={6} />
                <TableRowSkeleton columns={6} />
                <TableRowSkeleton columns={6} />
                <TableRowSkeleton columns={6} />
                <TableRowSkeleton columns={6} />
              </tbody>
            </table>
          </div>
        ) : applications.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No applications found"
              description={
                searchQuery || selectedStatus !== 'All' || selectedWorkMode !== 'All'
                  ? 'No applications match your active filters. Try resetting search filters.'
                  : 'You have not added any job applications yet. Track your first one today!'
              }
              actionText="Add Application"
              onAction={() => window.location.assign('/applications/new')}
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/70 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Role & Company</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Location / Mode</th>
                  <th className="py-3.5 px-4">Salary</th>
                  <th className="py-3.5 px-4">Applied Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="py-4 px-4">
                      <div>
                        <Link
                          to={`/applications/${app.id}`}
                          className="font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                        >
                          {app.job_title}
                        </Link>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                          <span className="font-medium text-slate-700">{app.company_name}</span>
                          {app.company_website && (
                            <a
                              href={app.company_website.startsWith('http') ? app.company_website : `https://${app.company_website}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-slate-400 hover:text-indigo-600"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={app.status}
                          onChange={(e) => handleQuickStatusChange(app.id, e.target.value)}
                          className="text-xs font-medium px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                        >
                          <option value="Wishlist">Wishlist</option>
                          <option value="Applied">Applied</option>
                          <option value="Assessment">Assessment</option>
                          <option value="Interview">Interview</option>
                          <option value="Offer">Offer</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="space-y-1">
                        <WorkModeBadge mode={app.work_mode} />
                        {app.job_location && (
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {app.job_location}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-xs font-medium text-slate-700">
                      {app.salary_range || '—'}
                    </td>

                    <td className="py-4 px-4 text-xs text-slate-500">
                      {formatDate(app.application_date)}
                    </td>

                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/applications/${app.id}`}
                          title="View Details"
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/applications/${app.id}/edit`}
                          title="Edit Application"
                          className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(app)}
                          title="Delete Application"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        {totalCount > 0 && (
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
            <div>
              Showing <span className="font-semibold">{(page - 1) * pageSize + 1}</span> to{' '}
              <span className="font-semibold">{Math.min(page * pageSize, totalCount)}</span> of{' '}
              <span className="font-semibold">{totalCount}</span> applications
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 border border-slate-200 bg-white rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="px-2 font-medium">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 border border-slate-200 bg-white rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Job Application"
        message={`Are you sure you want to permanently delete the application for "${deleteTarget?.job_title}" at "${deleteTarget?.company_name}"? This will also remove any scheduled interviews associated with it.`}
        confirmText="Delete Application"
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default ApplicationsPage;
