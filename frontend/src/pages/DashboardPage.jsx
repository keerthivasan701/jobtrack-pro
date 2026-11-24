import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import {
  Briefcase,
  CheckCircle,
  Calendar,
  XCircle,
  Clock,
  Plus,
  ArrowRight,
  TrendingUp,
  Building,
  Video,
  Award,
  Sparkles,
  Zap,
  Mail,
  Download,
  AlertTriangle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { applicationsApi } from '../api/client';
import { formatDate, getRelativeDays } from '../utils/formatters';
import { exportApplicationsToCSV } from '../utils/csvExport';
import StatusBadge from '../components/common/StatusBadge';
import { StatCardSkeleton } from '../components/common/SkeletonLoader';
import EmptyState from '../components/common/EmptyState';

const DashboardPage = () => {
  const { onOpenQuickAdd, onOpenFollowUp, refreshKey } = useOutletContext();
  const [stats, setStats] = useState(null);
  const [allApps, setAllApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStatsAndApps = async () => {
    try {
      setLoading(true);
      setError(null);
      const [statsRes, appsRes] = await Promise.all([
        applicationsApi.getStats(),
        applicationsApi.allItems(),
      ]);
      setStats(statsRes.data);
      setAllApps(appsRes.data || []);
    } catch (err) {
      setError('Failed to load dashboard statistics. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatsAndApps();
  }, [refreshKey]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-72 bg-white rounded-2xl border border-slate-200/80 shadow-sm animate-pulse" />
          <div className="h-72 bg-white rounded-2xl border border-slate-200/80 shadow-sm animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-center">
        <p className="font-semibold">{error}</p>
        <button
          onClick={fetchStatsAndApps}
          className="mt-3 px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-semibold hover:bg-rose-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const {
    total_applications = 0,
    status_counts = {},
    interviews_scheduled = 0,
    status_distribution = [],
    monthly_trend = [],
    recent_applications = [],
    upcoming_interviews = [],
  } = stats || {};

  // Compute Job Search Momentum / Health Score (0 - 100)
  const interviewCount = status_counts.interview || 0;
  const offerCount = status_counts.offer || 0;
  const appliedCount = status_counts.applied || 0;
  let momentumScore = 50;
  if (total_applications > 0) {
    const interviewRate = ((interviewCount + offerCount) / total_applications) * 100;
    momentumScore = Math.min(
      98,
      Math.round(40 + interviewRate * 0.9 + Math.min(total_applications * 3, 25))
    );
  }

  // Identify applications needing recruiter follow-up (applied > 5 days ago)
  const now = new Date();
  const followUpRequired = allApps
    .filter((app) => {
      if (app.status !== 'Applied' && app.status !== 'Assessment') return false;
      const appDate = new Date(app.application_date);
      const diffDays = Math.floor((now - appDate) / (1000 * 60 * 60 * 24));
      return diffDays >= 5;
    })
    .slice(0, 3);

  const statCards = [
    {
      title: 'Total Applications',
      value: total_applications,
      icon: Briefcase,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50 border-indigo-100',
      subtext: 'Tracked in your system',
    },
    {
      title: 'Active Applied',
      value: status_counts.applied || 0,
      icon: Clock,
      color: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-100',
      subtext: 'Awaiting recruiter feedback',
    },
    {
      title: 'Interviews Scheduled',
      value: interviews_scheduled || status_counts.interview || 0,
      icon: Calendar,
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-100',
      subtext: 'Upcoming & active rounds',
    },
    {
      title: 'Offers Received',
      value: status_counts.offer || 0,
      icon: Award,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-100',
      subtext: 'Negotiations & decisions',
    },
    {
      title: 'Archived / Rejected',
      value: status_counts.rejected || 0,
      icon: XCircle,
      color: 'text-rose-600',
      bg: 'bg-rose-50 border-rose-100',
      subtext: 'Closed positions',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header / Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Executive Dashboard</h2>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              Live Real-Time
            </span>
          </div>
          <p className="text-sm text-slate-500">
            Real-time pipeline progression, readiness score, and automated follow-ups.
          </p>
        </div>
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => exportApplicationsToCSV(allApps)}
            title="Download CSV report of all applications"
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
          >
            <Download className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
          <Link
            to="/pipeline"
            className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
          >
            Kanban Board
          </Link>
          <button
            onClick={onOpenQuickAdd}
            className="flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            Add Application
          </button>
        </div>
      </div>

      {/* Unique Highlight Banner: Pipeline Health Meter & Follow-Up Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Momentum & Health Score */}
        <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 p-5 rounded-2xl text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 w-36 h-36 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" /> Search Health Score
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {momentumScore >= 80 ? 'Optimal Pace' : 'Active Momentum'}
            </span>
          </div>

          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-4xl font-extrabold tracking-tight text-white">{momentumScore}</span>
            <span className="text-sm font-semibold text-indigo-300">/ 100</span>
          </div>

          <div className="w-full bg-slate-800 rounded-full h-2 mb-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${momentumScore}%` }}
            />
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {offerCount > 0
              ? `Outstanding performance! You have ${offerCount} active offer on the table.`
              : interviewCount > 0
              ? `High conversion momentum with ${interviewCount} interview stage positions active.`
              : `Steady progress. Keep applying and following up to trigger interview rounds.`}
          </p>
        </div>

        {/* Follow-Up Radar: Automated Outreach Suggestions */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Follow-Up Urgency Radar</h3>
                <p className="text-xs text-slate-400">Applications waiting &gt;5 days without recruiter update</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
              {followUpRequired.length} Due for Outreach
            </span>
          </div>

          {followUpRequired.length === 0 ? (
            <div className="py-4 text-center text-xs text-slate-500 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              ✨ All your active applications are up-to-date! No pending follow-ups required.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {followUpRequired.map((app) => (
                <div
                  key={app.id}
                  className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/90 flex flex-col justify-between text-xs"
                >
                  <div>
                    <p className="font-bold text-slate-900 truncate">{app.job_title}</p>
                    <p className="text-slate-500 text-[11px] truncate mb-2">{app.company_name}</p>
                    <span className="text-[10px] text-amber-700 bg-amber-100/60 px-1.5 py-0.5 rounded font-medium">
                      Applied {getRelativeDays(app.application_date)}
                    </span>
                  </div>
                  <button
                    onClick={() => onOpenFollowUp && onOpenFollowUp(app)}
                    className="mt-3 w-full py-1.5 px-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 shadow-xs transition-colors"
                  >
                    <Mail className="w-3 h-3" /> Draft Follow-up
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 5 Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-xl border ${card.bg}`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">{card.value}</div>
              <p className="text-xs text-slate-400 mt-1">{card.subtext}</p>
            </div>
          );
        })}
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Donut Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Application Status Distribution</h3>
              <p className="text-xs text-slate-400">Proportion of applications across hiring stages</p>
            </div>
          </div>

          {total_applications === 0 ? (
            <EmptyState
              title="No data to analyze"
              description="Add your first job application to populate status distribution analytics."
              actionText="Add Application"
              onAction={onOpenQuickAdd}
            />
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={status_distribution.filter((d) => d.count > 0)}
                    dataKey="count"
                    nameKey="status"
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                  >
                    {status_distribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs shadow-lg">
                            <span className="font-semibold">{data.status}</span>: {data.count} ({data.percentage}%)
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-3 mt-2">
                {status_distribution.map((item) => (
                  <div key={item.status} className="flex items-center gap-1.5 text-xs text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span>{item.status}: {item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Applications by Month Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Applications by Month</h3>
              <p className="text-xs text-slate-400">Application submission velocity over recent months</p>
            </div>
          </div>

          {monthly_trend.length === 0 || total_applications === 0 ? (
            <EmptyState
              title="No application velocity recorded"
              description="Apply to positions to monitor your monthly search momentum."
            />
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthly_trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis allowDecimals={false} stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <Tooltip
                    cursor={{ fill: '#f8fafc' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs shadow-lg">
                            <p className="font-semibold">{data.period}</p>
                            <p className="text-indigo-300">{data.count} Applications</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Two Column Section: Recent Applications & Upcoming Interviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recently Added Applications (2 Cols) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recently Added Applications</h3>
              <p className="text-xs text-slate-400">Latest roles logged in your system</p>
            </div>
            <Link
              to="/applications"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {recent_applications.length === 0 ? (
            <EmptyState
              title="No recent applications"
              description="Click Quick Add or Add Application to log your first job lead."
              actionText="Quick Add"
              onAction={onOpenQuickAdd}
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 pl-1">Company & Role</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Work Mode</th>
                    <th className="pb-3">Applied</th>
                    <th className="pb-3 text-right pr-1">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recent_applications.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition-colors group">
                      <td className="py-3.5 pl-1">
                        <Link to={`/applications/${app.id}`} className="font-semibold text-slate-900 hover:text-indigo-600">
                          {app.job_title}
                        </Link>
                        <p className="text-xs text-slate-500">{app.company_name}</p>
                      </td>
                      <td className="py-3.5">
                        <StatusBadge status={app.status} size="sm" />
                      </td>
                      <td className="py-3.5 text-xs text-slate-600">{app.work_mode}</td>
                      <td className="py-3.5 text-xs text-slate-500">{formatDate(app.application_date)}</td>
                      <td className="py-3.5 text-right pr-1">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onOpenFollowUp && onOpenFollowUp(app)}
                            title="Draft follow-up email"
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>
                          <Link
                            to={`/applications/${app.id}`}
                            className="px-2.5 py-1 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors inline-block"
                          >
                            Details
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Upcoming Interviews Widget (1 Col) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-slate-900">Upcoming Interviews</h3>
              <p className="text-xs text-slate-400">Scheduled rounds and calls</p>
            </div>
            <Link
              to="/calendar"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
            >
              Calendar
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {upcoming_interviews.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState
                icon={Calendar}
                title="No upcoming interviews"
                description="Scheduled interview rounds will appear here automatically."
              />
            </div>
          ) : (
            <div className="space-y-3 flex-1 overflow-y-auto">
              {upcoming_interviews.map((iv) => (
                <div
                  key={iv.id}
                  className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{iv.title}</h4>
                      <p className="text-xs text-slate-600">
                        {iv.application_details?.company_name} — {iv.application_details?.job_title}
                      </p>
                    </div>
                    <span className="text-xs font-medium px-2 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-200/60">
                      {iv.interview_type}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(iv.interview_date, true)}
                    </span>
                    {iv.location_or_link && (
                      <a
                        href={iv.location_or_link.startsWith('http') ? iv.location_or_link : `https://${iv.location_or_link}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-indigo-600 hover:underline font-semibold"
                      >
                        <Video className="w-3 h-3" />
                        Meeting Link
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
