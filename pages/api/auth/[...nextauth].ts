import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { adminDb } from '@/lib/firebase-admin';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;

      const userRef = adminDb.collection('users').doc(user.email);
      const snap = await userRef.get();

      if (!snap.exists) {
        // Create new user as pending_quiz
        await userRef.set({
          uid: user.id || user.email,
          email: user.email,
          name: user.name || '',
          photoURL: user.image || '',
          status: 'pending_quiz',
          createdAt: new Date().toISOString(),
        });
      }

      return true;
    },

    async session({ session }) {
      if (!session.user?.email) return session;

      const snap = await adminDb.collection('users').doc(session.user.email).get();
      if (snap.exists) {
        const data = snap.data()!;
        (session.user as any).status = data.status;
        (session.user as any).talentId = data.talentId || null;
      }

      return session;
    },
  },

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },

  session: { strategy: 'jwt' },
};

export default NextAuth(authOptions);
