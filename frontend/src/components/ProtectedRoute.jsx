"use client"

import { useAuth } from "../context/AuthContext"
import { Navigate } from "react-router-dom"
import LoadingSpinner from "./LoadingSpinner"

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-white">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-sm text-indigo-600 animate-pulse">Loading your session...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute