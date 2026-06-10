import { useState } from 'react'
import useAuthStore from '../store/authStore'
import './LoginForm.css'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const signIn = useAuthStore(state => state.signIn)
  const loading = useAuthStore(state => state.loading)
  const error = useAuthStore(state => state.error)
  const clearError = useAuthStore(state => state.clearError)

  const handleSubmit = (e) => {
    e.preventDefault()
    signIn(email.trim(), password)
  }

  return (
    <div className="login">
      <div className="login-card">
        <h1 className="login-title">2dos</h1>
        <p className="login-desc">Sign in to continue</p>
        {error && <p className="login-error">{error}</p>}
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            className="login-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => { setEmail(e.target.value); clearError() }}
            required
          />
          <input
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => { setPassword(e.target.value); clearError() }}
            required
          />
          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
