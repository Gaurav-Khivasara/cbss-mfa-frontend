"use client"

import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function HomePage() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="page">
      <div className="container">
        <div className="card">
          <div className="card-header">
            <h2>Welcome, {user?.name}!</h2>
            <p className="text-gray">You have successfully logged in with multi-factor authentication.</p>
          </div>

          <div className="card-content">
            <div className="alert alert-success mb-4">
              <div className="flex">
                <svg className="mr-2" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Your account is secure with multi-factor authentication.</span>
              </div>
            </div>

            <div className="alert alert-info">
              <div className="flex">
                <svg className="mr-2" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>User: {user?.name}</span>
              </div>
            </div>
          </div>

          <div className="card-footer">
            <button onClick={handleLogout} className="btn btn-primary btn-full">
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage;