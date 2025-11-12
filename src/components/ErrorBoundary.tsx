import React, { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full">
            <div className="rounded-2xl border border-red-500/20 bg-red-950/20 p-8 text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Something went wrong
              </h1>
              <p className="text-white/60 mb-6">
                The app encountered an unexpected error. Don't worry, your data is safe.
              </p>

              {this.state.error && (
                <div className="mb-6 p-4 rounded-lg bg-black/40 border border-white/10 text-left">
                  <div className="text-xs font-mono text-red-400 break-all">
                    {this.state.error.message}
                  </div>
                </div>
              )}

              <button
                onClick={() => window.location.href = '/'}
                className="w-full rounded-xl bg-white hover:bg-white/90 px-6 py-3 text-black font-bold transition-all hover:scale-[1.02] active:scale-95"
              >
                Return to Home
              </button>

              <button
                onClick={() => window.location.reload()}
                className="w-full mt-3 rounded-xl border border-white/20 hover:border-white/40 hover:bg-white/5 px-6 py-3 text-white/80 hover:text-white font-medium transition-all"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
