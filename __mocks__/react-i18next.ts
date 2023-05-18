export const useTranslation = () => {
  return {
    t: (str: string) => str,
    i18n: {
      changeLanguage: () => new Promise(() => undefined),
      language: 'it',
    },
  }
}

export const Trans = ({ children }) => children
