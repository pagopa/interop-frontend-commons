import { useSyncExternalStore } from 'react'
import { areCookiesAccepted } from '../tracking.utils'

const subscribeToConsentChanges = (callback: () => void) => {
  window.addEventListener('consent.onetrust', callback)
  return () => {
    window.removeEventListener('consent.onetrust', callback)
  }
}

export function useAreCookiesAccepted() {
  return useSyncExternalStore(subscribeToConsentChanges, areCookiesAccepted)
}
