// Error types
export const ErrorType = {
  NETWORK: "network",
  API: "api",
  VALIDATION: "validation",
  UNKNOWN: "unknown",
}

// Format error message for display
export function formatErrorMessage(error) {
  if (error.name === "AbortError") {
    return "Request was cancelled"
  }

  if (error.message.includes("Failed to fetch") || error.message.includes("Network request failed")) {
    return "Network error. Please check your connection and try again."
  }

  return error.message || "An unexpected error occurred"
}

// Determine error type
export function getErrorType(error) {
  if (
    error.name === "AbortError" ||
    error.message.includes("Failed to fetch") ||
    error.message.includes("Network request failed")
  ) {
    return ErrorType.NETWORK
  }

  if (error.message.includes("API error")) {
    return ErrorType.API
  }

  if (error.message.includes("validation")) {
    return ErrorType.VALIDATION
  }

  return ErrorType.UNKNOWN
}
