import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-brand-gray p-4">
          <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center border border-brand-border">
            <div className="mx-auto bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-brand-black mb-2">Something went wrong</h2>
            <p className="text-brand-textMuted text-sm mb-6">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            <Button onClick={() => window.location.reload()} variant="primary" className="w-full">
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}