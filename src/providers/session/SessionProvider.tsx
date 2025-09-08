'use client';

import { CurrentUserQuery } from '@/types/graphql';
import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface SessionState {
  user: CurrentUserQuery | null;
  error: string | null;
  isAuthenticated: boolean;
}

type SessionAction =
  | { type: 'SET_USER'; payload: CurrentUserQuery }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_USER' }
  | { type: 'CLEAR_ERROR' };

interface SessionContextType extends SessionState {
  setUser: (user: CurrentUserQuery) => void;
  clearUser: () => void;
  setError: (error: string) => void;
  clearError: () => void;
}

const initialState: SessionState = {
  user: null,
  error: null,
  isAuthenticated: false,
};

const sessionReducer = (
  state: SessionState,
  action: SessionAction
): SessionState => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        error: null,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };
    case 'CLEAR_USER':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

const SessionContext = createContext<SessionContextType | undefined>(undefined);

interface SessionProviderProps {
  children: React.ReactNode;
  initialUser?: CurrentUserQuery | null;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({
  children,
  initialUser = null,
}) => {
  const [state, dispatch] = useReducer(sessionReducer, {
    ...initialState,
    user: initialUser,
    isAuthenticated: !!initialUser,
  });

  // Sync with localStorage on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser && !initialUser) {
        try {
          const user = JSON.parse(storedUser);
          dispatch({ type: 'SET_USER', payload: user });
        } catch {
          localStorage.removeItem('currentUser');
        }
      }
    }
  }, [initialUser]);

  const setUser = React.useCallback((user: CurrentUserQuery) => {
    dispatch({ type: 'SET_USER', payload: user });
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  }, []);

  const clearUser = React.useCallback(() => {
    dispatch({ type: 'CLEAR_USER' });
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
    }
  }, []);

  const setError = React.useCallback((error: string) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  }, []);

  const clearError = React.useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);

  const value: SessionContextType = {
    ...state,
    setUser,
    clearUser,
    setError,
    clearError,
  };

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
};

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
};
