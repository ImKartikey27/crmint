// Environment variables configuration
const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000",
  environment: import.meta.env.MODE,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
}

export default config
