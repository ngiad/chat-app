import DefaultLayout from '@/src/Layout/DefaultLayout'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {

  const Layout = Component.layout || DefaultLayout
  return <Layout><Component {...pageProps} /></Layout>
}
