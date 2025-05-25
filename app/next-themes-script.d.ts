import { ComponentType } from 'react'

declare module 'next-themes/script' {
  export const ThemeScript: ComponentType<{
    attribute?: string
    defaultTheme?: string
    enableSystem?: boolean
    disableTransitionOnChange?: boolean
    themes?: string[]
    storageKey?: string
  }>
}