import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LanguageProvider } from '../LanguageContext';
import ContactForm from '../components/ContactForm';

// Mock mockService submitContact
vi.mock('../api/mockService', () => ({
  submitContact: vi.fn(() => Promise.resolve({
    success: true,
    data: { id: 'msg-test-123', date: '2026-07-01' }
  }))
}));

describe('ContactForm Integration tests', () => {
  it('renders all core fields using language-agnostic IDs', () => {
    render(
      <LanguageProvider>
        <ContactForm />
      </LanguageProvider>
    );

    expect(screen.getByTestId('input-name') || document.getElementById('input-name')).toBeInTheDocument();
    expect(screen.getByTestId('input-email') || document.getElementById('input-email')).toBeInTheDocument();
    expect(screen.getByTestId('select-service') || document.getElementById('select-service')).toBeInTheDocument();
    expect(screen.getByTestId('select-budget') || document.getElementById('select-budget')).toBeInTheDocument();
    expect(screen.getByTestId('textarea-message') || document.getElementById('textarea-message')).toBeInTheDocument();
  });

  it('triggers validation errors for incomplete submissions', async () => {
    render(
      <LanguageProvider>
        <ContactForm />
      </LanguageProvider>
    );

    const submitBtn = screen.getByTestId('submit-contact-btn') || document.getElementById('submit-contact-btn');
    if (submitBtn) {
      fireEvent.click(submitBtn);
    }

    // Since validation is asynchronous in react-hook-form, we wait for displayed errors
    await waitFor(() => {
      const errorMsg = screen.queryByText(/أحرف/i) || screen.queryByText(/characters/i);
      expect(errorMsg).toBeInTheDocument();
    }, { timeout: 1500 });
  });
});
