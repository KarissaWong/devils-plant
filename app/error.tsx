'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      padding: '2rem',
      textAlign: 'center',
      fontFamily: 'ABC Diatype, Inter, sans-serif',
    }}>
      <h2 style={{ color: '#44272C', marginBottom: '1rem' }}>
        Something went wrong!
      </h2>
      <p style={{ color: '#44272C', marginBottom: '2rem' }}>
        {error.message || 'An unexpected error occurred'}
      </p>
      <button
        onClick={reset}
        style={{
          background: '#44272C',
          color: 'white',
          border: 'none',
          borderRadius: '50px',
          padding: '1rem 2rem',
          fontSize: '1.1rem',
          fontWeight: 300,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#5a3238'
          e.currentTarget.style.transform = 'scale(1.05)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#44272C'
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        Try again
      </button>
    </div>
  )
} 