"use server";
import { checkEmailExistsAPI, oauthResolveAPI } from "@/features/auth/repositories.js"
import { setInStorage } from "@/utils/storage";

export const customOAuthResolve = async (user, account) => {
    try {
        const emailExistsResponse = await checkEmailExistsAPI(user.email);

        if (!emailExistsResponse.exists) {
            // If email does not exist, redirect to sign-up page with details and message
            const params = new URLSearchParams({
                email: user.email,
                name: user.name,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                oauthSignup: 'true',
                reason: 'no-registered-account'
            });
            return `/auth/register?${params.toString()}`;

        } else {
            // If OAuth user exists, allow sign-in with OAuth resolution
            const oauthData = {
                email: user.email,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
            };
            const oauthResponse = await oauthResolveAPI(oauthData);

            if (oauthResponse.success && oauthResponse.user) {
                user.accessToken = oauthResponse.user.accessToken;
                return true;
            }
            throw new Error(oauthResponse.message || 'OAuth resolution failed');
        }
    } catch (error) {
        const params = new URLSearchParams({
            error: error.data?.message || error.message || 'OAuth resolution failed'
        });

        return `/auth/register?${params.toString()}`;
    }
}