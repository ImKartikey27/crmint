"use client"

function SuccessMessage({ message, onDismiss }) {
  if (!message) return null

  return (
    <div className="rounded-xl bg-emerald-50 p-4 my-4 animate-fadeIn">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-emerald-800">{message}</p>
          {onDismiss && (
            <div className="mt-4">
              <button
                type="button"
                onClick={onDismiss}
                className="rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-800 hover:bg-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:ring-offset-2 transition-colors duration-200"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SuccessMessage