import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { AuthProvider } from '../context/AuthProvider'
import Layout from '@/components/Layout'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem={true}
      themes={['nord', 'dim']}
    >
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
        
      </AuthProvider>
    </ThemeProvider>
  )
}
