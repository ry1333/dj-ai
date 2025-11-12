import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import AppShell from './AppShell'
import Stream from './pages/Stream'
import DJ from './pages/DJ'
import Create from './pages/Create'
import Learn from './pages/Learn'
import Profile from './pages/Profile'
import AuthPage from './pages/Auth'
import Onboarding from './pages/Onboarding'
import './index.css'

function Router({ children }: { children: React.ReactNode }) {
  return import.meta.env.DEV ? <BrowserRouter>{children}</BrowserRouter> : <HashRouter>{children}</HashRouter>
}

// Default to stream in prod
if (!import.meta.env.DEV && !location.hash) { location.replace('#/stream') }

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Stream />} />
            <Route path="/stream" element={<Stream />} />
            <Route path="/dj" element={<DJ />} />
            <Route path="/create" element={<DJ />} />
            <Route path="/compose" element={<Create />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="*" element={<Navigate to="/stream" replace />} />
          </Route>
        </Routes>
      </Router>
    </ErrorBoundary>
  </React.StrictMode>
)
