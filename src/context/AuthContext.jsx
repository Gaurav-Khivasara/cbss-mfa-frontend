"use client"
import axios from "axios"
import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext(undefined)

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    isRegistered: false,
    needsEmailVerification: false,
    needsLogin: false,
    needsMfaSetup: false,
    needsMfaVerification: false,
  })

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const storedUser = localStorage.getItem("user")
        const isRegistered = localStorage.getItem("isRegistered") === "true"

        if (storedUser) {
          const user = JSON.parse(storedUser)
          setAuthState({
            user,
            isLoading: false,
            isAuthenticated: user.mfaEnabled, // Only fully authenticated if MFA is verified
            isRegistered: true,
            needsEmailVerification: false,
            needsLogin: false,
            needsMfaSetup: false,
            needsMfaVerification: !user.mfaEnabled,
          })
        } else {
          setAuthState((prev) => ({
            ...prev,
            isLoading: false,
            isRegistered,
          }))
        }
      } catch (error) {
        console.error("Auth check failed:", error)
        setAuthState((prev) => ({ ...prev, isLoading: false }))
      }
    }

    checkAuth()
  }, [])

  const login = async (name, password) => {
    const user = { name, password }
    // console.log("login")
    const response = await axios.post(
      import.meta.env.VITE_API_URL + ":" + import.meta.env.VITE_PORT + "/api/auth/login",
      user,
      { withCredentials: true }
    )

    // console.log("response:", response.data)

    // await new Promise((resolve) => setTimeout(resolve, 1000))

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
      isAuthenticated: false,
      isRegistered: true,
      needsEmailVerification: false,
      needsLogin: false,
      needsMfaSetup: true, // After login, user needs to set up MFA
      needsMfaVerification: false,
    })
  }

  const signup = async (name, email, password) => {
    const user = { name, email, password }
    // console.log("singup")
    const response = await axios.post(
      import.meta.env.VITE_API_URL + ":" + import.meta.env.VITE_PORT + "/api/auth/register",
      user,
      { withCredentials: true }
    )

    // console.log("response:", response.data)

    // await new Promise((resolve) => setTimeout(resolve, 1000))

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
      isAuthenticated: false,
      isRegistered: false,
      needsEmailVerification: true,
      needsLogin: false,
      needsMfaSetup: false,
      needsMfaVerification: false,
    })
  }

  const verifyEmail = async (code) => {
    // console.log("verifyEmail")
    const response = await axios.post(
      import.meta.env.VITE_API_URL + ":" + import.meta.env.VITE_PORT + "/api/auth/verifyEmail",
      { code },
      { withCredentials: true }
    )

    // console.log("response:", response.data)

    // await new Promise((resolve) => setTimeout(resolve, 1000))

    // Update user
    if (authState.user) {
      const updatedUser = {
        ...authState.user,
        emailVerified: true,
      }

      localStorage.setItem("user", JSON.stringify(updatedUser))
      localStorage.setItem("isRegistered", "true")

      // After email verification, user needs to log in
      localStorage.removeItem("user")

      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        isRegistered: true,
        needsEmailVerification: false,
        needsLogin: true,
        needsMfaSetup: false,
        needsMfaVerification: false,
      })
    }
  }

  const setupMfa = async () => {
    // console.log("setupMfa", JSON.parse(localStorage.getItem("user")))
    const response = await axios.post(
      import.meta.env.VITE_API_URL + ":" + import.meta.env.VITE_PORT + "/api/auth/2fa/setup",
      JSON.parse(localStorage.getItem("user")),
      { withCredentials: true }
    )

    // console.log("response:", response)

    // await new Promise((resolve) => setTimeout(resolve, 1000))

    // return {
    //   qrCode:
    //     "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMyAyMyI+PHBhdGggZmlsbD0iIzAwMDAwMCIgZD0iTTEgMWgyMXYyMUgxeiIvPjxwYXRoIGZpbGw9IiNmZmZmZmYiIGQ9Ik0yIDJoMTl2MTlIMnoiLz48cGF0aCBkPSJNMyAzaDN2M0gzem0xMCAwaDN2M2gtM3ptLTEwIDEwaDN2M0gzem0yLTJoMXYxSDV6bTIgMGgxdjFIN3ptMiAwaDF2MUg5em0yIDBoMXYxaC0xem0yIDBoMXYxaC0xem0yIDBoMXYxaC0xem0yIDBoMXYxaC0xem0tMTAgMmgxdjFINXptMiAwaDF2MUg3em0yIDBoMXYxSDl6bTIgMGgxdjFoLTF6bTIgMGgxdjFoLTF6bTIgMGgxdjFoLTF6bTIgMGgxdjFoLTF6bS0xMCAyaDN2M2gtM3ptMTAgMGgzdjNoLTN6Ii8+PC9zdmc+",
    //   secret: "ABCDEFGHIJKLMNOP",
    // }
    return {
      qrCode: response.data.qrCode,
      secret: response.data.secret
    }
  }

  const verifyMfa = async (code) => {
    const response = await axios.post(
      import.meta.env.VITE_API_URL + ":" + import.meta.env.VITE_PORT + "/api/auth/2fa/verify",
      { "token": code },
      { withCredentials: true }
    )

    // console.log("res: " + response)

    // await new Promise((resolve) => setTimeout(resolve, 1000))

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
        isRegistered: true,
        needsEmailVerification: false,
        needsLogin: false,
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
      isRegistered: localStorage.getItem("isRegistered") === "true",
      needsEmailVerification: false,
      needsLogin: false,
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

