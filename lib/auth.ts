import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import Discord from 'next-auth/providers/discord';
import { getUserByEmail, createUser, updateUser } from './db';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      // Check if user exists in our database
      let dbUser = await getUserByEmail(user.email);

      if (!dbUser) {
        // Check if this is the initial admin email
        const isInitialAdmin = user.email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase();

        // Create new user - admin email is auto-approved with ADMIN role
        dbUser = await createUser({
          email: user.email,
          name: user.name || 'Unknown',
          image: user.image || undefined,
          provider: account?.provider as 'google' | 'github' | 'discord',
          providerId: account?.providerAccountId || user.email,
          role: isInitialAdmin ? 'ADMIN' : 'USER',
          approved: isInitialAdmin,
        });
      } else {
        // Update user info if changed
        await updateUser(dbUser.id, {
          name: user.name || dbUser.name,
          image: user.image || dbUser.image,
        });
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user?.email) {
        const dbUser = await getUserByEmail(user.email);
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role;
          token.approved = dbUser.approved;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'USER' | 'ADMIN';
        session.user.approved = token.approved as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
});
