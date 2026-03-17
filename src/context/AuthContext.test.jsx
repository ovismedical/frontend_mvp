/**
 * Tests for AuthContext — login, logout, token validation.
 */
import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, act, waitFor } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext.jsx'
import { setAuthToken, clearAuthToken } from '../__tests__/factories.js'

// Helper component that displays auth state
function AuthDisplay() {
  const { user, isAuthLoading, isAuthenticated, login, logout } = useAuth()
  return (
    <div>
      <span data-testid="loading">{String(isAuthLoading)}</span>
      <span data-testid="authenticated">{String(isAuthenticated)}</span>
      <span data-testid="username">{user?.username ?? 'none'}</span>
      <button onClick={() => login({ username: 'manual' })}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('starts in loading state', () => {
    render(
      <AuthProvider>
        <AuthDisplay />
      </AuthProvider>
    )
    // Initially loading
    expect(screen.getByTestId('loading').textContent).toBe('true')
  })

  it('authenticates when valid token exists', async () => {
    setAuthToken()
    render(
      <AuthProvider>
        <AuthDisplay />
      </AuthProvider>
    )
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })
    expect(screen.getByTestId('authenticated').textContent).toBe('true')
    expect(screen.getByTestId('username').textContent).toBe('testpatient')
  })

  it('is unauthenticated when no token', async () => {
    clearAuthToken()
    render(
      <AuthProvider>
        <AuthDisplay />
      </AuthProvider>
    )
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })
    expect(screen.getByTestId('authenticated').textContent).toBe('false')
    expect(screen.getByTestId('username').textContent).toBe('none')
  })

  it('login sets user', async () => {
    render(
      <AuthProvider>
        <AuthDisplay />
      </AuthProvider>
    )
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false')
    })

    await act(async () => {
      screen.getByText('Login').click()
    })

    expect(screen.getByTestId('authenticated').textContent).toBe('true')
    expect(screen.getByTestId('username').textContent).toBe('manual')
  })

  it('logout clears user and token', async () => {
    setAuthToken()
    render(
      <AuthProvider>
        <AuthDisplay />
      </AuthProvider>
    )
    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('true')
    })

    await act(async () => {
      screen.getByText('Logout').click()
    })

    expect(screen.getByTestId('authenticated').textContent).toBe('false')
    expect(localStorage.getItem('token')).toBeNull()
  })
})
