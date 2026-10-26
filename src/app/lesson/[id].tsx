import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AnimatedButton } from 'react-native-3d-animated-buttons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { MaxContentWidth, Spacing } from '../../constants/theme';
import { a1Lessons } from '../../data/lessons';

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = a1Lessons.find((l) => l.id === id);
  
  // 1. ALL HOOKS MUST BE AT THE TOP
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [germanVoiceId, setGermanVoiceId] = useState<string | undefined>(undefined);

  const exercise = lesson?.exercises[index];
  const isAnswered = selected !== null;
  const total = lesson?.exercises.length || 0;
  const isLast = index + 1 >= total;

  // 2. FIND THE GERMAN VOICE ON MOUNT
  useEffect(() => {
    async function loadGermanVoice() {
      try {
        const voices = await Speech.getAvailableVoicesAsync();
        const deVoice = voices.find(v => v.language.startsWith('de'));
        if (deVoice) {
          setGermanVoiceId(deVoice.identifier);
        }
      } catch (e) {
        console.warn("Could not load voices", e);
      }
    }
    loadGermanVoice();
  }, []);

  // 3. SPEAK AND SHUFFLE ON QUESTION CHANGE
  useEffect(() => {
    if (exercise) {
      Speech.stop();
      Speech.speak(exercise.prompt, {
        language: 'de-DE',
        voice: germanVoiceId, // Forces the German voice
        rate: 0.9,
      });

      const options = [...exercise.options];
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }
      setShuffledOptions(options);
    }
  }, [index, exercise, germanVoiceId]);

  // 4. NOW WE CAN DO CONDITIONAL CHECKS
  if (!lesson || !exercise) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedText type="title">Cashar la helin</ThemedText>
          <Pressable onPress={() => router.back()} style={styles.back}>
            <ThemedText type="small">← Dib u noqo</ThemedText>
          </Pressable>
        </SafeAreaView>
      </ThemedView>
    );
  }

  function speakAgain() {
    if (exercise) {
      Speech.speak(exercise.prompt, {
        language: 'de-DE',
        voice: germanVoiceId,
        rate: 0.9,
      });
    }
  }

  function choose(option: string) {
    if (isAnswered) return;
    setSelected(option);
    if (option === exercise?.correctAnswer) {
      setScore((s) => s + 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }

  function next() {
    if (isLast) setFinished(true);
    else { setIndex((i) => i + 1); setSelected(null); }
  }

  function restart() {
    setIndex(0); setSelected(null); setScore(0); setFinished(false);
  }

  const progressPercentage = (index / total) * 100;

  if (finished) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scroll}>
            <ThemedText type="title">Waad dhammaysay! 🎉</ThemedText>
            <ThemedText style={styles.scoreText}>Natiijada: {score} / {total}</ThemedText>
            <AnimatedButton title="Mar kale bilow" onPress={restart} backgroundColor="#58cc02" shadowColor="#58a700" fullWidth />
            <Pressable onPress={() => router.back()} style={styles.back}>
              <ThemedText type="small" style={{ textAlign: 'center', marginTop: 20 }}>← Dib u noqo</ThemedText>
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll}>
          
          <View style={styles.topBar}>
            <Pressable onPress={() => router.back()} style={styles.closeBtn}>
              <ThemedText type="title" style={{ fontSize: 20 }}>✕</ThemedText>
            </Pressable>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
            </View>
            <ThemedText type="small" style={styles.counter}>{index + 1}/{total}</ThemedText>
          </View>

          <ThemedText type="small" style={styles.instruction}>Dooro tarjumaada saxda ah:</ThemedText>
          
          <View style={styles.promptContainer}>
            <ThemedText type="title" style={styles.prompt}>{exercise.prompt}</ThemedText>
            <Pressable onPress={speakAgain} style={styles.audioBtn}>
              <ThemedText style={{ fontSize: 24 }}>🔊</ThemedText>
            </Pressable>
          </View>

          <View style={styles.optionsContainer}>
            {shuffledOptions.map((option) => {
              const isThis = selected === option;
              const isRight = option === exercise.correctAnswer;
              
              let bgColor = '#FFFFFF';
              let shadowColor = '#E5E5E5';
              let textColor = '#333333';

              if (isAnswered) {
                if (isRight) { bgColor = '#d7ffb8'; shadowColor = '#a5d68c'; textColor = '#58a700'; }
                else if (isThis) { bgColor = '#ffdfe0'; shadowColor = '#ea2b2b'; textColor = '#ea2b2b'; }
              }

              return (
                <View key={option} style={{ marginBottom: 12 }}>
                   <AnimatedButton
                    title={option}
                    onPress={() => choose(option)}
                    disabled={isAnswered}
                    backgroundColor={bgColor}
                    shadowColor={shadowColor}
                    textColor={textColor}
                    fullWidth
                    hapticStyle="Light"
                  />
                </View>
              );
            })}
          </View>

          {isAnswered && (
            <View style={{ marginTop: 20 }}>
              <AnimatedButton 
                title={isLast ? "Dhammaystir" : "Xiga →"} 
                onPress={next} 
                backgroundColor="#58cc02" 
                shadowColor="#58a700" 
                fullWidth 
                hapticStyle="Medium"
              />
            </View>
          )}

        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  scroll: { paddingVertical: Spacing.four, flexGrow: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 30, gap: 15 },
  closeBtn: { padding: 5 },
  progressBarBg: { flex: 1, height: 14, backgroundColor: '#E5E5E5', borderRadius: 7, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#58cc02', borderRadius: 7 },
  counter: { fontWeight: 'bold', opacity: 0.5 },
  instruction: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, opacity: 0.8 },
  promptContainer: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 30 },
  prompt: { fontSize: 28 },
  audioBtn: { padding: 10, backgroundColor: '#E5F0FF', borderRadius: 12 },
  optionsContainer: { marginTop: 10 },
  scoreText: { fontSize: 22, marginVertical: 30, fontWeight: 'bold' },
  back: { marginTop: 20 }
});