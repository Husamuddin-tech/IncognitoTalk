import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel, { User } from "@/model/User";

// Extend NextAuth User type with custom fields
export type AuthUser = {
  id: string; // Must be `id` for NextAuth
  username: string;
  email: string;
  isVerified: boolean;
  isAcceptingMessages: boolean;
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email", type: "text", placeholder: "john@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        await dbConnect();

        // Find user by email
        const user = await UserModel.findOne({ email: credentials.identifier }) as User | null;
        if (!user) return null;

        // Compare password
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) return null;

        // Map MongoDB _id to NextAuth id
        const authUser: AuthUser = {
          id: user._id!.toString(),
          username: user.username,
          email: user.email,
          isVerified: user.isVerified,
          isAcceptingMessages: user.isAcceptingMessages,
        };

        return authUser;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // Include custom fields in JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as AuthUser).id;
        token.username = (user as AuthUser).username;
        token.isVerified = (user as AuthUser).isVerified;
        token.isAcceptingMessages = (user as AuthUser).isAcceptingMessages;
      }
      return token;
    },
    // Make custom fields available in session
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.isAcceptingMessages = token.isAcceptingMessages as boolean;
      }
      return session;
    },
  },
};








// import { NextAuthOptions } from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import bcrypt from 'bcryptjs';
// import dbConnect from '@/lib/dbConnect';
// import UserModel from '@/model/User';

// type AuthUser = {
//   _id: string;
//   username: string;
//   email: string;
//   isVerified: boolean;
//   isAcceptingMessages: boolean;
// };

// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       id: 'credentials',
//       name: 'Credentials',
//       credentials: {
//         identifier: { label: 'Email or Username', type: 'text' },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials: any): Promise<AuthUser | null> {
//         await dbConnect();

//         try {
//           const user = await UserModel.findOne({
//             $or: [
//               { email: credentials.identifier },
//               { username: credentials.identifier },
//             ],
//           });

//           if (!user) {
//             throw new Error('No user found with the given email');
//           }

//           if (!user.isVerified) {
//             throw new Error('Please verify your email to login');
//           }

//           const isPasswordCorrect = await bcrypt.compare(
//             credentials.password,
//             user.password
//           );
//           if (isPasswordCorrect) {
//             return {
//               _id: user._id.toString(),
//               username: user.username,
//               email: user.email,
//               isVerified: user.isVerified,
//               isAcceptingMessages: user.isAcceptingMessages,
//             };
//           } else {
//             throw new Error('Incorrect password');
//           }
//         } catch (err: any) {
//           throw new Error(err.message || 'Authentication failed');
//         }
//       },
//     }),
//   ],

//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token._id = user._id?.toString(); // Convert ObjectId to string
//         token.isVerified = user.isVerified;
//         token.isAcceptingMessages = user.isAcceptingMessages;
//         token.username = user.username;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token) {
//         session.user._id = token._id;
//         session.user.isVerified = token.isVerified;
//         session.user.isAcceptingMessages = token.isAcceptingMessages;
//         session.user.username = token.username;
//       }
//       return session;
//     },
//   },
//   session: {
//     strategy: 'jwt',
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   pages: {
//     signIn: '/sign-in',
//   },
// };
