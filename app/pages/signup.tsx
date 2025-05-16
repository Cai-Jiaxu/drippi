'use client'

import * as React from 'react'
import { SignUpForm } from '../src/components/signup-form'

export default function Signup() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  )
}
