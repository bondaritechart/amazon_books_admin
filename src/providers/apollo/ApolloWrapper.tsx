'use client';
// ^ this file needs the "use client" pragma

import { Routes } from '@/constants/routes';
import { HttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from '@apollo/client-integration-nextjs';
import toast from 'react-hot-toast';

// Function to get cookie value by name
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') {
    return null; // SSR safety
  }

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null;
  }
  return null;
}

// have a function to create a client for you
function makeClient() {
  const httpLink = new HttpLink({
    // this needs to be an absolute url, as relative urls cannot be used in SSR
    uri: `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
    // you can disable result caching here if you want to
    // (this does not work if you are rendering your page with `export const dynamic = "force-static"`)
    fetchOptions: {
      // you can pass additional options that should be passed to `fetch` here,
      // e.g. Next.js-related `fetch` options regarding caching and revalidation
      // see https://nextjs.org/docs/app/api-reference/functions/fetch#fetchurl-options
    },
    // you can override the default `fetchOptions` on a per query basis
    // via the `context` property on the options passed as a second argument
    // to an Apollo Client data fetching hook, e.g.:
    // const { data } = useSuspenseQuery(MY_QUERY, { context: { fetchOptions: { ... }}});
  });

  // Create auth link to add Authorization header
  const authLink = setContext((_, { headers }) => {
    // Get the authentication token from cookie
    const token = getCookie('accessToken');

    // Return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        ...(token && { authorization: `Bearer ${token}` }),
      },
    };
  });

  // Create error link to handle GraphQL and network errors
  const errorLink = onError(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ({ graphQLErrors, networkError }: any) => {
      if (graphQLErrors) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        graphQLErrors.forEach(({ message, locations, path, extensions }: any) => {
          console.error(
            `GraphQL error: Message: ${message}, Location: ${locations}, Path: ${path}`,
            extensions
          );
          // Handle specific error types
          if (extensions?.code === 'UNAUTHENTICATED') {
            if (typeof window !== 'undefined' && window.location.href.includes('dashboard')) {
              toast.error('Authentication required. Please log in.');
              window.location.href = Routes.LOGIN;
            }
          } else if (extensions?.code === 'FORBIDDEN') {
            toast.error('You do not have permission to perform this action.');
          } else {
            // Generic error handling
            toast.error(message || 'An error occurred');
          }
        });
      }

      if (networkError) {
        console.error(`Network error: ${networkError}`);

        // Handle different types of network errors
        if (networkError.message.includes('fetch')) {
          toast.error('Network error. Please check your internet connection.');
        } else if (networkError.message.includes('500')) {
          toast.error('Server error. Please try again later.');
        } else {
          toast.error('Connection error. Please try again.');
        }
      }
    }
  );

  // use the `ApolloClient` from "@apollo/client-integration-nextjs"
  return new ApolloClient({
    // use the `InMemoryCache` from "@apollo/client-integration-nextjs"
    cache: new InMemoryCache(),
    link: from([errorLink, authLink, httpLink]),
  });
}

// you need to create a component to wrap your app in
export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
