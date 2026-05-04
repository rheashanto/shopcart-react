import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import useFetch from '../hooks/useFetch'

const HookConsumer = ({ url }) => {
  const { data, loading, error } = useFetch(url)
  if (loading) return <p>Loading</p>
  if (error) return <p>Error: {error}</p>
  return <p data-testid="data">{JSON.stringify(data)}</p>
}

describe('useFetch', () => {
  beforeEach(() => {
    vi.spyOn(globalThis, 'fetch')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('shows loading initially', () => {
    globalThis.fetch.mockReturnValue(new Promise(() => {}))
    render(<HookConsumer url="https://example.com" />)
    expect(screen.getByText('Loading')).toBeTruthy()
  })

  it('renders data on successful fetch', async () => {
    globalThis.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [{ id: 1 }],
    })
    render(<HookConsumer url="https://example.com" />)
    await waitFor(() => expect(screen.getByTestId('data')).toBeTruthy())
    expect(screen.getByTestId('data').textContent).toBe('[{"id":1}]')
  })

  it('shows error on failed fetch', async () => {
    globalThis.fetch.mockResolvedValueOnce({ ok: false, status: 500 })
    render(<HookConsumer url="https://example.com" />)
    await waitFor(() => expect(screen.getByText(/Error:/)).toBeTruthy())
  })

  it('shows error on network failure', async () => {
    globalThis.fetch.mockRejectedValueOnce(new Error('Network error'))
    render(<HookConsumer url="https://example.com" />)
    await waitFor(() => expect(screen.getByText(/Network error/)).toBeTruthy())
  })
})
