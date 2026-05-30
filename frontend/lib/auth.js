import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { loginUserAPI, oauthResolveAPI } from "@/features/auth/repositories.js"

export const authOptions = {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),

        Credentials({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },

            async authorize(credentials) {
                try {
                    const response = await loginUserAPI(credentials);
                    return {
                        ...response.user,
                        accessToken: response.accessToken,
                    };
                } catch (error) {
                    // Throw error to display in login form
                    // throw new Error(error.data?.message || error.message || 'Authentication failed');
                    return null;
                }
            }
        }),
    ],

    callbacks: {
        async jwt({ token, user, account }) {
            if (user) token.user = user;
            if (account?.type === 'oauth' && account.id_token) token.user = account.user;
            return token;
        },
        async session({ session, token }) {
            if (token.user) session.user = token.user;
            return session;
        },
        async signIn({ user, account }) {
            // For OAuth providers
            if (account.type !== 'credentials') {
                try {
                    const { provider, id_token } = account;
                    const res = await oauthResolveAPI({ provider, id_token });

                    if (res.signup && res.data) {
                        // New user signed up via OAuth, redirect for further details fillup
                        const message = res.message || 'Please complete your signup details';
                        return `/auth/register?oauth=${provider}&message=${encodeURIComponent(message)}&data=${encodeURIComponent(JSON.stringify(res.data))}&signupToken=${encodeURIComponent(res.signupToken)}`;
                    }

                    user.user = {
                        ...res.user,
                        accessToken: res.accessToken,
                    };
                    return true;
                }
                catch (error) {
                    const message = error.data?.message || error.message || 'OAuth authentication failed';
                    console.error("OAuth resolve failed:", message);
                    return `/auth/login?error=${encodeURIComponent(message)}`;
                }
            }
            return true;
        }
    },

    pages: {
        signIn: '/auth/login',
        error: `/auth/login?error=${encodeURIComponent('Authentication failed')}`,
    },

    session: {
        strategy: 'jwt',
        maxAge: 7 * 24 * 60 * 60, // 7 days
    },

    secret: process.env.NEXTAUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);