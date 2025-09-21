import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AuthUser, SignUpData, SignInData, AuthState } from '../types/auth';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  // If Supabase is not configured, return disabled auth state
  if (!supabase) {
    return {
      user: null,
      loading: false,
      error: null,
      signUp: async () => ({ success: false, error: 'Authentication not configured. Please set up Supabase credentials.' }),
      signIn: async () => ({ success: false, error: 'Authentication not configured. Please set up Supabase credentials.' }),
      signInWithGoogle: async () => ({ success: false, error: 'Authentication not configured. Please set up Supabase credentials.' }),
      signOut: async () => {},
      clearError: () => {},
    };
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          setAuthState(prev => ({ ...prev, error: error.message, loading: false }));
          return;
        }

        if (session?.user) {
          const user: AuthUser = {
            id: session.user.id,
            email: session.user.email!,
            displayName: session.user.user_metadata?.display_name || 
                         session.user.user_metadata?.full_name || 
                         session.user.email?.split('@')[0],
            createdAt: session.user.created_at,
          };
          setAuthState({ user, loading: false, error: null });
        } else {
          setAuthState({ user: null, loading: false, error: null });
        }
      } catch (error: any) {
        console.error('Auth initialization error:', error);
        setAuthState({ user: null, loading: false, error: error.message });
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (session?.user) {
          const user: AuthUser = {
            id: session.user.id,
            email: session.user.email!,
            displayName: session.user.user_metadata?.display_name || 
                         session.user.user_metadata?.full_name || 
                         session.user.email?.split('@')[0],
            createdAt: session.user.created_at,
          };
          setAuthState({ user, loading: false, error: null });
        } else {
          setAuthState({ user: null, loading: false, error: null });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (data: SignUpData) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            display_name: data.displayName || data.email.split('@')[0],
          },
        },
      });

      if (error) throw error;

      if (authData.user && !authData.session) {
        // Email confirmation required
        setAuthState(prev => ({ ...prev, loading: false }));
        return { 
          success: true, 
          message: 'Please check your email to confirm your account.' 
        };
      }

      setAuthState(prev => ({ ...prev, loading: false }));
      return { success: true };
    } catch (error: any) {
      console.error('Sign up error:', error);
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Sign up failed' 
      }));
      return { success: false, error: error.message };
    }
  };

  const signIn = async (data: SignInData) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      setAuthState(prev => ({ ...prev, loading: false }));
      return { success: true };
    } catch (error: any) {
      console.error('Sign in error:', error);
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Sign in failed' 
      }));
      return { success: false, error: error.message };
    }
  };

  const signInWithGoogle = async () => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      // OAuth redirect will handle the rest
      return { success: true };
    } catch (error: any) {
      console.error('Google sign in error:', error);
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message || 'Google sign in failed' 
      }));
      return { success: false, error: error.message };
    }
  };

  const signOut = async () => {
    setAuthState(prev => ({ ...prev, loading: true }));
    
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear local storage
      localStorage.removeItem(`hud-bookmarks-${authState.user?.id}`);
      
      setAuthState({ user: null, loading: false, error: null });
    } catch (error: any) {
      console.error('Sign out error:', error);
      setAuthState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.message 
      }));
    }
  };

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }));
  };

  return {
    ...authState,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    clearError,
  };
};