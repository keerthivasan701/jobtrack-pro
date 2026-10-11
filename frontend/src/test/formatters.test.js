import { describe, it, expect } from 'vitest';
import { formatDate, getRelativeDays } from '../utils/formatters';

describe('formatters utility', () => {
  it('formats dates into readable format', () => {
    const formatted = formatDate('2026-05-15');
    expect(formatted).toContain('2026');
    expect(formatted).toContain('May');
  });

  it('handles null or empty date gracefully', () => {
    expect(formatDate(null)).toBe('—');
    expect(formatDate('')).toBe('—');
  });

  it('computes relative days for today', () => {
    const today = new Date().toISOString().split('T')[0];
    expect(getRelativeDays(today)).toBe('Today');
  });
});
