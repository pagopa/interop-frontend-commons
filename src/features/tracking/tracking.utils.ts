import mixpanel, { type Config } from 'mixpanel-browser'

const STRICTLY_NECESSARY_COOKIES_GROUP = 'C0001'
const TARG_COOKIES_GROUP = 'C0002'
declare const OnetrustActiveGroups: string

export function initOneTrust(oneTrustScriptUrl: string, domainScriptUrl: string, nonce?: string) {
  const scriptEl = document.createElement('script')
  scriptEl.setAttribute('src', oneTrustScriptUrl)
  scriptEl.setAttribute('type', 'text/javascript')
  scriptEl.setAttribute('charset', 'UTF-8')
  scriptEl.setAttribute('data-domain-script', domainScriptUrl)
  if (nonce) {
    scriptEl.setAttribute('nonce', nonce)
  }
  document.head.appendChild(scriptEl)
}

export function mixpanelInit(
  mixpanelToken: string,
  mixpanelIdentifier: string | undefined,
  mixpanelConfig?: Partial<Config>
): void {
  mixpanel.init(mixpanelToken, {
    api_host: 'https://api-eu.mixpanel.com',
    persistence: 'localStorage',
    // if this is true, Mixpanel will automatically determine
    // City, Region and Country data using the IP address of
    // the client
    ip: false,
    // names of properties/superproperties which should never
    // be sent with track() calls
    property_blacklist: ['$current_url', '$initial_referrer', '$referrer'],
    debug: true,
    // function called after mixpanel has finished loading

    // prop to track every page view
    // track_pageview: 'full-url',
    ...mixpanelConfig,
  })

  if (mixpanelIdentifier) mixpanel.identify(mixpanelIdentifier)
}

export function areCookiesAccepted(): boolean {
  const OTCookieValue =
    document.cookie.split('; ').find((row) => row.startsWith('OptanonConsent=')) || ''
  console.log(OTCookieValue)
  const groupsEncoded = OTCookieValue.split('&').find((b) => b.includes('groups')) || ''
  console.log(groupsEncoded)
  const groupsDecoded = groupsEncoded
    .replace('groups=', '')
    .split(',')
    .map((g) => decodeURIComponent(g))
  console.log(groupsDecoded)

  const groups = groupsDecoded
    // Each group is followed by :1 if accepted, :0 if not. E.g. C0001:1, C0002:0
    .map((s) => s.replace(/:[0-9]$/, ''))
  console.log({ groups })

  const hasOnlyStrictlyNecessaryCookies =
    groups.length === 1 && groups[0] === STRICTLY_NECESSARY_COOKIES_GROUP
  console.log({ hasOnlyStrictlyNecessaryCookies })
  if (hasOnlyStrictlyNecessaryCookies) return true

  const areBeingAccepted =
    typeof OnetrustActiveGroups !== 'undefined' &&
    Boolean(OnetrustActiveGroups) &&
    OnetrustActiveGroups.includes(TARG_COOKIES_GROUP)
  console.log({ areBeingAccepted })

  return areBeingAccepted
}
