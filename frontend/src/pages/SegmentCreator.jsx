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
  const [condition, setCondition] = useState("AND") // New state for overall condition
  const [audienceSize, setAudienceSize] = useState(null)

  // API state
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
        condition // Send both rules and condition
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
    <div className="space-y-6 max-w-3xl mx-auto p-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Segment Name</label>
        <input
          type="text"
          value={segmentName}
          onChange={(e) => setSegmentName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Match Type</label>
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="AND">Match ALL conditions</option>
          <option value="OR">Match ANY condition</option>
        </select>
      </div>

      <RuleBuilder rules={rules} setRules={setRules} />

      {error && <ErrorMessage message={error.message} />}
      {successMessage && <SuccessMessage message={successMessage} />}

      <div className="flex space-x-4">
        <button
          onClick={handlePreview}
          disabled={isPreviewLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
          <button
            onClick={handleSave}
            disabled={isSaveLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {isSaveLoading ? (
              <>
                <LoadingSpinner size="small" className="mr-2" />
                Saving...
              </>
            ) : (
              "Save Segment and Send Mail"
            )}
          </button>
        )}
      </div>

      {audienceSize !== null && (
        <div className="mt-4 p-4 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">
            Estimated audience size: <span className="font-medium">{audienceSize}</span> customers
          </p>
        </div>
      )}
    </div>
  )
}

export default SegmentCreator
