'use client';

import { useCurrentUser } from '@/data-access/auth/hooks/use-current-user';
import { useEffect } from 'react';

/**
 * Client-side component that syncs authentication state
 * when the accessToken cookie changes (e.g., after login)
 */
export function ClientAuthSync() {
  const { refetch } = useCurrentUser();

  useEffect(() => {
    console.log('debug here');
    // Function to check if accessToken cookie exists
    const checkAuthToken = () => {
      const hasToken = document.cookie
        .split(';')
        .some((cookie) => cookie.trim().startsWith('accessToken='));

      return hasToken;
    };

    // Initial check
    const initialTokenExists = checkAuthToken();

    // Set up interval to check for token changes
    const interval = setInterval(() => {
      const tokenExists = checkAuthToken();

      // If token state changed, refetch current user
      if (tokenExists !== initialTokenExists) {
        refetch();
      }
    }, 1000); // Check every second

    // Listen for storage events (when token is set/removed)
    const handleStorageChange = () => {
      refetch();
    };

    window.addEventListener('storage', handleStorageChange);

    // Listen for custom events (when login happens)
    const handleAuthChange = () => {
      setTimeout(() => refetch(), 100); // Small delay to ensure cookie is set
    };

    window.addEventListener('auth:login', handleAuthChange);
    window.addEventListener('auth:logout', handleAuthChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth:login', handleAuthChange);
      window.removeEventListener('auth:logout', handleAuthChange);
    };
  }, []);

  return null; // This component doesn't render anything
}
