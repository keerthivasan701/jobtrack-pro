import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Mail,
  User,
  FileText,
  Trash2,
  Edit,
  ExternalLink,
  Plus,
  Clock,
  Video,
  CheckCircle2,
} from 'lucide-react';
import { applicationsApi, interviewsApi } from '../api/client';
import { formatDate, getRelativeDays } from '../utils/formatters';
import StatusBadge from '../components/common/StatusBadge';
import WorkModeBadge from '../components/common/WorkModeBadge';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Modal from '../components/common/Modal';
import { useToast } from '../context/ToastContext';

const ApplicationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [application, setApplication] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Schedule Interview Modal state
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [interviewForm, setInterviewForm] = useState({
    title: 'Interview Round',
    interview_type: 'Technical',
    interview_date: '',
    location_or_link: '',
    interviewer_names: '',
    notes: '',
  });
  const [submittingInterview, setSubmittingInterview] = useState(false);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const [appRes, ivRes] = await Promise.all([
        applicationsApi.get(id),
        interviewsApi.list({ application: id }),
      ]);
      setApplication(appRes.data);
      setInterviews(ivRes.data.results || ivRes.data || []);
    } catch {
      toast.error('Failed to load application details.');
      navigate('/applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    try {
      await applicationsApi.updateStatus(id, newStatus);
      setApplication((prev) => ({ ...prev, status: newStatus }));
      toast.success(`Status updated to ${newStatus}.`);
    } catch {
      toast.error('Failed to update status.');
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      await applicationsApi.delete(id);
      toast.success('Application deleted successfully.');
      navigate('/applications');
    } catch {
      toast.error('Failed to delete application.');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCreateInterview = async (e) => {
    e.preventDefault();
    if (!interviewForm.interview_date) {
      toast.error('Please specify the interview date and time.');
      return;
    }

    try {
      setSubmittingInterview(true);
      await interviewsApi.create({
        ...interviewForm,
        application: id,
      });
      toast.success('Interview scheduled successfully!');
      setInterviewModalOpen(false);
      setInterviewForm({
        title: 'Interview Round',
        interview_type: 'Technical',
        interview_date: '',
        location_or_link: '',
        interviewer_names: '',
        notes: '',
      });
      fetchDetails();
    } catch {
      toast.error('Failed to schedule interview.');
    } finally {
      setSubmittingInterview(false);
    }
  };

  const handleToggleInterviewComplete = async (interviewId, outcome = 'Passed') => {
    try {
      await interviewsApi.toggleComplete(interviewId, { outcome });
      toast.success('Interview status updated.');
      fetchDetails();
    } catch {
      toast.error('Failed to update interview.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/4 animate-pulse"></div>
        <div className="h-64 bg-white rounded-2xl border border-slate-200 animate-pulse"></div>
      </div>
    );
  }

  if (!application) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Top Navigation & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/applications"
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-white rounded-xl border border-slate-200/80 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {application.job_title}
            </h2>
            <p className="text-sm text-slate-500 flex items-center gap-2">
              <span className="font-semibold text-slate-800">{application.company_name}</span>
              {application.company_website && (
                <a
                  href={application.company_website.startsWith('http') ? application.company_website : `https://${application.company_website}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 hover:underline flex items-center gap-1 text-xs"
                >
                  Visit Website <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Quick Status Select */}
          <select
            value={application.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="text-xs font-semibold px-3 py-2 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Wishlist">Wishlist</option>
            <option value="Applied">Applied</option>
            <option value="Assessment">Assessment</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>

          <Link
            to={`/applications/${id}/edit`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            <Edit className="w-3.5 h-3.5 text-slate-500" />
            Edit
          </Link>

          <button
            onClick={() => setDeleteConfirmOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-600 bg-white border border-rose-200 rounded-xl hover:bg-rose-50 transition-colors shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-medium text-slate-400">Current Stage</span>
          <div className="mt-1">
            <StatusBadge status={application.status} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-medium text-slate-400">Work Arrangement</span>
          <div className="mt-1 flex items-center gap-2">
            <WorkModeBadge mode={application.work_mode} />
            <span className="text-xs text-slate-500">{application.employment_type}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-medium text-slate-400">Target Salary</span>
          <p className="mt-1 text-sm font-bold text-slate-900">
            {application.salary_range || 'Not Specified'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-medium text-slate-400">Applied Date</span>
          <p className="mt-1 text-sm font-bold text-slate-900">
            {formatDate(application.application_date)}
            <span className="text-xs font-normal text-slate-400 ml-1.5">
              ({getRelativeDays(application.application_date)})
            </span>
          </p>
        </div>
      </div>

      {/* Main Content Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Description & Interview Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Description Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-600" />
                Job Description & Scope
              </h3>
              {application.job_url && (
                <a
                  href={application.job_url.startsWith('http') ? application.job_url : `https://${application.job_url}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline"
                >
                  Original Job Post <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50/50 p-4 rounded-xl border border-slate-100">
              {application.job_description || 'No description provided for this position.'}
            </div>
          </div>

          {/* Interview Rounds & Scheduling */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  Interview Timeline ({interviews.length} rounds)
                </h3>
                <p className="text-xs text-slate-400">Manage interviews for {application.company_name}</p>
              </div>
              <button
                onClick={() => setInterviewModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Schedule Round
              </button>
            </div>

            {interviews.length === 0 ? (
              <div className="text-center py-8 bg-slate-50/60 rounded-xl border border-dashed border-slate-200">
                <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No interview rounds scheduled yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  Schedule technical screenings, take-homes, or system design interviews.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {interviews.map((iv) => (
                  <div
                    key={iv.id}
                    className={`p-4 rounded-xl border transition-all ${
                      iv.is_completed
                        ? 'bg-emerald-50/30 border-emerald-200/60'
                        : 'bg-white border-slate-200/80 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{iv.title}</h4>
                          <span className="text-xs font-medium px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-200/60">
                            {iv.interview_type}
                          </span>
                          {iv.is_completed && (
                            <span className="text-xs font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" /> Completed ({iv.outcome})
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {formatDate(iv.interview_date, true)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {iv.location_or_link && (
                          <a
                            href={iv.location_or_link.startsWith('http') ? iv.location_or_link : `https://${iv.location_or_link}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors text-xs font-semibold flex items-center gap-1"
                          >
                            <Video className="w-3.5 h-3.5" />
                            Join
                          </a>
                        )}

                        <button
                          onClick={() => handleToggleInterviewComplete(iv.id)}
                          className={`p-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            iv.is_completed
                              ? 'bg-slate-100 text-slate-600 border-slate-200'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                          }`}
                        >
                          {iv.is_completed ? 'Mark Incomplete' : 'Mark Complete'}
                        </button>
                      </div>
                    </div>

                    {iv.interviewer_names && (
                      <p className="text-xs text-slate-600 mt-2">
                        <span className="font-semibold text-slate-700">Interviewers:</span> {iv.interviewer_names}
                      </p>
                    )}

                    {iv.notes && (
                      <p className="text-xs text-slate-500 mt-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        {iv.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1 Col): Recruiter & Private Notes */}
        <div className="space-y-6">
          {/* Recruiter Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              Recruiter / Contact
            </h3>
            {application.recruiter_name || application.recruiter_email ? (
              <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm">
                {application.recruiter_name && (
                  <p className="font-semibold text-slate-900">{application.recruiter_name}</p>
                )}
                {application.recruiter_email && (
                  <a
                    href={`mailto:${application.recruiter_email}`}
                    className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-medium"
                  >
                    <Mail className="w-3 h-3" />
                    {application.recruiter_email}
                  </a>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No recruiter contact details recorded.</p>
            )}
          </div>

          {/* Personal Notes */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              Private Notes
            </h3>
            <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-xl border border-slate-100">
              {application.notes || 'No notes added yet.'}
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Interview Modal */}
      <Modal
        isOpen={interviewModalOpen}
        onClose={() => setInterviewModalOpen(false)}
        title={`Schedule Interview: ${application.company_name}`}
      >
        <form onSubmit={handleCreateInterview} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Interview Title *
            </label>
            <input
              type="text"
              required
              value={interviewForm.title}
              onChange={(e) => setInterviewForm({ ...interviewForm, title: e.target.value })}
              placeholder="e.g. Technical Round 2 - System Design"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Type
              </label>
              <select
                value={interviewForm.interview_type}
                onChange={(e) => setInterviewForm({ ...interviewForm, interview_type: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                value={interviewForm.interview_date}
                onChange={(e) => setInterviewForm({ ...interviewForm, interview_date: e.target.value })}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Meeting Link or Location
            </label>
            <input
              type="text"
              value={interviewForm.location_or_link}
              onChange={(e) => setInterviewForm({ ...interviewForm, location_or_link: e.target.value })}
              placeholder="https://meet.google.com/xyz or Zoom link"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Interviewers
            </label>
            <input
              type="text"
              value={interviewForm.interviewer_names}
              onChange={(e) => setInterviewForm({ ...interviewForm, interviewer_names: e.target.value })}
              placeholder="e.g. Sarah Jenkins (Engineering Manager)"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Preparation Notes
            </label>
            <textarea
              rows="2"
              value={interviewForm.notes}
              onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })}
              placeholder="Topics to study, questions to ask..."
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setInterviewModalOpen(false)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingInterview}
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all disabled:opacity-70"
            >
              {submittingInterview ? 'Scheduling...' : 'Confirm Schedule'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Application"
        message={`Are you sure you want to delete ${application.job_title} at ${application.company_name}? This action cannot be reversed.`}
        confirmText="Delete Application"
        isLoading={deleteLoading}
      />
    </div>
  );
};

export default ApplicationDetailPage;
