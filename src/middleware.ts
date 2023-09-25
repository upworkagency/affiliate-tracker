import { authMiddleware, redirectToSignIn } from "@clerk/nextjs";
import { NextResponse } from "next/server";
 
// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your middleware
export default authMiddleware({
    publicRoutes: ["/login"],
    // afterAuth: {
    afterAuth(auth, req, evt) {
        console.log("Auth: ", auth)
        // handle users who aren't authenticated
        if (!auth.userId && !auth.isPublicRoute) {
            return redirectToSignIn({ returnBackUrl: req.url + '/login' });
        }
        // // redirect them to organization selection page
        // if( auth.userId ){
        //     const url = new URL('/dashboard', req.url)
        //     console.log("Login redirect URL: ", url)
        //     return NextResponse.redirect(url)
        // }
    }
    // },
});
 
export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)","/","/(api|trpc)(.*)"],
};