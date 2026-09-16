import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReload = () => {
    localStorage.clear();
    window.location.reload();
  };

  override render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl border border-rose-500/30 bg-slate-900 p-6 text-center shadow-2xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-500/20 text-rose-400">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h2 className="text-xl font-bold text-white font-display">
              Kuna hitilafu imetokea / Something went wrong
            </h2>
            <p className="mt-2 text-xs text-slate-400">
              {this.state.error?.message || 'Hitilafu ya muda kwenye mfumo.'}
            </p>
            <button
              onClick={this.handleReload}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-indigo-500"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Anzisha Upya / Reload App</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
