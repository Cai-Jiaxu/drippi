// components/AuthMenu.tsx
'use client'

import { useUser, SignInButton, SignUpButton, SignOutButton } from '@clerk/nextjs'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

export function AuthMenu() {
  const { user, isLoaded, isSignedIn } = useUser()
  if (!isLoaded) return null

  // Clerk's UserResource has `imageUrl`, not `profileImageUrl`
  const avatarUrl = user?.imageUrl ?? ''

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {isSignedIn && user ? (
          <Avatar className="cursor-pointer ring ring-primary ring-offset-[var(--background)] ring-offset-2 rounded-full">
            {/* Now passing a string URL (user.imageUrl), not a function */}
            <AvatarImage src={avatarUrl} alt={user.fullName || 'User'} />
            <AvatarFallback>{(user.firstName || 'U')[0]}</AvatarFallback>
          </Avatar>
        ) : (
          <Avatar className="cursor-pointer ring ring-primary ring-offset-[var(--background)] ring-offset-2 rounded-full">
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={4}
        className="bg-[var(--background)] backdrop-blur-md border border-[var(--border)] rounded-lg p-2 w-auto max-w-xs"
      >
        {isSignedIn && user ? (
          <>
            <div className="flex items-center space-x-2 px-3 py-2">
              <Avatar className="h-8 w-8">
                {/* Again, use user.imageUrl */}
                <AvatarImage src={avatarUrl} alt={user.fullName || 'User'} />
                <AvatarFallback>{(user.firstName || 'U')[0]}</AvatarFallback>
              </Avatar>
              <span className="font-medium text-sm">{user.fullName} │ DripDaddy</span>
            </div>
            <div className="px-2">
              <SignOutButton>
                <DropdownMenuItem asChild>
                  <Button variant="ghost" size="sm" className="w-full text-center">
                    Sign out
                  </Button>
                </DropdownMenuItem>
              </SignOutButton>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center space-x-5 px-1 py-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>?</AvatarFallback>
              </Avatar>
              <span className="font-medium text-sm whitespace-nowrap">Welcome to DripDaddy</span>
            </div>
            <div className="flex space-x-2 px-2 pb-2">
              <SignInButton>
                <Button variant="outline" size="sm" className="flex-1">
                  Sign in
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button variant="default" size="sm" className="flex-1">
                  Register
                </Button>
              </SignUpButton>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
