import React, { useState } from 'react';
import Modal from './Modal';
import { applicationsApi } from '../../api/client';
import { useToast } from '../../context/ToastContext';
import { Briefcase, Building, DollarSign, MapPin, Globe } from 'lucide-react';

const QuickAddModal = ({ isOpen, onClose, onSuccess }) => {
  const toast = useToast();
  const [formData, setFormData] = useState({
    job_title: '',
    company_name: '',
    company_website: '',
    job_location: '',
    work_mode: 'Remote',
    employment_type: 'Full-time',
    status: 'Applied',
    salary_range: '',
    application_date: new Date().toISOString().split('T')[0],
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.job_title.trim()) {
      setErrors((prev) => ({ ...prev, job_title: 'Job title is required.' }));
      return;
    }
    if (!formData.company_name.trim()) {
      setErrors((prev) => ({ ...prev, company_name: 'Company name is required.' }));
      return;
    }

    try {
      setLoading(true);
      await applicationsApi.create(formData);
      toast.success(`Application for ${formData.job_title} at ${formData.company_name} saved!`);
      // Reset form
      setFormData({
        job_title: '',
        company_name: '',
        company_website: '',
        job_location: '',
        work_mode: 'Remote',
        employment_type: 'Full-time',
        status: 'Applied',
        salary_range: '',
        application_date: new Date().toISOString().split('T')[0],
        notes: '',
      });
      onClose();
      if (onSuccess) onSuccess();
    } catch (err) {
      if (err.response?.data) {
        setErrors(err.response.data);
      } else {
        toast.error('Failed to create application. Please check your network connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Quick Add Job Application" maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Job Title *
            </label>
            <div className="relative">
              <input
                type="text"
                name="job_title"
                required
                value={formData.job_title}
                onChange={handleChange}
                placeholder="e.g. Senior Frontend Engineer"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {errors.job_title && <p className="text-xs text-rose-500 mt-1">{errors.job_title}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Company Name *
            </label>
            <div className="relative">
              <input
                type="text"
                name="company_name"
                required
                value={formData.company_name}
                onChange={handleChange}
                placeholder="e.g. Stripe"
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {errors.company_name && <p className="text-xs text-rose-500 mt-1">{errors.company_name}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Initial Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
              Work Mode
            </label>
            <select
              name="work_mode"
              value={formData.work_mode}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Salary Range
            </label>
            <input
              type="text"
              name="salary_range"
              value={formData.salary_range}
              onChange={handleChange}
              placeholder="e.g. $140,000 - $170,000"
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
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
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Notes / Details
          </label>
          <textarea
            name="notes"
            rows="2"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Recruiter names, tech stack notes, key links..."
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center gap-2"
          >
            {loading ? 'Saving...' : 'Add Application'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default QuickAddModal;
