'use client'

// import { useRouter } from 'next/router'
// import { useAuth } from '../../hooks/useAuth'
// import { Button } from '@/components/ui/button'
// import {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
// } from '@/components/ui/dropdown-menu'
// import { LogIn, LogOut, UserCircle } from 'lucide-react'

// export function AuthControls() {
//   const { user, logout } = useAuth()
//   const router = useRouter()

//   async function handleLogout() {
//     await logout()
//     router.push('/')
//   }


//   if (!user) {
//     return (
//       <Button
//         variant="secondary"
//         size="sm"
//         onClick={() => router.push('/login')}
//       >
//         <LogIn className="mr-2 h-4 w-4" />
//         Login
//       </Button>
//     )
//   }


//   return (
//     <DropdownMenu>
//       <DropdownMenuTrigger asChild>
//         <Button variant="ghost" size="icon" aria-label="User menu">
//           <UserCircle className="h-6 w-6" />
//         </Button>
//       </DropdownMenuTrigger>
//       <DropdownMenuContent align="end">
//         {/* <div className="px-4 py-2">
//           <p className="text-sm font-medium">
//             Hello, {user.username}
//           </p>
//         </div> */}
//         <DropdownMenuItem onSelect={handleLogout}>
//           <LogOut className="mr-2 h-4 w-4" />
//           Logout
//         </DropdownMenuItem>
//       </DropdownMenuContent>
//     </DropdownMenu>
//   )
// }

// components/AuthControls.tsx
'use client'

import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  SignOutButton,
  UserButton
} from '@clerk/nextjs'
import { Button } from '@/components/ui/button'

export function AuthControls() {
  return (
    <>
      {/* When the user is signed in, show their avatar + sign-out */}
      <SignedIn>
        <div className="flex items-center space-x-4">
          <UserButton />
          <SignOutButton>
            <Button variant="ghost" size="sm">
              Sign out
            </Button>
          </SignOutButton>
        </div>
      </SignedIn>

      {/* When signed out, show “Sign in” and “Register” */}
      <SignedOut>
        <div className="flex items-center space-x-2">
          <SignInButton>
            <Button variant="outline" size="sm">
              Sign in
            </Button>
          </SignInButton>
          <SignUpButton>
            <Button variant="default" size="sm">
              Register
            </Button>
          </SignUpButton>
        </div>
      </SignedOut>
    </>
  )
}
