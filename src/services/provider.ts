import { PhantomProvider } from 'types/phantom'

export const getPhantomProvider = (): PhantomProvider | undefined => {
  if ('phantom' in window) {
    const provider = window.phantom?.solana

    if (provider?.isPhantom) {
      return provider
    }
  }

  window.open('https://phantom.app/', '_blank')
}
