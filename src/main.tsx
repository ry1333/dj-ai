import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AppShell from './AppShell'
import Listen from './pages/Listen'
import Learn from './pages/Learn'
import Profile from './pages/Profile'
import Create from './pages/Create' // uses your existing Create page
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Listen />} />
          <Route path="/listen" element={<Listen />} />
          <Route path="/create" element={<Create />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/listen" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
