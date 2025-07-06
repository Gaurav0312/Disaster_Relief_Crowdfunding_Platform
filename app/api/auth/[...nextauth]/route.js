import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { DatabaseHelper } from "../../../../lib/mongodb"; // Adjust path as needed

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Validate input
          if (!credentials?.email || !credentials?.password) {
            console.log("Missing email or password");
            return null;
          }

          // Get user from database
          const user = await DatabaseHelper.getUserByEmail(
            credentials.email.toLowerCase()
          );

          if (!user) {
            console.log("No user found with email:", credentials.email);
            return null;
          }

          // Verify password using bcrypt
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValidPassword) {
            console.log("Invalid password for user:", credentials.email);
            return null;
          }

          // Return user object for session
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.fullName, // Make sure this matches your database field
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: { scope: "read:user user:email" },
      },
    }),
  ],

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      // Handle OAuth providers (Google, GitHub)
      if (account.provider === "google" || account.provider === "github") {
        try {
          // Check if user exists in database
          const existingUser = await DatabaseHelper.getUserByEmail(user.email);

          if (!existingUser) {
            // Create new user for OAuth providers
            await DatabaseHelper.saveUser({
              fullName: user.name,
              email: user.email.toLowerCase(),
              password: null, // OAuth users don't have passwords
              provider: account.provider,
              providerId: account.providerAccountId,
            });
          }
          return true;
        } catch (error) {
          console.error("OAuth sign-in error:", error);
          return false;
        }
      }
      return true;
    },
  },

  pages: {
    signIn: "/signin",
    error: "/signin",
  },

  session: {
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST };
