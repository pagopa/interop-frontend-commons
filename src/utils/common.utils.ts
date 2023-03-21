type LocalizedObj<TValue> = Record<'it' | 'en', TValue>

export function getLocalizedValue<TValue>(option: LocalizedObj<TValue>): TValue {
  if (typeof window !== 'undefined') {
    const activeLang = window.document.documentElement.lang
    if (activeLang === 'en') return option.en
  }

  return option.it
}
