import { NextResponse } from "next/server";
import type {NextRequest} from "next/server";

import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
    const token = req.cookies.get('token')?.value;
    console.log("token", token)

    if (!token) {
        return NextResponse.redirect(new URL('/signin', req.url));
    }

    try {
        await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
        const currentPath = req.nextUrl.pathname;
        if(currentPath === "/signup" || currentPath === "/signin"){
            return  NextResponse.redirect(new URL('/', req.url));
        }
        return NextResponse.next();
    } catch {
        return NextResponse.redirect(new URL('/signin', req.url));
    }
}

export const config = {
    matcher: ["/", "/signin", "/signup"], // Matches all routes
};