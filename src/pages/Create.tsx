import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Create() {
  const nav = useNavigate()
  const location = useLocation()

  // Redirect to DJ studio immediately
  useEffect(() => {
    // Preserve any query parameters (like remix=xyz)
    nav('/dj' + location.search, { replace: true })
  }, [nav, location.search])

  // Show loading state briefly while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-ink">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan mx-auto mb-4"></div>
        <p className="text-muted">Loading DJ Studio...</p>
      </div>
    </div>
  )
}
