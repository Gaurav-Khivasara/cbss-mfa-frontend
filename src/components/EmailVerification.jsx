"use client"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"

function EmailVerification() {
  const { verifyEmail, user } = useAuth()
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await verifyEmail(code)
    } catch (err) {
      setError("Invalid verification code")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>Verify your email</h2>
        <p className="text-gray">We've sent a verification code to {user?.email}. Please enter it below.</p>
      </div>

      <div className="card-content">
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              id="verification-code"
              placeholder="Enter verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray">After verification, you'll need to log in to your account.</p>
        </div>
      </div>

      <div className="card-footer text-center">
        <span className="text-sm text-gray">Didn't receive a code?</span>
        <button className="btn btn-link ml-2">Resend</button>
      </div>
    </div>
  )
}

export default EmailVerification;