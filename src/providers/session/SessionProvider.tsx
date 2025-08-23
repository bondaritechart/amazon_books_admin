'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CurrentUser } from 'types/graphql';

interface SessionState {
  user: CurrentUser | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

type SessionAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: CurrentUser }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_USER' }
  | { type: 'CLEAR_ERROR' };

interface SessionContextType extends SessionState {
  setUser: (user: CurrentUser) => void;
  clearUser: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  clearError: () => void;
}

const initialState: SessionState = {
  user: null,
  isLoading: true,
  error: null,
  isAuthenticated: false,
};

const sessionReducer = (state: SessionState, action: SessionAction): SessionState => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'CLEAR_USER':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
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
  initialUser?: CurrentUser | null;
}

export const SessionProvider: React.FC<SessionProviderProps> = ({
  children,
  initialUser = null,
}) => {
  const [state, dispatch] = useReducer(sessionReducer, {
    ...initialState,
    user: initialUser,
    isAuthenticated: !!initialUser,
    isLoading: !initialUser, // If we have initial user, we're not loading
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

  const setUser = React.useCallback((user: CurrentUser) => {
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

  const setLoading = React.useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
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
    setLoading,
    setError,
    clearError,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}; 