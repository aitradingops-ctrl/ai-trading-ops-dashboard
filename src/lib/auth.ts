import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { isAllowedLoginEmail } from "@/lib/login-restriction";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ profile, user }) {
      const email = user.email || profile?.email;

      if (isAllowedLoginEmail(email)) {
        return true;
      }

      return "/login?restricted=1";
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email ?? session.user.email;
        session.user.name = token.name ?? session.user.name;
        session.user.image = token.picture as string | null | undefined;
      }

      return session;
    },
  },
};
