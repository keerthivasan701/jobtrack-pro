import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  CheckCircle2,
  TrendingUp,
  Calendar,
  Kanban,
  Shield,
  ArrowRight,
  Layers,
  Sparkles,
  Search,
  Zap,
  Mail,
  DollarSign,
  Clock,
  Video,
  Award,
  ChevronRight,
  Copy,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('pipeline'); // 'pipeline', 'followup', 'analytics', 'calendar'

  // Interactive Compensation Calculator State
  const [baseSalary, setBaseSalary] = useState(175000);
  const [bonusPercent, setBonusPercent] = useState(15);
  const [equityGrant, setEquityGrant] = useState(35000);
  const [stipend, setStipend] = useState(5000);

  const totalComp = Math.round(baseSalary + (baseSalary * (bonusPercent / 100)) + equityGrant + stipend);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">JobTrack</span>
              <span className="ml-1 text-xs font-semibold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-600 border border-indigo-200">
                PRO
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-500 bg-slate-100 rounded-lg border border-slate-200">
              <kbd className="font-semibold text-slate-700">⌘K</kbd> Quick Commands
            </span>

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm transition-all"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors px-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm shadow-indigo-600/25 transition-all active:scale-[0.98]"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-indigo-500/15 via-purple-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold uppercase tracking-wider mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
            The Intelligent Career & Application Operating System
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Stop losing job opportunities in{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-indigo-700">
              spreadsheets & notes
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Track applications from Wishlist to Offer, automate recruiter follow-ups, organize interview rounds, and evaluate offer packages with real-time momentum scoring.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={isAuthenticated ? "/dashboard" : "/register"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/25 transition-all transform hover:-translate-y-0.5 active:scale-[0.99]"
            >
              Start Free Today
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 text-base font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
            >
              Sign In with Demo User (1-Click)
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Private & user-isolated database
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Automated follow-up radar
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Command palette ⌘K power-bar
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Feature Sandbox Simulator */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full">
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden">
          {/* Top Interactive Tabs Bar */}
          <div className="border-b border-slate-200/80 bg-slate-50/70 p-2 sm:p-3 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5 px-2">
                <span className="w-3 h-3 rounded-full bg-rose-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
                JobTrack Pro Interactive Simulator
              </span>
            </div>

            <div className="flex items-center gap-1">
              {[
                { id: 'pipeline', label: '🎯 Kanban Board', icon: Kanban },
                { id: 'followup', label: '⚡ Follow-Up Assistant', icon: Mail },
                { id: 'analytics', label: '📊 Search Health Score', icon: TrendingUp },
                { id: 'calendar', label: '📅 Interview Hub', icon: Calendar },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      activeTab === tab.id
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-200/70'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Screen Display */}
          <div className="p-6 bg-slate-50/40 min-h-[380px] flex flex-col justify-center">
            {activeTab === 'pipeline' && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">Drag & Drop Pipeline Stages</h3>
                  <span className="text-xs text-indigo-600 font-semibold">6 Structured Hiring Steps</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
                      <span>Applied (2)</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-200/80 text-xs font-bold text-slate-900">
                      Full-Stack Engineer
                      <p className="font-normal text-slate-500 text-[11px]">Notion — $180k</p>
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-purple-600 uppercase">
                      <span>Assessment (1)</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-purple-50/60 border border-purple-200/80 text-xs font-bold text-slate-900">
                      Infrastructure Engineer
                      <p className="font-normal text-slate-500 text-[11px]">Datadog — HackerRank</p>
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-600 uppercase">
                      <span>Interview (2)</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-amber-50/60 border border-amber-200/80 text-xs font-bold text-slate-900">
                      Senior Staff Architect
                      <p className="font-normal text-slate-500 text-[11px]">Stripe — System Design</p>
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-emerald-600 uppercase">
                      <span>Offer (1)</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-emerald-50/60 border border-emerald-200/80 text-xs font-bold text-slate-900">
                      Lead Frontend Lead
                      <p className="font-normal text-slate-500 text-[11px]">Linear — $205,000 + Equity</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'followup' && (
              <div className="space-y-4 animate-fade-in max-w-2xl mx-auto w-full">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" /> AI / Template Follow-Up Generator
                  </span>
                  <span className="text-xs text-slate-500">1-Click Copy or Open Mail</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm text-xs space-y-2 text-slate-700 font-mono">
                  <div className="font-semibold text-slate-900 font-sans border-b pb-2">
                    Subject: Following up on Senior Full-Stack role at Stripe
                  </div>
                  <p className="font-sans leading-relaxed text-slate-600">
                    "Hi Sarah, I submitted my application for the Senior Full-Stack role at Stripe recently and wanted to reiterate my strong excitement about the team's mission. I'd love to share recent architecture samples if helpful..."
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <Check className="w-3.5 h-3.5" /> Auto-personalized recruiter names & role titles
                  </span>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-4 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-indigo-900 text-white flex flex-col justify-between">
                    <span className="text-xs font-bold uppercase text-indigo-300">Momentum Index</span>
                    <div className="text-3xl font-extrabold my-2">92 / 100</div>
                    <span className="text-[11px] text-indigo-200">Top 5% candidate velocity this month</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <span className="text-xs font-bold uppercase text-slate-400">Response Rate</span>
                    <div className="text-3xl font-extrabold text-slate-900 my-2">42%</div>
                    <span className="text-[11px] text-emerald-600 font-semibold">↑ 18% above industry average</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                    <span className="text-xs font-bold uppercase text-slate-400">Avg Decision Time</span>
                    <div className="text-3xl font-extrabold text-slate-900 my-2">8.4 Days</div>
                    <span className="text-[11px] text-slate-500">From screener to final round</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'calendar' && (
              <div className="space-y-3 animate-fade-in max-w-xl mx-auto w-full">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900">System Design Architecture Round</span>
                    <p className="text-[11px] text-slate-500">Stripe — Tomorrow at 2:00 PM</p>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center gap-1">
                    <Video className="w-3.5 h-3.5" /> Google Meet Ready
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-900">Edge Runtime Pair Programming</span>
                    <p className="text-[11px] text-slate-500">Vercel — Friday at 11:00 AM</p>
                  </div>
                  <span className="px-2.5 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center gap-1">
                    <Video className="w-3.5 h-3.5" /> Zoom Room Ready
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Interactive Compensation & Offer Evaluator Calculator */}
      <section className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4" /> Built-In Offer Evaluator
              </span>
              <h2 className="mt-2 text-3xl font-extrabold text-slate-900 tracking-tight">
                Calculate & Compare Total Annualized Compensation
              </h2>
              <p className="mt-4 text-slate-600 text-sm leading-relaxed">
                Base salary alone doesn't tell the whole story. Use JobTrack Pro's compensation evaluator to model equity vesting, performance bonuses, and remote stipends to negotiate with confidence.
              </p>

              <div className="mt-8 space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Base Salary: ${baseSalary.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="60000"
                    max="350000"
                    step="5000"
                    value={baseSalary}
                    onChange={(e) => setBaseSalary(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Annual Bonus Target: {bonusPercent}% (${Math.round(baseSalary * (bonusPercent / 100)).toLocaleString()})</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    step="5"
                    value={bonusPercent}
                    onChange={(e) => setBonusPercent(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Annualized Equity Grant: ${equityGrant.toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="150000"
                    step="5000"
                    value={equityGrant}
                    onChange={(e) => setEquityGrant(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Total Display Card */}
            <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[320px]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                  Estimated Total Annual Package
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Negotiation Ready
                </span>
              </div>

              <div className="my-6">
                <div className="text-5xl font-extrabold tracking-tight text-white">
                  ${totalComp.toLocaleString()}
                </div>
                <p className="text-xs text-indigo-200 mt-1">Total annualized value across all components</p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Base</span>
                  <span className="font-bold text-white">${(baseSalary / 1000).toFixed(0)}k</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Bonus</span>
                  <span className="font-bold text-white">${Math.round(baseSalary * (bonusPercent / 100) / 1000).toFixed(0)}k</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Equity</span>
                  <span className="font-bold text-white">${(equityGrant / 1000).toFixed(0)}k</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600">Built for Modern Job Seekers</h2>
            <p className="mt-2 text-3xl font-bold text-slate-900 tracking-tight">Everything You Need from Wishlist to Offer</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-5">
                <Kanban className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Interactive Pipeline Board</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Visual Kanban board structured by hiring stages: Wishlist, Applied, Assessment, Interview, Offer, and Rejected. Update statuses with a single click.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center mb-5">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Smart Interview Calendar</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Never miss an interview round. View upcoming rounds, reschedule on the fly, track meeting links, and record preparation notes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-5">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Actionable Real-time Analytics</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Interactive distribution charts and monthly velocity reports that help you measure conversion rates and optimize your applications.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-5">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Follow-Up Email Generator</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Auto-generate polite check-ins, post-interview thank you emails, and offer negotiation scripts with recruiter details pre-filled.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-5">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Strict Data Isolation</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                JWT-secured authentication with user-scoped database records. Your notes, salary targets, and applications remain 100% private.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mb-5">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">1-Click CSV Data Export</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Own your data. Export your entire career history, salaries, dates, and recruiter contact books to CSV at any time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-white to-slate-50 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            Ready to Take Command of Your Job Hunt?
          </h2>
          <p className="mt-4 text-base text-slate-600 max-w-xl mx-auto">
            Experience the productivity and clarity of JobTrack Pro. Free to get started.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/register"
              className="px-6 py-3.5 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all active:scale-[0.98]"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-slate-900 text-slate-400 py-10 border-t border-slate-800 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-400" />
            <span className="font-bold text-white">JobTrack Pro</span>
            <span className="text-xs text-slate-500">© 2026. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-xs">
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-white transition-colors">Register</Link>
            <a href="http://127.0.0.1:8000/api/docs/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
              API Documentation
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
