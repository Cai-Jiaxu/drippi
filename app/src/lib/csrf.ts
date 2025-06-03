// csrf.ts reads csrf cookie
export function getCsrfToken(): string {
    const match = document.cookie.match(/csrftoken=([^;]+)/)
    return match ? match[1] : ''
  }