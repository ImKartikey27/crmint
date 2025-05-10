// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"

// Helper function for API requests
async function apiRequest(endpoint, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint}`

    // Default headers
    const headers = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    const config = {
      ...options,
      headers,
    }

    const response = await fetch(url, config)

    // Check if the request was successful
    if (!response.ok) {
      // Try to get error message from response
      let errorMessage
      try {
        const errorData = await response.json()
        errorMessage = errorData.message || `API error: ${response.status}`
      } catch (e) {
        errorMessage = `API error: ${response.status}`
      }
      throw new Error(errorMessage)
    }

    // Parse JSON response
    const data = await response.json()
    return data
  } catch (error) {
    console.error("API request failed:", error)
    throw error
  }
}

// API endpoints
export const segmentApi = {
  // Preview audience size based on segment rules
  previewSegment: (rules) => {
    return apiRequest("/api/preview-segment", {
      method: "POST",
      body: JSON.stringify({ rules }),
    })
  },

  // Save a new campaign with segment rules
  saveCampaign: (campaign) => {
    return apiRequest("/api/save-campaign", {
      method: "POST",
      body: JSON.stringify(campaign),
    })
  },

  // Get all campaigns
  getCampaigns: () => {
    return apiRequest("/api/campaigns", {
      method: "GET",
    })
  },

  // Get a single campaign by ID
  getCampaign: (id) => {
    return apiRequest(`/api/campaigns/${id}`, {
      method: "GET",
    })
  },
}
