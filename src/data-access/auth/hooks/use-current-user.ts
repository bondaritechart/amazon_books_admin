'use client';

import { CURRENT_USER_QUERY } from '@/data-access/auth/queries/current-user';
import { useSession } from '@/providers/session/SessionProvider';
import { useQuery } from '@apollo/client';
import { useEffect } from 'react';

export function useCurrentUser() {
  const { setUser, clearUser, setError, setLoading } = useSession();

  const { data, loading, error, refetch } = useQuery(CURRENT_USER_QUERY, {
    errorPolicy: 'all',
    notifyOnNetworkStatusChange: true,
  });

  // Update session when query data changes
  useEffect(() => {
    if (loading) {
      setLoading(true);
      return;
    }

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
  }, [data, loading, error, setUser, clearUser, setError, setLoading]);

  return {
    user: data?.currentUser || null,
    loading,
    error,
    refetch,
  };
}
