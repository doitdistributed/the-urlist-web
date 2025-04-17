/// <reference types="vitest" />

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { CreateList } from './CreateList';

// Mock window.location
const originalLocation = window.location;
beforeAll(() => {
  // @ts-ignore
  delete window.location;
  // @ts-ignore
  window.location = { href: '' };
});
afterAll(() => {
  // @ts-ignore
  window.location = originalLocation;
});

describe('CreateList', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    // Reset window.location.href for test isolation
    window.location.href = '';
  });

  it('renders the form fields', () => {
    render(<CreateList />);
    expect(screen.getByPlaceholderText('Enter a title for your list')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Custom URL (optional)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add a description (optional)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create/i })).toBeInTheDocument();
  });

  it('submits the form and redirects on success', async () => {
    const mockFetch = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => ({ slug: 'testslug' })
    } as any);

    render(<CreateList />);
    fireEvent.change(screen.getByPlaceholderText('Enter a title for your list'), { target: { value: 'My List' } });
    fireEvent.change(screen.getByPlaceholderText('Custom URL (optional)'), { target: { value: 'custom-url' } });
    fireEvent.change(screen.getByPlaceholderText('Add a description (optional)'), { target: { value: 'desc' } });
    fireEvent.click(screen.getByRole('button', { name: /create/i }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/lists', expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ title: 'My List', description: 'desc', slug: 'custom-url' })
      }));
      expect(window.location.href).toBe('/list/testslug');
    });
  });

  it('shows loading state when submitting', async () => {
    const mockFetch = vi.spyOn(global, 'fetch').mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({ ok: true, json: async () => ({ slug: 'slug' }) }), 100)) as any
    );
    render(<CreateList />);
    fireEvent.change(screen.getByPlaceholderText('Enter a title for your list'), { target: { value: 'My List' } });
    fireEvent.click(screen.getByRole('button', { name: /create/i }));
    expect(screen.getByRole('button', { name: /creating list/i })).toBeDisabled();
    mockFetch.mockRestore();
  });

  it('handles API errors gracefully', async () => {
    const mockFetch = vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: false,
      json: async () => ({ message: 'Something went wrong' })
    } as any);
    render(<CreateList />);
    fireEvent.change(screen.getByPlaceholderText('Enter a title for your list'), { target: { value: 'My List' } });
    fireEvent.click(screen.getByRole('button', { name: /create/i }));
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
      // No redirect should happen
      expect(window.location.href).toBe('');
    });
    mockFetch.mockRestore();
  });
});
