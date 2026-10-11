import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatusBadge from '../components/common/StatusBadge';

describe('StatusBadge component', () => {
  it('renders applied status label correctly', () => {
    render(<StatusBadge status="Applied" />);
    expect(screen.getByText('Applied')).toBeInTheDocument();
  });

  it('renders interview status label correctly', () => {
    render(<StatusBadge status="Interview" />);
    expect(screen.getByText('Interview')).toBeInTheDocument();
  });

  it('renders offer status label correctly', () => {
    render(<StatusBadge status="Offer" />);
    expect(screen.getByText('Offer')).toBeInTheDocument();
  });
});
