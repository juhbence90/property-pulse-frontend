import GoogleProvider from 'next-auth/providers/google';
import { AuthOptions } from 'next-auth';
import connectDB from '@/config/database';
import User from '@/models/User';
import type { GoogleProfile } from 'next-auth/providers/google';

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  callbacks: {
    // Invoked on successful sign in
    async signIn({ profile }) {
      if (!profile) return false;
      const googleProfile = profile as GoogleProfile;
      // 1. Connect to the database
      await connectDB();
      // 2. Check if user exists
      const userExists = await User.findOne({ email: googleProfile.email });
      // 3. If not, create user
      if (!userExists) {
        //Truncate username if too long
        const username = googleProfile.name.slice(0, 20);

        await User.create({
          email: googleProfile.email,
          username,
          image: googleProfile.picture,
        });
      }
      // 4. Return true to allow sign in
      return true;
    },
    // Session callback function that modifies the session object
    async session({ session, user, token }) {
      // 1. Get user from database
      if (session.user?.email) {
        const dbUser = await User.findOne({
          email: session.user.email,
        });

        if (dbUser) {
          // 2. Assign user id from the session
          session.user.id = dbUser._id.toString();
        }
      }
      // 3. Return session
      return session;
    },
  },
};
