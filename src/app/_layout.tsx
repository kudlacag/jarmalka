import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '../components/animated-icon';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {  
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="article/[id]" options={{ title: 'Macluumaad' }} />
        <Stack.Screen name="lesson/[id]" options={{ title: 'Cashar' }} />
      </Stack>
    </ThemeProvider>
  );
}