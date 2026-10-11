import React, { useState, useEffect } from 'react';
import {
  User,
  Shield,
  KeyRound,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Briefcase,
  Phone,
  Globe,
  Database,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/client';
import { useToast } from '../context/ToastContext';

const SettingsPage = () => {
  const { user, updateUser, refreshUserProfile } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('profile'); // 'profile', 'security', 'system'

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    current_title: '',
    target_role: '',
    phone_number: '',
    bio: '',
    linkedin_url: '',
    github_url: '',
    portfolio_url: '',
  });
  const [profileSaving, setProfileSaving] = useState(false);

  // Security Form state
  const [passwordForm, setPasswordForm] = useState({
    old_password: '',
    new_password: '',
    confirm_new_password: '',
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordErrors, setPasswordErrors] = useState({});

  useEffect(() => {
    if (user) {
      setProfileForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        current_title: user.profile?.current_title || '',
        target_role: user.profile?.target_role || '',
        phone_number: user.profile?.phone_number || '',
        bio: user.profile?.bio || '',
        linkedin_url: user.profile?.linkedin_url || '',
        github_url: user.profile?.github_url || '',
        portfolio_url: user.profile?.portfolio_url || '',
      });
    }
  }, [user]);

  const handleProfileChange = (e) => {
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      setProfileSaving(true);
      const res = await authApi.updateProfile({
        first_name: profileForm.first_name,
        last_name: profileForm.last_name,
        email: profileForm.email,
        profile: {
          current_title: profileForm.current_title,
          target_role: profileForm.target_role,
          phone_number: profileForm.phone_number,
          bio: profileForm.bio,
          linkedin_url: profileForm.linkedin_url,
          github_url: profileForm.github_url,
          portfolio_url: profileForm.portfolio_url,
        },
      });
      updateUser(res.data);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error('Failed to update profile.');
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordErrors({});

    if (passwordForm.new_password.length < 6) {
      setPasswordErrors({ new_password: ['Password must be at least 6 characters long.'] });
      return;
    }
    if (passwordForm.new_password !== passwordForm.confirm_new_password) {
      setPasswordErrors({ confirm_new_password: ['New passwords do not match.'] });
      return;
    }

    try {
      setPasswordSaving(true);
      await authApi.changePassword({
        old_password: passwordForm.old_password,
        new_password: passwordForm.new_password,
      });
      toast.success('Password changed successfully!');
      setPasswordForm({
        old_password: '',
        new_password: '',
        confirm_new_password: '',
      });
    } catch (err) {
      if (err.response?.data) {
        setPasswordErrors(err.response.data);
      } else {
        toast.error('Failed to change password.');
      }
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Account & Profile Settings</h2>
        <p className="text-sm text-slate-500">
          Manage your career identity, contact links, and account security credentials
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'profile'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <User className="w-4 h-4" />
          Profile Details
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'security'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <KeyRound className="w-4 h-4" />
          Security & Password
        </button>

        <button
          onClick={() => setActiveTab('system')}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'system'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          API & System
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-indigo-600">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={profileForm.first_name}
                  onChange={handleProfileChange}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={profileForm.last_name}
                  onChange={handleProfileChange}
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={profileForm.email}
                onChange={handleProfileChange}
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Current Title
                </label>
                <input
                  type="text"
                  name="current_title"
                  value={profileForm.current_title}
                  onChange={handleProfileChange}
                  placeholder="e.g. Senior Frontend Dev"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Target Role
                </label>
                <input
                  type="text"
                  name="target_role"
                  value={profileForm.target_role}
                  onChange={handleProfileChange}
                  placeholder="e.g. Staff Full-Stack"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone_number"
                  value={profileForm.phone_number}
                  onChange={handleProfileChange}
                  placeholder="+1 (555) 019-2831"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Bio / Elevator Pitch
              </label>
              <textarea
                name="bio"
                rows="3"
                value={profileForm.bio}
                onChange={handleProfileChange}
                placeholder="A short summary of your background, tech expertise, and goals..."
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              ></textarea>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-indigo-600">
              Professional Links
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  name="linkedin_url"
                  value={profileForm.linkedin_url}
                  onChange={handleProfileChange}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  GitHub URL
                </label>
                <input
                  type="url"
                  name="github_url"
                  value={profileForm.github_url}
                  onChange={handleProfileChange}
                  placeholder="https://github.com/..."
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Portfolio Website
                </label>
                <input
                  type="url"
                  name="portfolio_url"
                  value={profileForm.portfolio_url}
                  onChange={handleProfileChange}
                  placeholder="https://yourname.dev"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={profileSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/25 transition-all disabled:opacity-70"
            >
              <Save className="w-4 h-4" />
              {profileSaving ? 'Saving Changes...' : 'Save Profile Details'}
            </button>
          </div>
        </form>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-indigo-600">
              Change Password
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Current Password *
              </label>
              <input
                type="password"
                required
                value={passwordForm.old_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, old_password: e.target.value })}
                className="w-full max-w-md px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {passwordErrors.old_password && (
                <p className="text-xs text-rose-500 mt-1">{passwordErrors.old_password[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                New Password *
              </label>
              <input
                type="password"
                required
                value={passwordForm.new_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                placeholder="At least 6 characters"
                className="w-full max-w-md px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {passwordErrors.new_password && (
                <p className="text-xs text-rose-500 mt-1">{passwordErrors.new_password[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Confirm New Password *
              </label>
              <input
                type="password"
                required
                value={passwordForm.confirm_new_password}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirm_new_password: e.target.value })
                }
                className="w-full max-w-md px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              {passwordErrors.confirm_new_password && (
                <p className="text-xs text-rose-500 mt-1">{passwordErrors.confirm_new_password[0]}</p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={passwordSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/25 transition-all disabled:opacity-70"
              >
                <Save className="w-4 h-4" />
                {passwordSaving ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* System & API Tab */}
      {activeTab === 'system' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-indigo-600">
            System & API Documentation
          </h3>

          <div className="space-y-3 text-sm text-slate-600">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">Interactive Swagger Documentation</p>
                <p className="text-xs text-slate-500">Live API browser powered by drf-spectacular</p>
              </div>
              <a
                href="http://127.0.0.1:8000/api/docs/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-white border border-indigo-200 rounded-xl hover:bg-indigo-50 shadow-sm transition-colors"
              >
                Open Swagger UI <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">ReDoc API Specifications</p>
                <p className="text-xs text-slate-500">Readable documentation layout</p>
              </div>
              <a
                href="http://127.0.0.1:8000/api/redoc/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-white border border-indigo-200 rounded-xl hover:bg-indigo-50 shadow-sm transition-colors"
              >
                Open ReDoc <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-900">OpenAPI 3.0 Schema</p>
                <p className="text-xs text-slate-500">Raw YAML / JSON specification download</p>
              </div>
              <a
                href="http://127.0.0.1:8000/api/schema/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-colors"
              >
                Download Schema <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
