import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

const authConfig = {
  providers: [Google],
  callbacks: {
    authorized({ auth, request }) {
      return !!auth?.user;
    },
  },
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);
