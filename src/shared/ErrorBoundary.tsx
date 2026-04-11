import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  /** Optional custom fallback. Defaults to a friendly "Reload" screen. */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * App-root error boundary. Catches uncaught render errors and shows a
 * friendly fallback instead of a blank white page. Logs the error to the
 * console — Phase 1 will swap the console call for Sentry or similar.
 *
 * Inline styles are used in the default fallback because if the React tree
 * is broken, Tailwind classes may not have been applied yet.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary] caught', error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (this.props.fallback) {
      return this.props.fallback;
    }

    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          background: 'linear-gradient(135deg, #fdfcfb 0%, #e2d1f9 100%)',
        }}
      >
        <div
          style={{
            maxWidth: '480px',
            width: '100%',
            background: 'white',
            border: '2px solid #f3e8ff',
            borderRadius: '24px',
            padding: '32px',
            boxShadow: '0 10px 25px -5px rgba(227, 0, 79, 0.15)',
            textAlign: 'center',
          }}
        >
          <h1 style={{ color: '#c026d3', margin: '0 0 16px 0', fontSize: '24px' }}>
            Something went wrong
          </h1>
          <p style={{ color: '#4b5563', lineHeight: 1.6, margin: '0 0 24px 0' }}>
            The app hit an unexpected error. Reloading the page usually fixes it.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              background: 'linear-gradient(to right, #ec4899, #a855f7)',
              color: 'white',
              border: 'none',
              padding: '12px 32px',
              borderRadius: '999px',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}
