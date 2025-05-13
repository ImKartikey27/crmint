"use client"

import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider, useAuth } from "./context/AuthContext"
import SegmentCreator from "./pages/SegmentCreator"
import CampaignHistory from "./pages/CampaignHistory"
import Login from "./components/Login"
import { segmentApi } from "./api"
import ErrorMessage from "./components/ErrorMessage"
import LoadingSpinner from "./components/LoadingSpinner"

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

// Protected Layout Component
function DashboardLayout() {
  const { user, logout } = useAuth()
  const [currentPage, setCurrentPage] = useState("segment-creator")
  const [campaigns, setCampaigns] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const data = await segmentApi.getCampaigns()
      setCampaigns(data)
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }

  const navigateTo = (page) => {
    setCurrentPage(page)
  }

  const addCampaign = (campaign) => {
    setCampaigns([campaign, ...campaigns])
    navigateTo("campaign-history")
  }

  const handleRetry = () => {
    fetchCampaigns()
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-indigo-50">
      <nav className="bg-white shadow-md backdrop-blur-lg bg-opacity-90 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
                  Audience Tool
                </h1>
              </div>
              <div className="ml-10 flex space-x-4">
                <button
                  onClick={() => navigateTo("segment-creator")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 ${
                    currentPage === "segment-creator"
                      ? "bg-indigo-100 text-indigo-700 shadow-inner"
                      : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                  }`}
                >
                  Create Segment
                </button>
                <button
                  onClick={() => navigateTo("campaign-history")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ease-in-out transform hover:scale-105 ${
                    currentPage === "campaign-history"
                      ? "bg-indigo-100 text-indigo-700 shadow-inner"
                      : "text-gray-600 hover:text-indigo-600 hover:bg-indigo-50"
                  }`}
                >
                  Campaign History
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="px-4 py-2 text-sm text-gray-600 bg-gray-50 rounded-lg">
                {user?.email}
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-white hover:bg-red-500 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6">
            <ErrorMessage error={error} onRetry={handleRetry} />
          </div>
        )}

        <div className="transition-all duration-300 ease-in-out">
          {currentPage === "segment-creator" ? (
            <SegmentCreator onSave={addCampaign} />
          ) : (
            <CampaignHistory campaigns={campaigns} />
          )}
        </div>
      </main>
    </div>
  )
}

export default App
