import { useSyncExternalStore } from 'react'

let didmixpanelInit = false
const didmixpanelInitListeners: Set<() => void> = new Set()

function subscribeToMixpanelInit(listener: () => void) {
  didmixpanelInitListeners.add(listener)
  return () => {
    didmixpanelInitListeners.delete(listener)
  }
}

function notifyMixpanelInitListeners() {
  didmixpanelInitListeners.forEach((listener) => listener())
}

export function emitMixpanelInitialized() {
  didmixpanelInit = true
  notifyMixpanelInitListeners()
}

export function isMixpanelInitialized() {
  return didmixpanelInit
}

export function useIsMixpanelInitialized() {
  return useSyncExternalStore(subscribeToMixpanelInit, isMixpanelInitialized)
}
