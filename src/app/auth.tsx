import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Make sure this path is correct based on where you saved your supabase client!
// If your supabase.ts is in the root of src, it should be '../lib/supabase' or '../supabase'
import { ThemedText } from '../components/themed-text';
import { ThemedView } from '../components/themed-view';
import { supabase } from '../lib/supabase';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  async function handleAuth() {
    if (!email || !password) {
      Alert.alert("Qalad", "Fadlan geli email iyo password.");
      return;
    }

    setLoading(true);
    // This generates the correct URL for Expo Go or Production
    const redirectUrl = Linking.createURL('/'); 

    if (isSignUp) {
      // --- SIGN UP LOGIC ---
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        Alert.alert("Qalad", error.message);
      } else {
        Alert.alert(
          "Mahadsanid!", 
          "Fadlan hubi email-kaaga si aad u xaqiijiso akoonkaaga (Confirm your email)."
        );
        setIsSignUp(false); // Switch to login mode
      }
    } else {
      // --- LOGIN LOGIC ---
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        Alert.alert("Qalad", error.message);
      } else {
        // Success! Go to the Learn tab
        router.replace('/(tabs)/learn');
      }
    }
    setLoading(false);
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        
        <ThemedText type="title" style={styles.title}>
          {isSignUp ? "Samee Akoon" : "Gal (Login)"}
        </ThemedText>
        <ThemedText style={styles.subtitle}>
          {isSignUp ? "Ku biir Jarmalka maanta" : "Ku soo dhawoow Jarmalka"}
        </ThemedText>

        <TextInput
          style={styles.input}
          placeholder="Email (Tusaale: ali@gmail.com)"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password (ugu yaraan 6 xaraf)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable 
          style={[styles.button, loading && { opacity: 0.7 }]} 
          onPress={handleAuth}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <ThemedText style={styles.buttonText}>
              {isSignUp ? "Isdiiwaangeli" : "Gal"}
            </ThemedText>
          )}
        </Pressable>

        <Pressable onPress={() => setIsSignUp(!isSignUp)} style={styles.switchBtn}>
          <ThemedText style={styles.switchText}>
            {isSignUp ? "Horey ayaad u lahayd akoon? Gal halkan." : "Ma lihid akoon? Isdiiwaangeli halkan."}
          </ThemedText>
        </Pressable>

        {/* ONE CLEAN BACK BUTTON */}
        <Pressable 
          onPress={() => {
            if (router.canGoBack()) {
              router.back();  
            } else {
              router.replace('/(tabs)/learn');
            }
          }} 
          style={styles.backBtn}
        >
          <ThemedText style={{ color: '#888' }}>← Dib u noqo</ThemedText>
        </Pressable>

      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 32, textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 30, opacity: 0.7 },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#E5E5E5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#58cc02',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    borderBottomWidth: 4,
    borderBottomColor: '#46A302',
  },
  buttonText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  switchBtn: { marginTop: 20, alignItems: 'center' },
  switchText: { color: '#1cb0f6', fontSize: 14, fontWeight: 'bold' },
  backBtn: { marginTop: 40, alignItems: 'center' },
});