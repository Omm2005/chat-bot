import type { NextAuthConfig } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authConfig = {
  pages: {
    signIn: '/login',
    newUser: '/',
  },
  providers: [
    GoogleProvider({
      clientId:
        process.env.GOOGLE_CLIENT_ID ??
        (() => {
          throw new Error('GOOGLE_CLIENT_ID is not set');
        })(),
      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET ??
        (() => {
          throw new Error('GOOGLE_CLIENT_SECRET is not set');
        })(),
    }),
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {},
} satisfies NextAuthConfig;
