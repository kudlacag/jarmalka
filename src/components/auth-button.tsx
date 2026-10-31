// src/components/auth-button.tsx
import { Session } from '@supabase/supabase-js';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { AnimatedButton } from 'react-native-3d-animated-buttons';
import { supabase } from '../lib/supabase'; // Adjust this path if your supabase file is elsewhere
import { ThemedText } from './themed-text';

export function AuthButton() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in when the component loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for changes (Login / Logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(error.message);
    } else {
      alert('Waad ka baxday (Logged out successfully)');
      router.replace('/'); // Send them back to home/info tab
    }
  }

  if (loading) return null; // Don't show anything while checking the session

  return (
    <View style={{ marginVertical: 20 }}>
      {session ? (
        // USER IS LOGGED IN
        <View>
          <ThemedText style={{ textAlign: 'center', marginBottom: 10, opacity: 0.7 }}>
            Waxaad ku xiran tahay: {session.user.email}
          </ThemedText>
          <AnimatedButton 
            title="Ka bax (Logout)" 
            onPress={handleLogout} 
            backgroundColor="#ea2b2b" // Red
            shadowColor="#c62828" 
            fullWidth 
          />
        </View>
      ) : (
   
        <AnimatedButton 
          title="Gal (Login)" 
          onPress={() => router.push('/login')} // Make sure you have a login screen at /login
          backgroundColor="#4189DD" // Somali Blue
          shadowColor="#2b5a91" 
          fullWidth 
        />
      )}
    </View>
  );
}