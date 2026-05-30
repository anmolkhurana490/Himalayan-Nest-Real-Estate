import { getSession } from "next-auth/react";

export async function getAuthToken() {
  try {
    const session = await getSession();
    const sessionUser = session?.user;
    const token = sessionUser?.accessToken || sessionUser.user?.accessToken;
    return token || null;
  }
  catch (e) {
    // console.warn("Failed to get auth token from session", e);
    return null;
  }
}

export async function getAuthUser() {
  try {
    const session = await getSession();
    const sessionUser = session?.user?.user || session?.user;
    return sessionUser || null;
  }
  catch (e) {
    // console.warn("Failed to get auth user from session", e);
    return null;
  }
}