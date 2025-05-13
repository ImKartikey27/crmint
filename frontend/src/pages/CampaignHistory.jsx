"use client"

import { useState, useEffect } from "react"
import { segmentApi } from "../api"
import LoadingSpinner from "../components/LoadingSpinner"
import ErrorMessage from "../components/ErrorMessage"

function CampaignHistory({ campaigns: initialCampaigns = [] }) {
  const [campaigns, setCampaigns] = useState(initialCampaigns || [])
  const [insights, setInsights] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeInsightId, setActiveInsightId] = useState(null)

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await segmentApi.getCampaigns()
      setCampaigns(res.message.campaigns)
    } catch (err) {
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }

  const getCampaignInsights = async (id) => {
    setActiveInsightId(id)
    setIsLoading(true)
    setError(null)

    try {
      const res = await segmentApi.getInsights(id)
      const cleaned = await res.message.insights
        .replace(/brbr/g, '\n\n')
        .replace(/br/g, '\n')
        .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-indigo-700">$1</strong>')
        .replace(/\*(.+?)\*(?!\*)/g, '<em class="text-indigo-600">$1</em>')
      setInsights(cleaned)
    } catch (error) {
      setError(error)
    } finally {
      setIsLoading(false)
      setActiveInsightId(null)
    }
  }

  const handleRetry = () => {
    fetchCampaigns()
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (isLoading && campaigns.length === 0) {
    return (
      <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
        <h2 className="text-2xl font-bold text-indigo-900 mb-6 flex items-center">
          <span className="w-2 h-8 bg-indigo-500 rounded mr-3"></span>
          Campaign History
        </h2>
        <div className="flex justify-center items-center py-16">
          <LoadingSpinner size="large" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-indigo-900 mb-6 flex items-center">
        <span className="w-2 h-8 bg-indigo-500 rounded mr-3"></span>
        Campaign History
      </h2>

      <ErrorMessage error={error} onRetry={handleRetry} />

      {!isLoading && !error && campaigns.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <div className="inline-block p-4 bg-indigo-100 rounded-full mb-4">
            <svg className="h-10 w-10 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-lg font-medium text-indigo-900">No campaigns created yet</p>
          <p className="text-gray-600 mt-2">Create your first campaign to get started</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Campaign Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created Date
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Audience Size
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sent
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Failed
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(campaigns) && campaigns.map((campaign) => (
                <tr key={campaign.name} className="hover:bg-indigo-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-900">
                    {campaign.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {formatDate(campaign.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span className="font-medium">{campaign.audienceSize.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {(campaign.stats.sent || 0).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {(campaign.stats.failed || 0).toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      className={`${
                        activeInsightId === campaign._id
                          ? "bg-indigo-600 text-white"
                          : "bg-indigo-100 text-indigo-700 hover:bg-indigo-500 hover:text-white"
                      } px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50`}
                      onClick={() => getCampaignInsights(campaign._id)}
                      disabled={isLoading}
                    >
                      {activeInsightId === campaign._id ? (
                        <span className="flex items-center">
                          <LoadingSpinner size="small" className="mr-2" />
                          Loading...
                        </span>
                      ) : (
                        "Get Insights"
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {insights && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-indigo-900 mb-3">Campaign Insights</h3>
          <div className="p-6 bg-gradient-to-r from-indigo-50 to-white rounded-xl border border-indigo-100 shadow-inner text-sm text-gray-700 whitespace-pre-wrap leading-relaxed animate-fadeIn"
            dangerouslySetInnerHTML={{ __html: insights }}
          />
        </div>
      )}
    </div>
  )
}

export default CampaignHistory