import NextAuth, { type Account, type NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { prisma } from '../../../../../prisma/dbConnection';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { getServerSession } from 'next-auth/next';

interface AuthCallbacks {
  signIn: (params: { account: Account; profile: any }) => Promise<boolean> | boolean;
}

export const authOptions: NextAuthOptions & { callbacks: AuthCallbacks } = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET as string,
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === 'google') {
        return profile?.email_verified && profile?.email.endsWith('@gmail.com');
      }
      return true;
    },
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }

      return session;
    },
    async jwt({ token, user }) {
      const dbUser = await prisma.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!dbUser) {
        if (user) {
          token.id = user?.id;
        }
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
  },
};

const handler = NextAuth(authOptions);

export const getSession = async () => {
  const session = await getServerSession(authOptions);
  return session?.user;
};

export { handler as GET, handler as POST };
