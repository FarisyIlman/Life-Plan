import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/admin/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = request.nextUrl.pathname.startsWith("/admin");
      const isLoginPage = request.nextUrl.pathname === "/admin/login";

      if (isOnAdmin && !isLoginPage && !isLoggedIn) {
        return false;
      }
      if (isLoginPage && isLoggedIn) {
        return Response.redirect(new URL("/admin/dashboard", request.nextUrl));
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
