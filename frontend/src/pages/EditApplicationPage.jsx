import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Briefcase,
  ArrowLeft,
  Building,
  MapPin,
  DollarSign,
  Calendar,
  Globe,
  Mail,
  User,
  FileText,
  Save,
} from 'lucide-react';
import { applicationsApi } from '../api/client';
import { useToast } from '../context/ToastContext';

const EditApplicationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    job_title: '',
    company_name: '',
    company_website: '',
    job_description: '',
    job_location: '',
    work_mode: 'Remote',
    employment_type: 'Full-time',
    job_url: '',
    salary_range: '',
    application_date: '',
    status: 'Applied',
    interview_date: '',
    recruiter_name: '',
    recruiter_email: '',
    notes: '',
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchApp = async () => {
      try {
        setLoading(true);
        const res = await applicationsApi.get(id);
        const data = res.data;
        setFormData({
          job_title: data.job_title || '',
          company_name: data.company_name || '',
          company_website: data.company_website || '',
          job_description: data.job_description || '',
          job_location: data.job_location || '',
          work_mode: data.work_mode || 'Remote',
          employment_type: data.employment_type || 'Full-time',
          job_url: data.job_url || '',
          salary_range: data.salary_range || '',
          application_date: data.application_date || '',
          status: data.status || 'Applied',
          interview_date: data.interview_date ? data.interview_date.substring(0, 16) : '',
          recruiter_name: data.recruiter_name || '',
          recruiter_email: data.recruiter_email || '',
          notes: data.notes || '',
        });
      } catch {
        toast.error('Failed to load application.');
        navigate('/applications');
      } finally {
        setLoading(false);
      }
    };

    fetchApp();
  }, [id, navigate, toast]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.job_title.trim()) newErrors.job_title = 'Job title is required.';
    if (!formData.company_name.trim()) newErrors.company_name = 'Company name is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fix the errors in the form.');
      return;
    }

    const payload = {
      ...formData,
      company_website: formData.company_website.trim() || null,
      job_url: formData.job_url.trim() || null,
      interview_date: formData.interview_date || null,
      recruiter_email: formData.recruiter_email.trim() || '',
    };

    try {
      setSubmitting(true);
      await applicationsApi.update(id, payload);
      toast.success('Application updated successfully!');
      navigate(`/applications/${id}`);
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        toast.error('Failed to update application.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="h-8 bg-slate-200 rounded w-1/3 animate-pulse"></div>
        <div className="h-96 bg-white rounded-2xl border border-slate-200 animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to={`/applications/${id}`}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-white rounded-xl border border-slate-200/80 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Edit Application: {formData.company_name}
            </h2>
            <p className="text-sm text-slate-500">Update role requirements, status, notes, or recruiter details</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Role & Organization */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-indigo-600 flex items-center gap-2">
            <Briefcase className="w-4 h-4" />
            1. Role & Organization
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Job Title *
              </label>
              <input
                type="text"
                name="job_title"
                required
                value={formData.job_title}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.job_title && <p className="text-xs text-rose-500 mt-1">{errors.job_title}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Company Name *
              </label>
              <input
                type="text"
                name="company_name"
                required
                value={formData.company_name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {errors.company_name && <p className="text-xs text-rose-500 mt-1">{errors.company_name}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Company Website URL
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  name="company_website"
                  value={formData.company_website}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Job Posting / Application URL
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  name="job_url"
                  value={formData.job_url}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Work Mode & Compensation */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-indigo-600 flex items-center gap-2">
            <Building className="w-4 h-4" />
            2. Work Arrangement & Compensation
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Work Mode
              </label>
              <select
                name="work_mode"
                value={formData.work_mode}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Employment Type
              </label>
              <select
                name="employment_type"
                value={formData.employment_type}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Location
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="job_location"
                  value={formData.job_location}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Salary / Target Compensation
            </label>
            <div className="relative">
              <DollarSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="salary_range"
                value={formData.salary_range}
                onChange={handleChange}
                className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Status & Dates */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-indigo-600 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            3. Pipeline Stage & Key Dates
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Application Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="Wishlist">Wishlist</option>
                <option value="Applied">Applied</option>
                <option value="Assessment">Assessment</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Application Date
              </label>
              <input
                type="date"
                name="application_date"
                value={formData.application_date}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Upcoming Interview (Optional)
              </label>
              <input
                type="datetime-local"
                name="interview_date"
                value={formData.interview_date}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Recruiter Contact Info */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-indigo-600 flex items-center gap-2">
            <User className="w-4 h-4" />
            4. Recruiter or Contact Info
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Recruiter Name
              </label>
              <input
                type="text"
                name="recruiter_name"
                value={formData.recruiter_name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Recruiter Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="recruiter_email"
                  value={formData.recruiter_email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Job Description & Notes */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-indigo-600 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            5. Job Description & Private Notes
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Job Description
            </label>
            <textarea
              name="job_description"
              rows="4"
              value={formData.job_description}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Personal Notes
            </label>
            <textarea
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            ></textarea>
          </div>
        </div>

        {/* Actions Footer */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link
            to={`/applications/${id}`}
            className="px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/25 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 active:scale-[0.98]"
          >
            <Save className="w-4 h-4" />
            {submitting ? 'Saving changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditApplicationPage;
