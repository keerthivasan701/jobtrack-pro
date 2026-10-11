import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowLeft, Home, Compass } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center px-4 font-sans text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-6 shadow-sm">
        <Compass className="w-8 h-8 animate-spin-slow" />
      </div>

      <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">404 Error</span>
      <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
        Page Not Found
      </h1>
      <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-md">
        The page you are looking for doesn’t exist or has been moved to another location.
      </p>

      <div className="mt-8 flex items-center gap-3">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 transition-all"
        >
          <Home className="w-4 h-4" />
          Dashboard
        </Link>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Home Page
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
