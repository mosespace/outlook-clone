import { db } from '@/prisma/db';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { compare } from 'bcrypt';
import { NextAuthOptions } from 'next-auth';
import type { Adapter } from 'next-auth/adapters';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    GitHubProvider({
      profile(profile): any {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          firstName: profile.name?.split(' ')[0] || null,
          lastName: profile.name?.split(' ')[1] || null,
          phone: null,
          image: profile.avatar_url,
          email: profile.email,
          role: 'USER',
        };
      },
      clientId: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),
    GoogleProvider({
      profile(profile): any {
        return {
          id: profile.sub,
          name: `${profile.given_name} ${profile.family_name}`,
          firstName: profile.given_name,
          lastName: profile.family_name,
          phone: null,
          image: profile.picture,
          email: profile.email,
          role: 'USER',
        };
      },
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'jb@gmail.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req): Promise<any | null> {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const existingUser = await db.user.findUnique({
            where: { email: credentials.email },
          });

          if (!existingUser) {
            return null;
          }

          if (!existingUser.password) {
            return null;
          }

          const passwordMatch = await compare(
            credentials.password,
            existingUser.password,
          );

          if (!passwordMatch) {
            return null;
          }

          return {
            id: existingUser.id,
            name: existingUser.name,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            phone: existingUser.phone,
            image: existingUser.image,
            email: existingUser.email,
            role: existingUser.roleId,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture as string | null;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
};
