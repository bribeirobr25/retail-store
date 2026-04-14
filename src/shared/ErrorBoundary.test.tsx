import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from './ErrorBoundary';

function Boom(): never {
  throw new Error('boom!');
}

function Safe() {
  return <p>safe content</p>;
}

describe('ErrorBoundary', () => {
  // React logs caught errors to console.error in dev mode. Suppress to keep
  // test output clean — we still verify the boundary's own console.error
  // call separately.
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <Safe />
      </ErrorBoundary>,
    );

    expect(screen.getByText('safe content')).toBeInTheDocument();
  });

  it('renders the default fallback when a child throws', () => {
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    );

    expect(screen.getByRole('heading', { name: /something went wrong/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reload/i })).toBeInTheDocument();
  });

  it('logs the caught error via console.error', () => {
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    );

    // The boundary's own [ErrorBoundary] log is one of several console.error
    // calls (React itself also logs). Verify our message is there.
    const calls = consoleErrorSpy.mock.calls.flat();
    expect(calls.some((arg) => typeof arg === 'string' && arg.includes('[ErrorBoundary] caught'))).toBe(true);
  });

  it('renders a custom fallback when provided', () => {
    render(
      <ErrorBoundary fallback={<p>custom fallback</p>}>
        <Boom />
      </ErrorBoundary>,
    );

    expect(screen.getByText('custom fallback')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /something went wrong/i })).not.toBeInTheDocument();
  });

  it('does not render the fallback when children are error-free', () => {
    render(
      <ErrorBoundary>
        <Safe />
      </ErrorBoundary>,
    );

    expect(screen.queryByRole('heading', { name: /something went wrong/i })).not.toBeInTheDocument();
  });
});
