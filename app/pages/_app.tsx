// pages/_app.tsx
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import { ClerkProvider } from '@clerk/nextjs'
import Layout from '@/components/Layout'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      {/* Wrap only the client-side theme logic to avoid SSR mismatch */}
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem={true}
        // themes={['nord', 'dim']}
        disableTransitionOnChange
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </ClerkProvider>
  )
}
