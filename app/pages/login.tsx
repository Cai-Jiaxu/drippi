'use client'

import * as React from 'react'
import { LoginForm } from '../src/components/login-form'

export default function Login() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
