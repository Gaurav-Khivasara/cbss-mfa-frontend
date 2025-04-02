"use client"

import { useState } from "react"
import { useAuth } from "../context/AuthContext"

function MfaVerification() {
  const { verifyMfa } = useAuth()
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await verifyMfa(code)
    } catch (err) {
      setError("Invalid verification code")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>Two-Factor Authentication</h2>
        <p className="text-gray">Enter the code from your authenticator app to continue.</p>
      </div>

      <div className="card-content">
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              id="verification-code"
              placeholder="Enter code from your authenticator app"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="form-input"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full" disabled={isLoading}>
            {isLoading ? "Verifying..." : "Verify"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default MfaVerification;