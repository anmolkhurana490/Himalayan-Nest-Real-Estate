import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { loginUserAPI } from "@/features/auth/repositories.js"
import { customOAuthResolve } from "@/features/auth/viewmodel/oauthModel";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),

        CredentialsProvider({
            async authorize(credentials) {
                try {
                    const response = await loginUserAPI(credentials);
                    if (response.success && response.user) return response.user;

                    // If login failed, throw error with message
                    throw new Error(response.message || 'Invalid credentials');
                } catch (error) {
                    // Throw error to display in login form
                    throw new Error(error.data?.message || error.message || 'Authentication failed');
                }
            }
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.email = user.email;
                token.accessToken = user.accessToken;
                token.providerAccountId = user.providerAccountId;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.role = token.role;
            session.user.accessToken = token.accessToken;
            session.providerAccountId = token.providerAccountId;
            return session;
        },
        async signIn({ user, account }) {
            if (account.type === 'oauth') {
                // For OAuth providers
                return await customOAuthResolve(user, account);
            }
            return true;
        }
    },

    pages: {
        signIn: '/auth/login',
    },

    session: {
        strategy: 'jwt',
    },

    secret: process.env.NEXTAUTH_SECRET,
};