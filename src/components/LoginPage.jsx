"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function LoginPage() {
  const navigate = useNavigate()
  const { login, signup, isAuthenticated } = useAuth()
  const [activeTab, setActiveTab] = useState("login")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate("/auth-flow")
    return null
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await login(formData.name, formData.password)
      navigate("/auth-flow")
    } catch (err) {
      setError("Invalid name or password")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      // console.log("name:", formData.name)
      // console.log("email:", formData.email)
      // console.log("password:", formData.password)
      await signup(formData.name, formData.email, formData.password)
      navigate("/auth-flow")
    } catch (err) {
      setError("Failed to create account")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div className="card">
          <div className="tabs">
            <button className={`tab ${activeTab === "login" ? "active" : ""}`} onClick={() => setActiveTab("login")}>
              Login
            </button>
            <button className={`tab ${activeTab === "signup" ? "active" : ""}`} onClick={() => setActiveTab("signup")}>
              Sign Up
            </button>
          </div>

          <div className="card-content">
            {error && <div className="alert alert-error">{error}</div>}

            <div className={`tab-content ${activeTab === "login" ? "active" : ""}`}>
              <form onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Username
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="form-input"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <div className="flex space-between">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <a href="#" className="text-sm text-gray">
                      Forgot password?
                    </a>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="form-input"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </button>
              </form>
            </div>

            <div className={`tab-content ${activeTab === "signup" ? "active" : ""}`}>
              <form onSubmit={handleSignup}>
                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    className="form-input"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="signup-email" className="form-label">
                    Email
                  </label>
                  <input
                    id="signup-email"
                    name="email"
                    type="email"
                    required
                    className="form-input"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="signup-password" className="form-label">
                    Password
                  </label>
                  <input
                    id="signup-password"
                    name="password"
                    type="password"
                    required
                    className="form-input"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirm-password" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type="password"
                    required
                    className="form-input"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Sign Up"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage;