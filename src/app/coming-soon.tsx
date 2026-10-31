import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnimatedButton } from 'react-native-3d-animated-buttons';
import { ThemedText } from '../components/themed-text';
import { ThemedView } from '../components/themed-view';
import { MaxContentWidth, Spacing } from '../constants/theme';
import { supabase } from '../lib/supabase';

export default function ComingSoonScreen() {
  const [email, setEmail] = useState('');
 
  async function handleSubscribe() {
    if (!email.includes('@')) {
      Alert.alert("Qalad", "Fadlan geli email sax ah.");
      return;
    }
    try {
      // Save to Supabase Waitlist table
      const { error } = await supabase.from('waitlist').insert({ email: email });
      
      if (error) {
        console.log(error);
        Alert.alert("Qalad", "Isku day mar kale.");
        return;
      }

      Alert.alert("Mahadsanid!", "Waan ku soo wici doonaa marka A2 & B1 diyaar yihiin.");
      if (router.canGoBack()) router.back();
      else router.replace('/learn');
    } catch (e) {
      Alert.alert("Qalad", "Isku day mar kale.");
    }  
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ThemedText type="title" style={{ fontSize: 24 }}>✕</ThemedText>
        </Pressable>

        <View style={styles.content}>
          <ThemedText style={{ fontSize: 60, textAlign: 'center', marginBottom: 20 }}>🚧</ThemedText>
          <ThemedText type="title" style={{ textAlign: 'center' }}>A2 & B1 Dhawaan</ThemedText>
          <ThemedText style={{ textAlign: 'center', marginTop: 10, opacity: 0.7 }}>
            Geli email-kaaga si aan kuugu wargelino marka casharrada cusub diyaar yihiin.
          </ThemedText>

          <TextInput
            style={styles.input}
            placeholder="Email-kaaga (Tusaale: ali@gmail.com)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={{ marginTop: 20 }}>
            <AnimatedButton 
              title="Iisoo diiwaangeli (Subscribe)" 
              onPress={handleSubscribe} 
              backgroundColor="#DD0000" 
              shadowColor="#990000" 
              fullWidth 
            />
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: Spacing.four, maxWidth: MaxContentWidth, width: '100%', alignSelf: 'center' },
  backBtn: { padding: 10, marginTop: 10 },
  content: { flex: 1, justifyContent: 'center', paddingBottom: 100 },
  input: { backgroundColor: '#FFF', borderWidth: 2, borderColor: '#E5E5E5', borderRadius: 12, padding: 16, fontSize: 16, marginTop: 30 },
});