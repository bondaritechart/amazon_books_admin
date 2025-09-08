'use server';

import { Routes } from '@/constants/routes';
import { CURRENT_USER_QUERY } from '@/data-access/user/queries/current-user';
import { CurrentUserQuery } from '@/types/graphql';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Create a server-side Apollo client
function createServerApolloClient(token?: string) {
  const httpLink = createHttpLink({
    uri: `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
    fetch: fetch,
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        ...(token && { authorization: `Bearer ${token}` }),
      },
    };
  });

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    ssrMode: true,
  });
}

export const setAuthToken = async (token: string) => {
  const cookieStore = await cookies();
  cookieStore.set('accessToken', token);
};

// Get access token from cookies (server-side)
export async function getAccessTokenFromCookies(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get('accessToken');
    return accessToken?.value || null;
  } catch (error) {
    console.error('Error reading access token from cookies:', error);
    return null;
  }
}

// Get current URL from server-side headers
async function getCurrentUrl(): Promise<string> {
  try {
    const headersList = await headers();

    // Try to get pathname from our custom header (set by middleware)
    let pathname = headersList.get('x-pathname');
    // Fallback to referer header
    if (!pathname) {
      const referer = headersList.get('referer');
      if (referer && referer.startsWith('http')) {
        const url = new URL(referer);
        pathname = url.pathname;
      }
    }

    // Final fallback
    return pathname || '/';
  } catch (error) {
    console.error('Error getting current URL:', error);
    return '/';
  }
}

// Check if user should be redirected based on auth state and current URL
async function checkAuthRedirect(
  currentUser: CurrentUserQuery | null
): Promise<void> {
  let redirectTo: string | null = null;
  try {
    const currentPath = await getCurrentUrl();
    // If no user and on dashboard route, redirect to login
    if (!currentUser && currentPath.startsWith(Routes.DASHBOARD)) {
      redirectTo = Routes.LOGIN;
    } else if (
      currentUser &&
      (currentPath.startsWith(Routes.LOGIN) ||
        currentPath.startsWith(Routes.REGISTER))
    ) {
      redirectTo = Routes.DASHBOARD;
    }
  } catch (error) {
    console.error('Error in auth redirect check:', error);
  } finally {
    if (redirectTo) {
      redirect(redirectTo);
    }
  }
}

// Get current user from server-side
export async function getCurrentUserFromServer(): Promise<CurrentUserQuery | null> {
  try {
    const token = await getAccessTokenFromCookies();
    if (!token) {
      return null;
    }

    const client = createServerApolloClient(token);

    const { data } = await client.query({
      query: CURRENT_USER_QUERY,
      errorPolicy: 'all',
    });

    return data?.currentUser || null;
  } catch (error) {
    console.error('Error fetching current user from server:', error);
    return null;
  }
}

// Get current user and handle redirects
export async function getCurrentUserWithRedirect(): Promise<CurrentUserQuery | null> {
  const currentUser = await getCurrentUserFromServer();
  await checkAuthRedirect(currentUser);
  return currentUser;
}
