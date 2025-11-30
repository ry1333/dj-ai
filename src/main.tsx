import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import ProtectedRoute from './components/ProtectedRoute'
import { MixerProvider } from './contexts/MixerContext'
import AppShell from './AppShell'
import Stream from './pages/Stream'
import DJ from './pages/DJ'
import DJStudio from './pages/DJStudio'
import ProStudio from './pages/ProStudio'
import Create from './pages/Create'
import Learn from './pages/Learn'
import Profile from './pages/Profile'
import AuthPage from './pages/Auth'
import Onboarding from './pages/Onboarding'
import Admin from './pages/Admin'
import './index.css'

function Router({ children }: { children: React.ReactNode }) {
  return import.meta.env.DEV ? <BrowserRouter>{children}</BrowserRouter> : <HashRouter>{children}</HashRouter>
}

// Default to stream in prod
if (!import.meta.env.DEV && !location.hash) { location.replace('#/stream') }

// Register service worker for PWA
if ('serviceWorker' in navigator && !import.meta.env.DEV) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      console.log('Service worker registration failed')
    })
  })
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <MixerProvider>
        <Router>
          <Routes>
            <Route element={<AppShell />}>
              <Route index element={<Stream />} />
              <Route path="/stream" element={<Stream />} />
              <Route path="/dj" element={<ProtectedRoute><DJ /></ProtectedRoute>} />
              <Route path="/dj-new" element={<ProtectedRoute><DJStudio /></ProtectedRoute>} />
              <Route path="/pro-studio" element={<ProtectedRoute><ProStudio /></ProtectedRoute>} />
              <Route path="/create" element={<ProtectedRoute><Create /></ProtectedRoute>} />
              <Route path="/compose" element={<ProtectedRoute><Create /></ProtectedRoute>} />
              <Route path="/learn" element={<Learn />} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/stream" replace />} />
            </Route>
          </Routes>
        </Router>
      </MixerProvider>
    </ErrorBoundary>
  </React.StrictMode>
)
