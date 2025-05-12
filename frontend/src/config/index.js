// Environment variables configuration
const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || "https://panicky-lora-kartikeysangal-connect-d32e97b6.koyeb.app",
  environment: import.meta.env.MODE,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
}

export default config
