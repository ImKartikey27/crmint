function LoadingSpinner({ size = "medium", className = "" }) {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-6 w-6",
    large: "h-8 w-8"
  }

  const sizeClass = sizeClasses[size] || sizeClasses.medium

  return (
    <div className={`inline-flex ${className}`}>
      <div className={`${sizeClass} border-2 border-current border-r-transparent rounded-full animate-spin text-current`} />
    </div>
  )
}

export default LoadingSpinner