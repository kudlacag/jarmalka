import { Session } from '@supabase/supabase-js';
import { createContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// ... (keep your type definitions)

export const AuthContext = createContext<{
  session: Session | null;
  loading: boolean;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check the session and verify the user with the server
    async function verifyUser() {
      // getSession() checks local cache. getUser() checks the actual server.
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (session) {
        // Verify the user actually exists on the server
        const { error: userError } = await supabase.auth.getUser();
        
        if (userError || sessionError) {
          // User was deleted by admin or token is invalid! Force logout.
          await supabase.auth.signOut();
          setSession(null);
        } else {
          setSession(session);
        }
      } else {
        setSession(null);
      }
      setLoading(false);
    }

    verifyUser();

    // 2. Listen for auth changes (login, logout, token refresh)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
}