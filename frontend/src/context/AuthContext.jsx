"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check authentication status when component mounts
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("https://panicky-lora-kartikeysangal-connect-d32e97b6.koyeb.app/api/auth/check", {
        credentials: "include" // Important for cookies
      })
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      }
    } catch (error) {
      console.error("Auth check failed:", error)
    } finally {
      setLoading(false)
    }
  }

 const logout = async () => {
  try {
    const res = await fetch("https://panicky-lora-kartikeysangal-connect-d32e97b6.koyeb.app/api/auth/logout", {
      credentials: "include"
    });

    if (res.ok) {
      setUser(null)
      window.location.href = "https://crmint-sigma.vercel.app/login"
    } else {
      console.error("Logout failed with status:", res.status);
    }
  } catch (error) {
    console.error("Logout failed:", error);
  }
};


  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)