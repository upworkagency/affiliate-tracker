// import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
// // This example protects all routes including api/trpc routes
// // Please edit this to allow other routes to be public as needed.
// // See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
// export default authMiddleware({
//     publicRoutes: ["/login"],
//     afterAuth(auth, req, evt) {
//         console.log("Auth: ", auth)
//         // handle users who aren't authenticated
//         if (!auth.userId && !auth.isPublicRoute) {
//             return redirectToSignIn({ returnBackUrl: req.url + '/login' });
//         }
//     }
// });
 
// export const config = {
//     matcher: ["/((?!.+\\.[\\w]+$|_next).*)","/","/(api|trpc)(.*)"],
// };

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL('/test2', request.url))
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: '/test1/:path*',
}