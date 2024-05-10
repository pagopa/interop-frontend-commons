import mixpanel, { type Config } from 'mixpanel-browser'
import { areCookiesAccepted, initOneTrust, mixpanelInit } from './tracking.utils'
import type { MixPanelEvent, UseTrackPageViewEvent, TrackEvent } from './tracking.types'
import { isMixpanelInitialized, useIsMixpanelInitialized } from './hooks/useIsMixpanelInitialized'
import { useAreCookiesAccepted } from './hooks/useAreCookiesAccepted'
import { useEffect, useRef } from 'react'

type TrackingConfig = {
  enabled: boolean
  oneTrustScriptUrl: string
  domainScriptUrl: string
  mixpanelToken: string
  mixpanelConfig?: Partial<Config>
  nonce?: string
}

export function initTracking<TMixPanelEvent extends MixPanelEvent>(config: TrackingConfig) {
  if (config.enabled) {
    initOneTrust(config.oneTrustScriptUrl, config.domainScriptUrl, config.nonce)
    if (areCookiesAccepted()) {
      mixpanelInit(config.mixpanelToken, config?.mixpanelConfig)
    }
  }

  const trackEvent: TrackEvent<TMixPanelEvent> = (eventName, ...properties) => {
    if (!config.enabled) {
      return console.warn('Tracking is disabled')
    }

    if (areCookiesAccepted() && isMixpanelInitialized()) {
      mixpanel.track(eventName, properties[0])
    }
  }

  const useTrackPageViewEvent: UseTrackPageViewEvent<TMixPanelEvent> = (
    eventName,
    ...properties
  ) => {
    const areCookiesAccepted = useAreCookiesAccepted()
    const isMixpanelInitialized = useIsMixpanelInitialized()

    const hasAlreadyTracked = useRef(false)

    const eventProperties = properties[0]

    useEffect(() => {
      if (!config.enabled) {
        return console.warn('Tracking is disabled')
      }
      if (hasAlreadyTracked.current) return
      if (!areCookiesAccepted) return
      if (!isMixpanelInitialized) return

      if (!Object.values(eventProperties).every(Boolean)) return

      mixpanel.track_pageview(eventProperties, { event_name: eventName })
      hasAlreadyTracked.current = true
    }, [areCookiesAccepted, eventName, isMixpanelInitialized, eventProperties])
  }

  return { trackEvent, useTrackPageViewEvent }
}
