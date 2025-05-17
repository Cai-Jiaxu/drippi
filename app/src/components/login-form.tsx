'use client'

import * as React from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { cn } from '../lib/utils'
import { Button } from './ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { useAuth } from '../../hooks/useAuth'

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { login } = useAuth()
  const router = useRouter()
  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [loading, setLoading] = React.useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(username, password)
      router.push('/listings')
    } catch {
      setError('Invalid username or password.')
      setLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Sign in with your username and password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            {error && (
              <p className="text-error text-sm text-center">{error}</p>
            )}

            <div className="grid gap-1">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="grid gap-1">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="ml-auto text-sm underline-offset-4 hover:underline">
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in…' : 'Login'}
            </Button>

            <div className="mt-4 text-center text-sm">
              Don’t have an account?{' '}
              <Link href="/signup" className="underline underline-offset-4">
                Register
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
