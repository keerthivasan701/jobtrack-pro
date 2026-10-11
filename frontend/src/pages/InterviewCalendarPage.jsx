import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar as CalendarIcon,
  Plus,
  Clock,
  Video,
  CheckCircle2,
  AlertCircle,
  Building,
  User,
  Edit,
  Trash2,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Check,
} from 'lucide-react';
import { interviewsApi, applicationsApi } from '../api/client';
import { formatDate } from '../utils/formatters';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import { useToast } from '../context/ToastContext';

const InterviewCalendarPage = () => {
  const toast = useToast();

  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState('upcoming'); // 'all', 'upcoming', 'completed'

  // Modal for Scheduling / Editing
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [modalForm, setModalForm] = useState({
    application: '',
    title: 'Interview Round',
    interview_type: 'Technical',
    interview_date: '',
    location_or_link: '',
    interviewer_names: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Delete confirm modal
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchInterviewsAndApps = async () => {
    try {
      setLoading(true);
      const [ivRes, appsRes] = await Promise.all([
        interviewsApi.list({ ordering: 'interview_date' }),
        applicationsApi.allItems(),
      ]);
      setInterviews(ivRes.data.results || ivRes.data || []);
      setApplications(appsRes.data || []);
    } catch {
      toast.error('Failed to load interviews.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviewsAndApps();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setModalForm({
      application: applications.length > 0 ? applications[0].id : '',
      title: 'Technical Interview',
      interview_type: 'Technical',
      interview_date: '',
      location_or_link: '',
      interviewer_names: '',
      notes: '',
    });
    setModalOpen(true);
  };

  const openEditModal = (iv) => {
    setEditingId(iv.id);
    setModalForm({
      application: iv.application,
      title: iv.title,
      interview_type: iv.interview_type,
      interview_date: iv.interview_date ? iv.interview_date.substring(0, 16) : '',
      location_or_link: iv.location_or_link || '',
      interviewer_names: iv.interviewer_names || '',
      notes: iv.notes || '',
    });
    setModalOpen(true);
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!modalForm.application) {
      toast.error('Please choose a job application for this interview.');
      return;
    }
    if (!modalForm.interview_date) {
      toast.error('Please specify the date and time.');
      return;
    }

    try {
      setSubmitting(true);
      if (editingId) {
        await interviewsApi.update(editingId, modalForm);
        toast.success('Interview rescheduled successfully!');
      } else {
        await interviewsApi.create(modalForm);
        toast.success('New interview added to calendar!');
      }
      setModalOpen(false);
      fetchInterviewsAndApps();
    } catch {
      toast.error('Failed to save interview.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleComplete = async (id, currentStatus) => {
    try {
      await interviewsApi.toggleComplete(id, {
        outcome: currentStatus ? 'Pending' : 'Passed',
      });
      toast.success(currentStatus ? 'Marked as incomplete.' : 'Marked interview as completed!');
      fetchInterviewsAndApps();
    } catch {
      toast.error('Failed to update interview.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      setDeleteLoading(true);
      await interviewsApi.delete(deleteTarget.id);
      toast.success('Interview removed from calendar.');
      setDeleteTarget(null);
      fetchInterviewsAndApps();
    } catch {
      toast.error('Failed to delete interview.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const now = new Date();
  const filteredInterviews = interviews.filter((iv) => {
    const ivDate = new Date(iv.interview_date);
    if (filterMode === 'upcoming') {
      return !iv.is_completed && ivDate >= now;
    }
    if (filterMode === 'completed') {
      return iv.is_completed;
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2.5">
            <CalendarIcon className="w-6 h-6 text-indigo-600" />
            Interview Calendar & Agenda
          </h2>
          <p className="text-sm text-slate-500">
            Track interview rounds, reschedule calls, store meeting links, and document notes
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Schedule Interview
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setFilterMode('upcoming')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            filterMode === 'upcoming'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Upcoming Rounds
        </button>
        <button
          onClick={() => setFilterMode('all')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            filterMode === 'all'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Interviews ({interviews.length})
        </button>
        <button
          onClick={() => setFilterMode('completed')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            filterMode === 'completed'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Completed
        </button>
      </div>

      {/* Agenda Timeline List */}
      {loading ? (
        <div className="space-y-4 animate-pulse">
          <div className="h-32 bg-white rounded-2xl border border-slate-200"></div>
          <div className="h-32 bg-white rounded-2xl border border-slate-200"></div>
        </div>
      ) : filteredInterviews.length === 0 ? (
        <EmptyState
          icon={CalendarIcon}
          title={
            filterMode === 'upcoming'
              ? 'No upcoming interviews scheduled'
              : filterMode === 'completed'
              ? 'No completed interviews yet'
              : 'No interviews on your calendar'
          }
          description="Schedule a new interview round with meeting links, topics, and preparation notes."
          actionText="Schedule Interview"
          onAction={openAddModal}
        />
      ) : (
        <div className="space-y-4">
          {filteredInterviews.map((iv) => {
            const isPast = new Date(iv.interview_date) < now;
            return (
              <div
                key={iv.id}
                className={`bg-white p-5 rounded-2xl border transition-all ${
                  iv.is_completed
                    ? 'border-emerald-200/80 bg-emerald-50/20'
                    : isPast
                    ? 'border-amber-200/80 bg-amber-50/10'
                    : 'border-slate-200/80 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {iv.interview_type}
                      </span>
                      <h3 className="text-base font-bold text-slate-900">{iv.title}</h3>
                      {iv.is_completed ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed ({iv.outcome})
                        </span>
                      ) : isPast ? (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          Past Due / Awaiting Notes
                        </span>
                      ) : null}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                      <span className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <Building className="w-4 h-4 text-slate-400" />
                        {iv.application_details?.company_name || 'Organization'} — {iv.application_details?.job_title}
                      </span>
                      <span className="flex items-center gap-1.5 text-indigo-600 font-semibold">
                        <Clock className="w-4 h-4" />
                        {formatDate(iv.interview_date, true)}
                      </span>
                      {iv.interviewer_names && (
                        <span className="flex items-center gap-1 text-slate-500">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          {iv.interviewer_names}
                        </span>
                      )}
                    </div>

                    {iv.notes && (
                      <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 mt-2">
                        <span className="font-semibold text-slate-700">Prep / Notes:</span> {iv.notes}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                    {iv.location_or_link && (
                      <a
                        href={iv.location_or_link.startsWith('http') ? iv.location_or_link : `https://${iv.location_or_link}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors"
                      >
                        <Video className="w-3.5 h-3.5" />
                        Join Call
                      </a>
                    )}

                    <button
                      onClick={() => handleToggleComplete(iv.id, iv.is_completed)}
                      className={`inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                        iv.is_completed
                          ? 'bg-slate-100 text-slate-700 border-slate-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      {iv.is_completed ? 'Undo Complete' : 'Mark Completed'}
                    </button>

                    <button
                      onClick={() => openEditModal(iv)}
                      title="Edit or Reschedule"
                      className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setDeleteTarget(iv)}
                      title="Delete Interview"
                      className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Interview Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingId ? 'Edit / Reschedule Interview' : 'Schedule New Interview'}
      >
        <form onSubmit={handleModalSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Select Job Application *
            </label>
            <select
              required
              value={modalForm.application}
              onChange={(e) => setModalForm({ ...modalForm, application: e.target.value })}
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="" disabled>Select an application</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.company_name} — {app.job_title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Round Title *
            </label>
            <input
              type="text"
              required
              value={modalForm.title}
              onChange={(e) => setModalForm({ ...modalForm, title: e.target.value })}
              placeholder="e.g. System Design Interview"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Interview Type
              </label>
              <select
                value={modalForm.interview_type}
                onChange={(e) => setModalForm({ ...modalForm, interview_type: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Screening">HR Screening</option>
                <option value="Technical">Technical Interview</option>
                <option value="System Design">System Design</option>
                <option value="Behavioral">Behavioral / Culture</option>
                <option value="Hiring Manager">Hiring Manager</option>
                <option value="Take-Home">Take-Home Review</option>
                <option value="Final">Final Round</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Date & Time *
              </label>
              <input
                type="datetime-local"
                required
                value={modalForm.interview_date}
                onChange={(e) => setModalForm({ ...modalForm, interview_date: e.target.value })}
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Meeting URL or Room Location
            </label>
            <input
              type="text"
              value={modalForm.location_or_link}
              onChange={(e) => setModalForm({ ...modalForm, location_or_link: e.target.value })}
              placeholder="https://meet.google.com/abc-xyz or Zoom URL"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Interviewers
            </label>
            <input
              type="text"
              value={modalForm.interviewer_names}
              onChange={(e) => setModalForm({ ...modalForm, interviewer_names: e.target.value })}
              placeholder="e.g. Alex Morgan, Dan Abramov"
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Preparation Notes
            </label>
            <textarea
              rows="3"
              value={modalForm.notes}
              onChange={(e) => setModalForm({ ...modalForm, notes: e.target.value })}
              placeholder="Key algorithms, behavioral stories, company values..."
              className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all disabled:opacity-70"
            >
              {submitting ? 'Saving...' : editingId ? 'Update Interview' : 'Save Interview'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Interview"
        message={`Are you sure you want to remove the "${deleteTarget?.title}" interview round from your calendar?`}
        confirmText="Remove Interview"
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default InterviewCalendarPage;
