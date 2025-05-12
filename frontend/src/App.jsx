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
              
                <DashboardLayout />
              
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
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
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
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800">Audience Tool</h1>
              </div>
              <div className="ml-6 flex space-x-8">
                <button
                  onClick={() => navigateTo("segment-creator")}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    currentPage === "segment-creator"
                      ? "border-gray-800 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  Create Segment
                </button>
                <button
                  onClick={() => navigateTo("campaign-history")}
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    currentPage === "campaign-history"
                      ? "border-gray-800 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  Campaign History
                </button>
              </div>
            </div>
            <div className="flex items-center">
              <span className="mr-4 text-sm text-gray-700">{user?.email}</span>
              <button
                onClick={logout}
                className="text-sm text-gray-700 hover:text-gray-900"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && <ErrorMessage error={error} onRetry={handleRetry} />}

        {currentPage === "segment-creator" ? (
          <SegmentCreator onSave={addCampaign} />
        ) : (
          <CampaignHistory campaigns={campaigns} />
        )}
      </main>
    </div>
  )
}

export default App
