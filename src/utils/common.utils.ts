type LocalizedObj<TValue> = Record<'it' | 'en', TValue>

export function getLocalizedValue<TValue>(option: LocalizedObj<TValue>): TValue {
  if (typeof window !== 'undefined') {
    const activeLang = window.document.documentElement.lang
    if (activeLang === 'en') return option.en
  }

  return option.it
}

export function debounce<F extends (...args: Parameters<F>) => ReturnType<F>>(
  func: F,
  waitFor: number
): (...args: Parameters<F>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<F>): void => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), waitFor)
  }
}
