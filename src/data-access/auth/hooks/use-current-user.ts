'use client';

import { CURRENT_USER_QUERY } from '@/data-access/auth/queries/current-user';
import { useSession } from '@/providers/session/SessionProvider';
import { useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useCurrentUser() {
  const { setUser, clearUser, setError } = useSession();
  const pathname = usePathname();
  const { data, loading, error, refetch } = useQuery(CURRENT_USER_QUERY, {
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
    skip: pathname.includes('auth'),
  });

  useEffect(() => {
    console.log('debug useCurrentUser');
    if (loading) {
      return;
    }
    console.log('debug current-user ', data);
    if (error) {
      setError(error.message);
      clearUser();
      return;
    }

    if (data?.currentUser) {
      setUser(data.currentUser);
    } else {
      clearUser();
    }
  }, [data, error]);

  return {
    user: data?.currentUser || null,
    loading,
    error,
    refetch,
    setUser,
  };
}
