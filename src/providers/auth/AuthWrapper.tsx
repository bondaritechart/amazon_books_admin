import React from 'react';
import { getCurrentUserWithRedirect } from 'lib/auth-server';
import { SessionProvider } from 'providers/session/SessionProvider';
import { ApolloWrapper } from 'providers/apollo/ApolloWrapper';
import { ClientAuthSync } from './ClientAuthSync';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export async function AuthWrapper({ children }: AuthWrapperProps) {
  // Get current user from server-side and handle redirects
  const currentUser = await getCurrentUserWithRedirect();

  return (
    <ApolloWrapper>
      <SessionProvider initialUser={currentUser}>
        <ClientAuthSync />
        {children}
      </SessionProvider>
    </ApolloWrapper>
  );
} 