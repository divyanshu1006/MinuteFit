import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: string }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: '' };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[MinuteFit Error]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0E1F19', color: '#ffffff', padding: '20px', textAlign: 'center', fontFamily: 'sans-serif' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '12px' }}>Something went wrong</h2>
          <p style={{ color: '#8BAAA0', fontSize: '14px', marginBottom: '20px', maxWidth: '400px' }}>{this.state.error || 'Failed to load interface.'}</p>
          <button
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            style={{ padding: '12px 24px', backgroundColor: '#27B68C', color: '#ffffff', border: 'none', borderRadius: '24px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Clear Cache & Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
)

// Safe Service Worker Registration
if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('[MinuteFit SW] Service worker registration ignored:', err);
    });
  });
}
