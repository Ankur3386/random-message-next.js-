import { NextRequest,NextResponse } from "next/server";
import {getToken} from 'next-auth/jwt'

export {default}from 'next-auth/middleware'
export const config={
    matcher:['/dashboard/:path*','/sign-in','/sign-up','/verify/:path*']
};
export async function middleware(request:NextRequest){
    const token =await getToken({req:request})
    const url = request.nextUrl;
    //In Next.js middleware, request.nextUrl is used instead of request.url because nextUrl provides a parsed URL object with additional Next.js-specific features, whereas request.url is just a raw string.

    if (
        token &&
        (url.pathname.startsWith('/sign-in') ||
          url.pathname.startsWith('/sign-up') ||
          url.pathname.startsWith('/verify') ||
          url.pathname === '/')
      ) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
    
      if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
      }
    
      return NextResponse.next();
    }