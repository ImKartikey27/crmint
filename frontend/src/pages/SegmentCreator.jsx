"use client"

import { useState } from "react"
import RuleBuilder from "../components/RuleBuilder"
import LoadingSpinner from "../components/LoadingSpinner"
import ErrorMessage from "../components/ErrorMessage"
import SuccessMessage from "../components/SuccessMessage"
import { segmentApi } from "../api"

function SegmentCreator({ onSave }) {
  const [segmentName, setSegmentName] = useState("")
  const [rules, setRules] = useState([
    { id: 1, type: "condition", field: "spend", operator: ">", value: "", connector: "AND" },
  ])
  const [audienceSize, setAudienceSize] = useState(null)

  // API state
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)
  const [isSaveLoading, setIsSaveLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState("")

  // Abort controller for cancelling API requests
  const abortControllerRef = useState(new AbortController())[0]

  const handlePreview = async () => {
    if (!segmentName.trim()) {
      setError(new Error("Please enter a segment name"))
      return
    }

    if (!isValidRules()) {
      setError(new Error("Please complete all rule conditions"))
      return
    }

    setIsPreviewLoading(true)
    setError(null)

    try {
      // Cancel any in-flight requests
      abortControllerRef.abort()
      const newController = new AbortController()
      abortControllerRef.signal = newController.signal

      // Call the API
      const response = await segmentApi.previewSegment(rules)
      setAudienceSize(response.audienceSize)
      setSuccessMessage("Audience size calculated successfully")

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("")
      }, 3000)
    } catch (err) {
      setError(err)
      setAudienceSize(null)
    } finally {
      setIsPreviewLoading(false)
    }
  }

  const isValidRules = () => {
    return rules.every((rule) => {
      if (rule.type === "condition") {
        return rule.field && rule.operator && rule.value
      }
      return true
    })
  }

  const handleSave = async () => {
    if (!segmentName.trim()) {
      setError(new Error("Please enter a segment name"))
      return
    }

    if (!isValidRules()) {
      setError(new Error("Please complete all rule conditions"))
      return
    }

    if (audienceSize === null) {
      setError(new Error("Please preview the audience size first"))
      return
    }

    setIsSaveLoading(true)
    setError(null)

    try {
      const campaign = {
        name: segmentName,
        rules,
        audienceSize,
      }

      // Call the API
      const savedCampaign = await segmentApi.saveCampaign(campaign)

      // Add created date from server response or use current date
      savedCampaign.createdAt = savedCampaign.createdAt || new Date()

      // Call the onSave callback with the saved campaign
      onSave(savedCampaign)

      setSuccessMessage("Campaign saved successfully")
    } catch (err) {
      setError(err)
    } finally {
      setIsSaveLoading(false)
    }
  }

  const handleRetry = () => {
    setError(null)
    if (audienceSize === null) {
      handlePreview()
    }
  }

  const handleDismissSuccess = () => {
    setSuccessMessage("")
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Audience Segment</h2>

      <ErrorMessage error={error} onRetry={handleRetry} />
      <SuccessMessage message={successMessage} onDismiss={handleDismissSuccess} />

      <div className="mb-6">
        <label htmlFor="segmentName" className="block text-sm font-medium text-gray-700 mb-1">
          Segment Name
        </label>
        <input
          type="text"
          id="segmentName"
          value={segmentName}
          onChange={(e) => setSegmentName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500"
          placeholder="Enter segment name"
        />
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Audience Rules</h3>
        <RuleBuilder rules={rules} setRules={setRules} />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <button
          onClick={handlePreview}
          disabled={isPreviewLoading}
          className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 flex items-center justify-center"
        >
          {isPreviewLoading ? (
            <>
              <LoadingSpinner size="small" className="mr-2" />
              Calculating...
            </>
          ) : (
            "Preview Audience Size"
          )}
        </button>

        {audienceSize !== null && (
          <div className="text-center sm:text-right">
            <span className="text-sm text-gray-500">Estimated audience size:</span>
            <span className="ml-2 text-lg font-bold text-gray-800">{audienceSize.toLocaleString()}</span>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={!segmentName || audienceSize === null || isSaveLoading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 flex items-center justify-center"
        >
          {isSaveLoading ? (
            <>
              <LoadingSpinner size="small" className="mr-2" />
              Saving...
            </>
          ) : (
            "Save Segment"
          )}
        </button>
      </div>
    </div>
  )
}

export default SegmentCreator
