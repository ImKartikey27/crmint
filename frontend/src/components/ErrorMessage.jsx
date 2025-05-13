"use client"

import { formatErrorMessage, getErrorType, ErrorType } from "../utils/error-handler"

function ErrorMessage({ error, onRetry }) {
  if (!error) return null

  const errorMessage = formatErrorMessage(error)
  const errorType = getErrorType(error)

  return (
    <div className="rounded-xl bg-red-50 p-6 my-4 border border-red-100 shadow-sm animate-fadeIn">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg 
            className="h-6 w-6 text-red-400" 
            viewBox="0 0 20 20" 
            fill="currentColor" 
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-semibold text-red-800">
            {errorType === ErrorType.NETWORK ? 'Connection Error' :
             errorType === ErrorType.API ? 'Server Error' : 'Error'}
          </h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{errorMessage}</p>
          </div>

          {(errorType === ErrorType.NETWORK || errorType === ErrorType.API) && onRetry && (
            <div className="mt-4">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center px-4 py-2 rounded-lg bg-white text-red-700 border border-red-300 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors duration-200 shadow-sm"
              >
                <svg 
                  className="w-4 h-4 mr-2" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" 
                    clipRule="evenodd"
                  />
                </svg>
                Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ErrorMessage