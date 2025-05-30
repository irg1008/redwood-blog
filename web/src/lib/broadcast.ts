import i18next from 'i18next'

export const listenI18nBroadcast = () => {
  if (!('BroadcastChannel' in globalThis)) return

  const i18nBC = new BroadcastChannel('i18n')

  i18next.on('languageChanged', () => {
    i18nBC.postMessage(i18next.language)
  })

  i18nBC.onmessage = (event) => {
    const lang = event.data
    if (lang === i18next.language) return
    i18next.changeLanguage(event.data)
  }
}

export const listenAuthBroadcast = (onAuthEvent: (isAuth: boolean) => void) => {
  if (!('BroadcastChannel' in globalThis)) return

  const authBC = new BroadcastChannel('auth')
  authBC.onmessage = (event) => onAuthEvent(event.data)

  return {
    sendEvent: (isAuth: boolean) => authBC.postMessage(isAuth),
    clean: () => authBC.close(),
  }
}
