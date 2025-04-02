"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import EmailVerification from "./EmailVerification"
import MfaSetup from "./MfaSetup"
import MfaVerification from "./MfaVerification"

function AuthFlow() {
  const navigate = useNavigate()
  const { isLoading, isAuthenticated, needsEmailVerification, needsMfaSetup, needsMfaVerification } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate("/login")
      } else if (!needsEmailVerification && !needsMfaSetup && !needsMfaVerification) {
        navigate("/home")
      }
    }
  }, [isLoading, isAuthenticated, needsEmailVerification, needsMfaSetup, needsMfaVerification, navigate])

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