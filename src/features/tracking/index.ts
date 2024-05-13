import mixpanel, { type Config } from 'mixpanel-browser'
import { areCookiesAccepted, initOneTrust, mixpanelInit } from './tracking.utils'
import type { MixPanelEvent, UseTrackPageViewEvent, TrackEvent } from './tracking.types'
import { useEffect, useRef, useSyncExternalStore } from 'react'

export type TrackingConfig = {
  enabled: boolean
  oneTrustScriptUrl: string
  domainScriptUrl: string
  mixpanelToken: string
  mixpanelConfig?: Partial<Config>
  nonce?: string
}

export function initTracking<TMixPanelEvent extends MixPanelEvent>(
  config: TrackingConfig
): {
  /**
   * Tracks an event to Mixpanel
   * It will emit the event if the following conditions are met:
   * - Tracking is enabled;
   * - Mixpanel is initialized.
   *
   * @param eventName the name of the event
   * @param properties the properties of the event
   */
  trackEvent: TrackEvent<TMixPanelEvent>
  /**
   * Emits a page view event to Mixpanel
   * It will emit the event if the following conditions are met:
   * - Tracking is enabled;
   * - Mixpanel is initialized;
   * - The event has not been emitted yet;
   * - All properties values are truthy.
   *
   * @param eventName the name of the event
   * @param properties the properties of the event
   */
  useTrackPageViewEvent: UseTrackPageViewEvent<TMixPanelEvent>
} {
  // If tracking is disabled, return noop functions
  if (!config.enabled) {
    return {
      trackEvent: () => void 0,
      useTrackPageViewEvent: () => void 0,
    }
  }

  let didMixpanelInit = false
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

  function emitMixpanelInitialized() {
    didMixpanelInit = true
    notifyMixpanelInitListeners()
  }

  function handleMixpanelInit() {
    if (areCookiesAccepted() && !didMixpanelInit) {
      mixpanelInit(config.mixpanelToken, config?.mixpanelConfig)
      emitMixpanelInitialized()
    }
  }

  initOneTrust(config.oneTrustScriptUrl, config.domainScriptUrl, config.nonce)
  handleMixpanelInit()

  window.addEventListener('consent.onetrust', handleMixpanelInit)

  const trackEvent: TrackEvent<TMixPanelEvent> = (eventName, ...properties) => {
    if (!didMixpanelInit) return

    mixpanel.track(eventName, properties[0])
  }

  const useTrackPageViewEvent: UseTrackPageViewEvent<TMixPanelEvent> = (
    eventName,
    ...properties
  ) => {
    const isMixpanelInitialized = useSyncExternalStore(
      subscribeToMixpanelInit,
      () => didMixpanelInit
    )
    const hasAlreadyTracked = useRef(false)

    const eventProperties = properties[0]

    useEffect(() => {
      if (hasAlreadyTracked.current) return
      if (!isMixpanelInitialized) return

      if (!Object.values(eventProperties).every(Boolean)) return

      mixpanel.track_pageview(eventProperties, { event_name: eventName })
      hasAlreadyTracked.current = true
    }, [eventName, isMixpanelInitialized, eventProperties])
  }

  return { trackEvent, useTrackPageViewEvent }
}
