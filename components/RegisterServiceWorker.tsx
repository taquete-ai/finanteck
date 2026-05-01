'use client'

import { useEffect } from 'react'

/**
 * Registra o Service Worker para funcionalidade PWA.
 * Este componente não renderiza nada - apenas registra o SW silenciosamente.
 */
export default function RegisterServiceWorker() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Service Worker registration failed - app continues to work normally
        console.debug('Service Worker registration failed')
      })
    }
  }, [])

  return null
}
