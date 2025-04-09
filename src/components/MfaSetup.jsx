"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"

function MfaSetup() {
  const { setupMfa, verifyMfa } = useAuth()
  const [qrCode, setQrCode] = useState("")
  const [secret, setSecret] = useState("")
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchMfaSetup = async () => {
      try {
        const { qrCode, secret } = await setupMfa()
        setQrCode(qrCode)
        setSecret(secret)
      } catch (err) {
        setError("Failed to set up MFA")
      }
    }

    fetchMfaSetup()
  }, [setupMfa])

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
        <h2>Set up Two-Factor Authentication</h2>
        <p className="text-gray">Scan the QR code with your authenticator app to enhance your account security.</p>
      </div>

      <div className="card-content">
        {error && <div className="alert alert-error">{error}</div>}

        <div className="text-center mb-6">
          {qrCode && (
            <div className="flex-center mb-4">
              <img
                src={qrCode || "/placeholder.svg"}
                alt="QR Code for MFA"
                style={{ height: "200px", width: "200px" }}
              />
            </div>
          )}

          <p className="text-sm text-gray mb-2">If you can't scan the QR code, enter this code manually in your app:</p>
          <code>{secret}</code>
        </div>

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
            {isLoading ? "Verifying..." : "Verify and Enable"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray">After authenticating up MFA, you'll be able to access your account securely.</p>
        </div>
      </div>
    </div>
  )
}

export default MfaSetup;