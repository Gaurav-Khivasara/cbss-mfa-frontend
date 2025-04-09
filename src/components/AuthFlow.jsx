"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import EmailVerification from "./EmailVerification"
import MfaSetup from "./MfaSetup"
import MfaVerification from "./MfaVerification"

function AuthFlow() {
  const navigate = useNavigate()
  const {
    isLoading,
    isAuthenticated,
    isRegistered,
    needsEmailVerification,
    needsLogin,
    needsMfaSetup,
    needsMfaVerification,
  } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // If fully authenticated, go to home
        navigate("/home")
      } else if (needsLogin || (!isRegistered && !needsEmailVerification)) {
        // If needs login or not registered, go to login page
        navigate("/login")
      }
    }
  }, [
    isLoading,
    isAuthenticated,
    isRegistered,
    needsEmailVerification,
    needsLogin,
    needsMfaSetup,
    needsMfaVerification,
    navigate,
  ])

  if (isLoading) {
    return (
      <div className="page">
        <div className="text-center">
          <div className="spinner"></div>
          <p className="mt-4 text-gray">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="container">
        {needsEmailVerification && <EmailVerification />}
        {needsMfaSetup && <MfaSetup />}
        {needsMfaVerification && <MfaVerification />}
      </div>
    </div>
  )
}

export default AuthFlow;