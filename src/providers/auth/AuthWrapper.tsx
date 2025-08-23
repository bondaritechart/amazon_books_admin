import { getCurrentUserWithRedirect } from '@/lib/auth-server';
import { ApolloWrapper } from '@/providers/apollo/ApolloWrapper';
import { SessionProvider } from '@/providers/session/SessionProvider';
import React from 'react';
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
