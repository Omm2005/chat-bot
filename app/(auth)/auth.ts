import NextAuth, { type DefaultSession } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { createGuestUser, getUser, createUser } from '@/lib/db/queries';
import { authConfig } from './auth.config';
import type { DefaultJWT } from 'next-auth/jwt';

export type UserType = 'guest' | 'regular';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      type: UserType;
    } & DefaultSession['user'];
  }

  interface User {
    id?: string;
    email?: string | null;
    type: UserType;
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    id: string;
    type: UserType;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    ...authConfig.providers,
    Credentials({
      id: 'guest',
      credentials: {},
      async authorize() {
        const [guestUser] = await createGuestUser();
        return { ...guestUser, type: 'guest' };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google' && user.email) {
        try {
          // Check if user exists
          const existingUsers = await getUser(user.email);

          if (existingUsers.length === 0) {
            // Create new user for Google OAuth
            await createUser(user.email, ''); // Empty password for OAuth users
          }
        } catch (error) {
          console.error('Error handling Google OAuth sign in:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        if (account?.provider === 'google' && user.email) {
          // For Google OAuth users, get their ID from the database
          try {
            const users = await getUser(user.email);
            if (users.length > 0) {
              token.id = users[0].id;
              token.type = 'regular';
            }
          } catch (error) {
            console.error('Error getting user ID for Google OAuth:', error);
          }
        } else {
          // For guest users
          token.id = user.id as string;
          token.type = user.type;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.type = token.type;
      }

      return session;
    },
  },
});
