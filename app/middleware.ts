import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/upload/:path*',
  '/dashboard/:path*',
  '/profile/:path*',
  '/cart/:path*',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {

    await auth.protect();
  }
});

export const config = {
  matcher: [
    // skip internals & static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // always run for API/trpc
    '/(api|trpc)(.*)',
    // run for all pages so our callback can gate them
    '/((?!_next|api|trpc).*)',
  ],
};
