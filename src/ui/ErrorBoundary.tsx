import { Component, type ErrorInfo, type ReactNode } from 'react';
import { STORAGE_KEY } from '../features/pet/constants';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('BitBuddy runtime error caught by ErrorBoundary:', error, errorInfo);
  }

  handleRestart = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('bitbuddy:intro_pending');
    } catch {
      /* ignore */
    }
    window.location.href = '/';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            textAlign: 'center',
            background: '#0d0a26',
            color: '#f4e8c1',
            fontFamily: "'Courier New', Consolas, monospace",
          }}
        >
          <div
            style={{
              padding: '32px 24px',
              background: '#1a1340',
              border: '3px solid #ff5a6e',
              boxShadow: '0 6px 0 #0a0820',
              maxWidth: '400px',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                color: '#ff5a6e',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                border: '1px solid #ff5a6e',
                padding: '2px 8px',
              }}
            >
              System Glitch
            </span>
            <h1
              style={{
                fontSize: '1.4rem',
                color: '#ffd86b',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              BitBuddy Paused
            </h1>
            <p
              style={{
                fontSize: '0.8rem',
                color: '#b3a8d9',
                lineHeight: '1.4',
              }}
            >
              A glitch occurred while rendering. You can retry or start fresh.
            </p>
            <div
              style={{
                display: 'flex',
                gap: '12px',
                marginTop: '8px',
                width: '100%',
              }}
            >
              <button
                type="button"
                onClick={this.handleReload}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#2a1f5a',
                  color: '#f4e8c1',
                  border: '2px solid #0a0820',
                  boxShadow: '0 3px 0 #0a0820',
                  fontFamily: 'inherit',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Retry
              </button>
              <button
                type="button"
                onClick={this.handleRestart}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#ff5a6e',
                  color: '#0a0820',
                  border: '2px solid #0a0820',
                  boxShadow: '0 3px 0 #0a0820',
                  fontFamily: 'inherit',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Start Fresh
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
