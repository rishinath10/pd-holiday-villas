import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Keeps a render crash in one widget from blanking the whole site. Guests
 * still get the WhatsApp number, which is the fallback booking path.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Render error:', error, info.componentStack);
    window.dataLayer?.push({
      event: 'exception',
      description: error.message,
      fatal: true,
    });
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eafdff] px-4">
        <div className="max-w-md w-full text-center space-y-5 bg-white rounded-3xl p-8 shadow-soft border border-orange-100">
          <div className="w-14 h-14 rounded-2xl bg-[#FF7E5F]/15 text-[#FF7E5F] flex items-center justify-center mx-auto">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div className="space-y-2">
            <h1 className="font-['Cormorant_Garamond',serif] text-2xl font-bold text-[#1A2A2B]">
              Something went wrong
            </h1>
            <p className="text-sm text-slate-500">
              Sorry about that. Reloading usually fixes it — or reach us directly and
              we'll take your booking over WhatsApp.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 px-5 py-3 rounded-full bg-[#FF7E5F] hover:bg-[#a53b22] text-white text-sm font-bold transition-colors flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reload page
            </button>
            <a
              href="https://wa.me/60123552585"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-5 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-[#1A2A2B] text-sm font-bold transition-colors flex items-center justify-center"
            >
              WhatsApp us
            </a>
          </div>
        </div>
      </div>
    );
  }
}
