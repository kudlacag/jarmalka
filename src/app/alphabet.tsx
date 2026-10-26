import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '../components/themed-text';
import { ThemedView } from '../components/themed-view';
import { MaxContentWidth, Spacing } from '../constants/theme';

const ALPHABET = 'A B C D E F G H I J K L M N O P Q R S T U V W X Y Z Ä Ö Ü ß'.split(' ');
const COLORS = ['#58cc02', '#1cb0f6', '#ce82ff', '#ff9600', '#ff4b4b'];

export default function AlphabetScreen() {
  const [germanVoiceId, setGermanVoiceId] = useState<string | undefined>(undefined);

  useEffect(() => {
    async function loadVoice() {
      const voices = await Speech.getAvailableVoicesAsync();
      const deVoice = voices.find(v => v.language.startsWith('de'));
      if (deVoice) setGermanVoiceId(deVoice.identifier);
    }
    loadVoice();
  }, []);

  function speakLetter(letter: string) {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Speech.speak(letter, { language: 'de-DE', voice: germanVoiceId, rate: 0.8 });
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.back}>
            <ThemedText type="title" style={{ fontSize: 20 }}>✕</ThemedText>
          </Pressable>
          <ThemedText type="title">Alfaabka</ThemedText>
          <View style={{ width: 20 }} />
        </View>
        
        <ThemedText type="small" style={styles.instruction}>
          Taabo xaraf kasta si aad u maqasho dhawaaqa Jarmalka.
        </ThemedText>

        <ScrollView contentContainerStyle={styles.grid}>
          {ALPHABET.map((letter, i) => (
            <Pressable
              key={letter}
              onPress={() => speakLetter(letter)}
              style={({ pressed }) => [
                styles.tile,
                { backgroundColor: COLORS[i % COLORS.length] },
                pressed && { opacity: 0.8, transform: [{ scale: 0.95 }] }
              ]}
            >
              <ThemedText style={styles.tileText}>{letter}</ThemedText>
            </Pressable>
          ))}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: Spacing.four, maxWidth: MaxContentWidth, width: '100%', alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: Spacing.four },
  back: { padding: 5 },
  instruction: { marginBottom: Spacing.four, opacity: 0.7 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center', paddingBottom: Spacing.four },
  tile: {
    width: 60, height: 60, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 4,
  },
  tileText: { color: 'white', fontSize: 26, fontWeight: 'bold' },
});