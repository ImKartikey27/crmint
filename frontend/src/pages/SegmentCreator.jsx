"use client"

import ErrorMessage from "../components/ErrorMessage"
import SuccessMessage from "../components/SuccessMessage"
import { segmentApi } from "../api"
import { useState } from "react"
import RuleBuilder from "../components/RuleBuilder"
import LoadingSpinner from "../components/LoadingSpinner"

function SegmentCreator({ onSave }) {
  const [segmentName, setSegmentName] = useState("")
  const [rules, setRules] = useState([
    { field: "spend", operator: ">", value: "" }
  ])
  const [condition, setCondition] = useState("AND")
  const [audienceSize, setAudienceSize] = useState(null)
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)
  const [isSaveLoading, setIsSaveLoading] = useState(false)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState("")

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
      const response = await segmentApi.previewSegment({
        rules,
        condition
      })
      setAudienceSize(response.audienceSize)
    } catch (err) {
      setError(err)
    } finally {
      setIsPreviewLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaveLoading(true)
      await segmentApi.saveCampaign({
        name: segmentName,
        rules: {
          conditionType: condition,
          conditions: rules
        },
        audienceSize
      })
      setSuccessMessage("Campaign saved successfully!")
      if (onSave) onSave()
    } catch (err) {
      setError(err)
    } finally {
      setIsSaveLoading(false)
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

  return (
    <div className="bg-white rounded-xl shadow-lg max-w-3xl mx-auto p-8">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Segment Name</label>
          <input
            type="text"
            value={segmentName}
            onChange={(e) => setSegmentName(e.target.value)}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200"
            placeholder="Enter segment name"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Match Type</label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="mt-1 block w-48 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200"
          >
            <option value="AND">Match ALL conditions</option>
            <option value="OR">Match ANY condition</option>
          </select>
        </div>

        <RuleBuilder rules={rules} setRules={setRules} />

        {error && <ErrorMessage message={error.message} />}
        {successMessage && <SuccessMessage message={successMessage} />}

        <div className="flex space-x-4 pt-4">
          <button
            onClick={handlePreview}
            disabled={isPreviewLoading}
            className="flex items-center justify-center px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed min-w-[180px]"
          >
            {isPreviewLoading ? (
              <>
                <LoadingSpinner size="small" className="mr-2" />
                <span>Calculating...</span>
              </>
            ) : (
              "Preview Audience Size"
            )}
          </button>

          {audienceSize !== null && (
            <button
              onClick={handleSave}
              disabled={isSaveLoading}
              className="flex items-center justify-center px-6 py-2.5 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed min-w-[180px]"
            >
              {isSaveLoading ? (
                <>
                  <LoadingSpinner size="small" className="mr-2" />
                  <span>Saving...</span>
                </>
              ) : (
                "Save Segment & Send Mails"
              )}
            </button>
          )}
        </div>

        {audienceSize !== null && (
          <div className="mt-6 p-5 bg-indigo-50 rounded-lg border border-indigo-100">
            <p className="text-sm text-indigo-900 flex items-center">
              <span className="font-semibold mr-2">Estimated audience size:</span>
              <span className="text-lg font-bold text-indigo-700">{audienceSize.toLocaleString()}</span>
              <span className="ml-2 text-indigo-600">customers</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default SegmentCreator