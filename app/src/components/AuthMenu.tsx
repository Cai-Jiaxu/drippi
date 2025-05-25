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

export function AuthMenu() {
  const { user, isLoaded, isSignedIn } = useUser()
  if (!isLoaded) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {isSignedIn && user ? (
          <Avatar className="cursor-pointer ring ring-primary ring-offset-base-100 ring-offset-2 rounded-full">
            <AvatarImage src={user.setProfileImage} alt={user.fullName || 'User'} />
            <AvatarFallback>{(user.firstName || 'U')[0]}</AvatarFallback>
          </Avatar>
        ) : (
          <Avatar className="cursor-pointer ring ring-primary ring-offset-base-100 ring-offset-2 rounded-full">
            <AvatarFallback>?</AvatarFallback>
          </Avatar>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={4} className="bg-base-100/90 backdrop-blur-md border border-base-200 rounded-lg p-2 w-auto max-w-xs">
        {isSignedIn && user ? (
          <>
            <div className="flex items-center space-x-2 px-3 py-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.setProfileImage} alt={user.fullName || 'User'} />
                <AvatarFallback>{(user.firstName || 'U')[0]}</AvatarFallback>
              </Avatar>
              <span className="font-medium text-sm">{user.fullName} │ DripDaddy</span>
            </div>
            <div className="px-2">
              <SignOutButton>
                <DropdownMenuItem asChild>
                  <button className="w-full text-center">Sign out</button>
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
                <button className="btn btn-sm btn-outline flex-1">Sign in</button>
              </SignInButton>
              <SignUpButton>
                <button className="btn btn-sm btn-primary flex-1">Register</button>
              </SignUpButton>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
