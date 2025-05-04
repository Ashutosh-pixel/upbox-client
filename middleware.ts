import {getToken} from "next-auth/jwt";
import {NextResponse} from "next/server";


export async function middleware(req){
    const session = await getToken({req, secret: process.env.NEXTAUTH_SECRET});

    const protectedRoutes = ['/'];

    const isProtected = protectedRoutes.some((path) => req.nextUrl.pathname.startsWith(path));

    if(isProtected && !session){
        return NextResponse.redirect(new URL('/signin', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/"], // Matches all routes
};