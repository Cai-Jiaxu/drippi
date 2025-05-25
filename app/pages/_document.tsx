// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Run this *before* hydration to set the correct data-theme */}
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function() {
              function getInitialTheme() {
                // 1) Check localStorage
                const stored = window.localStorage.getItem('theme');
                if (stored) return stored;
                // 2) Check system preference
                const mql = window.matchMedia('(prefers-color-scheme: dark)');
                if (mql.matches) return 'dark';
                // 3) Fallback to 'light'
                return 'light';
              }
              document.documentElement.setAttribute('data-theme', getInitialTheme());
            })()
          `}
        </Script>
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}