'use client'

// import * as React from 'react'
// import { SignUpForm } from '../src/components/signup-form'

// export default function Signup() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-base-100 text-base-content p-6">
//       <div className="w-full max-w-sm">
//         <SignUpForm />
//       </div>
//     </div>
//   )
// }

import { SignUp } from '@clerk/nextjs';

export default function Signup() {
  return <SignUp path="/signup" routing="path" />;
}
