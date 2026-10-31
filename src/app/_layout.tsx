// src/app/_layout.tsx
import * as Linking from 'expo-linking';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '../components/animated-icon';
import { AuthProvider } from '../context/AuthContext';
// Make sure this path is correct for your Supabase client
import { supabase } from '../lib/supabase';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const [session, setSession] = useState<Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session']>(null);
  const [loading, setLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setSession(data.session);
        setLoading(false);
      }
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setLoading(false);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  // 1. Listen for the Email Confirmation Deep Link
  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const url = event.url;
      
      // Check for a Supabase auth code or tokens in the deep link.
      if (url.includes('access_token') || url.includes('error_description')) {
        try {
          const parsedUrl = new URL(url);
          const params = new URLSearchParams(
            `${parsedUrl.search.slice(1)}&${parsedUrl.hash.slice(1)}`,
          );
          const code = params.get('code');

          let error;
          if (code) {
            ({ error } = await supabase.auth.exchangeCodeForSession(code));
          } else {
            const access_token = params.get('access_token');
            const refresh_token = params.get('refresh_token');
            if (!access_token || !refresh_token) return;

            ({ error } = await supabase.auth.setSession({ access_token, refresh_token }));
          }
          
          if (!error) {
            // Successfully confirmed! Send them to the Learn tab.
            router.replace('/(tabs)/learn');
          }
        } catch (e) {
          console.log("Error handling deep link:", e);
        }
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);
    
    // Handle the case where the app was closed and opened by the link
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => subscription.remove();
  }, []);

  // 2. Route Protection Logic
  useEffect(() => {
    if (loading) return;

    const isAuthScreen = segments[0] === 'auth';
    
    // Define protected routes
    const isLearnTab = segments[0] === '(tabs)' && segments[1] === 'learn';
    const isLessonList = segments[0] === 'lessons';
    const isLessonPlayer = segments[0] === 'lesson';

    // If not logged in and trying to access protected routes -> Go to Auth
    if (!session && !isAuthScreen && (isLearnTab || isLessonList || isLessonPlayer)) {
      router.replace('/auth');
    }
    
    // If logged in and on the Auth screen -> Go to Learn
    if (session && isAuthScreen) {
      router.replace('/(tabs)/learn');
    }

  }, [session, loading, segments]);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="lessons/[level]" options={{ headerShown: false }} />
        <Stack.Screen name="lesson/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        
      </Stack>



    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}