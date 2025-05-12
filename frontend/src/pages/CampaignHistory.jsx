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

  useEffect(() => {
    // If we have campaigns passed as props, use those
    // if (initialCampaigns.length > 0) {
    //   setCampaigns(initialCampaigns)
    //   return
    // }

    // Otherwise, fetch campaigns from the API
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
    setIsLoading(true)
    setError(null)

    try {
      const res = await segmentApi.getInsights(id)
      const cleaned = await res.message.insights
        .replace(/brbr/g, '\n\n')   // double line breaks for readability
        .replace(/br/g, '\n')       // handle any remaining 'br'
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')  // bold text with **
        .replace(/\*(.+?)\*(?!\*)/g, '<strong>$1</strong>'); // bold text with single *
      setInsights(cleaned)
    } catch (error) {
      setError(error)
    } finally {
      setIsLoading(false)
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

  if (isLoading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Campaign History</h2>
        <div className="flex justify-center items-center py-12">
          <LoadingSpinner size="large" />
        </div>
      </div>
    )
  }


  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Campaign History</h2>

      <ErrorMessage error={error} onRetry={handleRetry} />

      {!isLoading && !error && campaigns.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No campaigns created yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Campaign Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Audience Size
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Sent
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Failed
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(campaigns) && campaigns.map((campaign) => (
                <tr key={campaign.name} className="hover:bg-gray-100 transition duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{campaign.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(campaign.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {campaign.audienceSize.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(campaign.stats.sent || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm flex gap-4 items-center text-gray-500">
                    {(campaign.stats.failed || 0).toLocaleString()}
                    <button
                      className="bg-green-500 text-white hover:bg-green-600 hover:cursor-pointer px-3 py-1 rounded-lg shadow-sm transition duration-200"
                      onClick={() => { getCampaignInsights(campaign._id) }}
                    >
                      Get Insights
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div
        className="mt-6 p-4 bg-gray-100 rounded-lg shadow-inner text-sm text-gray-700 whitespace-pre-wrap"
        dangerouslySetInnerHTML={{ __html: insights || '' }}
      />
    </div>
  )
}

export default CampaignHistory
