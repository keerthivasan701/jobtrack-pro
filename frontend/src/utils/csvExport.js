/**
 * Utility to export an array of applications to a CSV spreadsheet file
 */
export const exportApplicationsToCSV = (applications) => {
  if (!applications || applications.length === 0) return;

  const headers = [
    'Job Title',
    'Company Name',
    'Status',
    'Work Mode',
    'Employment Type',
    'Salary Range',
    'Application Date',
    'Interview Date',
    'Recruiter Name',
    'Recruiter Email',
    'Company Website',
    'Job URL',
    'Notes',
  ];

  const escapeCSV = (val) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = applications.map((app) => [
    escapeCSV(app.job_title),
    escapeCSV(app.company_name),
    escapeCSV(app.status),
    escapeCSV(app.work_mode),
    escapeCSV(app.employment_type),
    escapeCSV(app.salary_range),
    escapeCSV(app.application_date),
    escapeCSV(app.interview_date),
    escapeCSV(app.recruiter_name),
    escapeCSV(app.recruiter_email),
    escapeCSV(app.company_website),
    escapeCSV(app.job_url),
    escapeCSV(app.notes),
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `JobTrack_Applications_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
