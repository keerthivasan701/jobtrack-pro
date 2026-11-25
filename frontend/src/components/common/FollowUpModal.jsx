import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Copy, Check, Send } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const TEMPLATES = [
  {
    id: 'checkin',
    title: '1-Week Status Follow-Up',
    subject: (app) => `Following up on ${app.job_title} application — [Your Name]`,
    body: (app, user) => `Hi ${app.recruiter_name || 'Hiring Team'},

I hope you are having a wonderful week.

I submitted my application for the ${app.job_title} role at ${app.company_name} recently and wanted to reiterate my strong excitement about the opportunity. 

Given my background and passion for ${app.company_name}'s mission, I believe I can bring immediate value to the team. Please let me know if there are any additional materials, portfolio samples, or references I can share.

Thank you very much for your time and consideration!

Best regards,
${user?.first_name ? `${user.first_name} ${user.last_name || ''}` : '[Your Name]'}
${user?.profile?.phone_number || ''}
${user?.profile?.linkedin_url || ''}`,
  },
  {
    id: 'thankyou',
    title: 'Post-Interview Thank You Note',
    subject: (app) => `Thank you for the conversation — ${app.job_title} role at ${app.company_name}`,
    body: (app, user) => `Hi ${app.recruiter_name || 'Interview Team'},

Thank you so much for taking the time to speak with me today about the ${app.job_title} position.

I really enjoyed learning more about ${app.company_name}'s current technical challenges and goals. Our discussion reinforced my enthusiasm for joining the team and contributing toward your upcoming milestones.

Looking forward to hearing about the next steps. Please let me know if you need any further information from my side.

Warm regards,
${user?.first_name ? `${user.first_name} ${user.last_name || ''}` : '[Your Name]'}
${user?.email || ''}`,
  },
  {
    id: 'negotiate',
    title: 'Offer Acknowledgment & Negotiation',
    subject: (app) => `Appreciation & discussion regarding the offer for ${app.job_title} — ${app.company_name}`,
    body: (app, user) => `Hi ${app.recruiter_name || 'Hiring Team'},

Thank you so much for extending the offer to join ${app.company_name} as ${app.job_title}! I am thrilled about the prospect of working with the team.

I have reviewed the offer details carefully. Based on my industry experience, target compensation research, and the responsibilities of the role, I would like to discuss whether there is flexibility in the base salary / equity component to bring it closer to ${app.salary_range || '$[Target Number]'}.

I am very excited about this role and confident we can reach a package that is a great fit for both of us. Could we set up a brief call to discuss this week?

Thank you again for your support throughout this process!

Best regards,
${user?.first_name ? `${user.first_name} ${user.last_name || ''}` : '[Your Name]'}`,
  },
];

const FollowUpModal = ({ isOpen, onClose, application, user }) => {
  const toast = useToast();
  const [selectedTemplate, setSelectedTemplate] = useState(TEMPLATES[0].id);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (application) {
      const template = TEMPLATES.find((t) => t.id === selectedTemplate) || TEMPLATES[0];
      setSubject(template.subject(application));
      setBody(template.body(application, user));
      setCopied(false);
    }
  }, [application, selectedTemplate, user]);

  if (!application) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`);
    setCopied(true);
    toast.success('Email draft copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenMailClient = () => {
    const to = application.recruiter_email || '';
    const mailtoUrl = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoUrl, '_blank');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Smart Follow-Up Email Assistant" maxWidth="max-w-2xl">
      <div className="space-y-4">
        {/* Template Selector Pills */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Select Email Purpose
          </label>
          <div className="flex flex-wrap gap-2">
            {TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                onClick={() => setSelectedTemplate(tmpl.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedTemplate === tmpl.id
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {tmpl.title}
              </button>
            ))}
          </div>
        </div>

        {/* Recruiter info banner */}
        <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between text-xs">
          <div>
            <span className="font-semibold text-indigo-900">Target Role:</span>{' '}
            <span className="text-slate-700">{application.job_title} at {application.company_name}</span>
          </div>
          {application.recruiter_email ? (
            <span className="text-indigo-700 font-mono bg-white px-2 py-0.5 rounded border border-indigo-200">
              {application.recruiter_email}
            </span>
          ) : (
            <span className="text-slate-400 italic">No recruiter email recorded</span>
          )}
        </div>

        {/* Subject Line */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Subject Line
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Message Body */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
            Email Content
          </label>
          <textarea
            rows="8"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans leading-relaxed"
          ></textarea>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl shadow-sm transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy to Clipboard'}
            </button>

            <button
              type="button"
              onClick={handleOpenMailClient}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/25 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              Open in Mail App
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default FollowUpModal;
