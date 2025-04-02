"use client"
import axios from "axios"
import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    needsEmailVerification: false,
    needsMfaSetup: false,
    needsMfaVerification: false,
  })

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        // In a real app, you would check session/token validity here
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          const user = JSON.parse(storedUser)
          setAuthState({
            user,
            isLoading: false,
            isAuthenticated: true,
            needsEmailVerification: !user.emailVerified,
            needsMfaSetup: user.emailVerified && !user.mfaEnabled,
            needsMfaVerification: user.emailVerified && user.mfaEnabled,
          })
        } else {
          setAuthState((prev) => ({ ...prev, isLoading: false }))
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        setAuthState((prev) => ({ ...prev, isLoading: false }))
      }
    }

    checkAuth()
  }, [])

  const login = async (name, password) => {
    // HERE !! {
    const user = {name, password}
    console.log("login")
    const response = await axios.post(
      "http://localhost:7001/api/auth/login",
      user,
      {withCredentials: true}
    )
    
    console.log("response:", response.data)
    
    // Simulate API call
    // await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock user - in a real app, this would come from your backend
    // const user = {
    //   id: "1",
    //   name: "Test User",
    //   email,
    //   emailVerified: true, // Set to false to test email verification flow
    //   mfaEnabled: true, // Set to false to test MFA setup flow
    // }

    localStorage.setItem("user", JSON.stringify(user))

    setAuthState({
      user,
      isLoading: false,
      isAuthenticated: true,
      needsEmailVerification: !user.emailVerified,
      needsMfaSetup: user.emailVerified && !user.mfaEnabled,
      needsMfaVerification: user.emailVerified && user.mfaEnabled,
    })
  }

  const signup = async (name, email, password) => {
    // HERE !!
    const user = {name, email, password}
    console.log("singup")
    const response = await axios.post(
      "http://localhost:7001/api/auth/register",
      user,
      {withCredentials: true}
    )
  
    console.log("response:", response.data)

    // Simulate API call
    // await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock user - in a real app, this would come from your backend
    // const user = {
    //   id: "1",
    //   name,
    //   email,
    //   emailVerified: false,
    //   mfaEnabled: false,
    // }

    localStorage.setItem("user", JSON.stringify(user))

    setAuthState({
      user,
      isLoading: false,
      isAuthenticated: true,
      needsEmailVerification: true,
      needsMfaSetup: false,
      needsMfaVerification: false,
    })
  }

  const verifyEmail = async (code) => {
    // HERE !!
    

    // Simulate API call
    // await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update user
    if (authState.user) {
      const updatedUser = {
        ...authState.user,
        emailVerified: true,
      }

      localStorage.setItem("user", JSON.stringify(updatedUser))

      setAuthState({
        user: updatedUser,
        isLoading: false,
        isAuthenticated: true,
        needsEmailVerification: false,
        needsMfaSetup: true,
        needsMfaVerification: false,
      })
    }
  }

  const setupMfa = async () => {
    // HERE !!
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // In a real app, this would come from your backend
    // The backend would generate a secret and QR code for the user
    return {
      qrCode:
        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMyAyMyI+PHBhdGggZmlsbD0iIzAwMDAwMCIgZD0iTTEgMWgyMXYyMUgxeiIvPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Ik0yIDJoMTl2MTlIMnoiLz48cGF0aCBkPSJNMyAzaDN2M0gzem0xMCAwaDN2M2gtM3ptLTEwIDEwaDN2M0gzem0yLTJoMXYxSDV6bTIgMGgxdjFIN3ptMiAwaDF2MUg5em0yIDBoMXYxaC0xem0yIDBoMXYxaC0xem0yIDBoMXYxaC0xem0yIDBoMXYxaC0xem0tMTAgMmgxdjFINXptMiAwaDF2MUg3em0yIDBoMXYxSDl6bTIgMGgxdjFoLTF6bTIgMGgxdjFoLTF6bTIgMGgxdjFoLTF6bTIgMGgxdjFoLTF6bS0xMCAyaDN2M2gtM3ptMTAgMGgzdjNoLTN6Ii8+PC9zdmc+",
      secret: "ABCDEFGHIJKLMNOP",
    }
  }

  const verifyMfa = async (code) => {
    // HERE !!
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update user
    if (authState.user) {
      const updatedUser = {
        ...authState.user,
        mfaEnabled: true,
      }

      localStorage.setItem("user", JSON.stringify(updatedUser))

      setAuthState({
        user: updatedUser,
        isLoading: false,
        isAuthenticated: true,
        needsEmailVerification: false,
        needsMfaSetup: false,
        needsMfaVerification: false,
      })
    }
  }

  const logout = () => {
    localStorage.removeItem("user")
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      needsEmailVerification: false,
      needsMfaSetup: false,
      needsMfaVerification: false,
    })
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        signup,
        verifyEmail,
        setupMfa,
        verifyMfa,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

