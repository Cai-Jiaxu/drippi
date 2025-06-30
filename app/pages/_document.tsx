// pages/_document.tsx
import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function() {
              function getInitialTheme() {
            
                const stored = window.localStorage.getItem('theme');
                if (stored) return stored;
                
                const mql = window.matchMedia('(prefers-color-scheme: dark)');
                if (mql.matches) return 'dark';
                
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