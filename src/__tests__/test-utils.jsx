import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext.jsx'
import { ScaleProvider } from '../context/ScaleContext.jsx'

/**
 * Custom render that wraps components in all required providers.
 *
 * @param {React.ReactElement} ui - Component to render
 * @param {object} options
 * @param {string} options.route - Initial route for MemoryRouter (default: '/')
 * @param {object} options.authValue - Override AuthContext value (optional)
 * @param {object} options.renderOptions - Extra options passed to @testing-library/react render
 */
export function renderWithProviders(ui, { route = '/', ...renderOptions } = {}) {
  function Wrapper({ children }) {
    return (
      <MemoryRouter initialEntries={[route]}>
        <ScaleProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ScaleProvider>
      </MemoryRouter>
    )
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

export * from '@testing-library/react'
export { renderWithProviders as render }
