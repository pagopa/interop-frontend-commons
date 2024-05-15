import type { Dict } from 'mixpanel-browser'

export type MixPanelEvent = {
  eventName: string
  properties: Dict
}

export type TrackEvent<TMixPanelEvent extends MixPanelEvent> = <
  TMixPanelEventName extends TMixPanelEvent['eventName'],
  TMixPanelProperties extends Extract<
    TMixPanelEvent,
    { eventName: TMixPanelEventName }
  >['properties'],
>(
  eventName: TMixPanelEventName,
  ...properties: TMixPanelProperties extends undefined ? [] : [properties: TMixPanelProperties]
) => void

export type UseTrackPageViewEvent<TMixPanelEvent extends MixPanelEvent> = <
  TMixPanelEventName extends TMixPanelEvent['eventName'],
  TMixPanelProperties extends Extract<
    TMixPanelEvent,
    { eventName: TMixPanelEventName }
  >['properties'],
>(
  eventName: TMixPanelEventName,
  ...properties: TMixPanelProperties extends undefined
    ? []
    : [properties: { [K in keyof TMixPanelProperties]: TMixPanelProperties[K] | undefined }]
) => void
