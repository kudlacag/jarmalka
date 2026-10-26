import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { a1Lessons } from '@/data/lessons';

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = a1Lessons.find((l) => l.id === id);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!lesson) {
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

  const exercise = lesson.exercises[index];
  const isAnswered = selected !== null;
  const total = lesson.exercises.length;
  const isLast = index + 1 >= total;

  function choose(option: string) {
    if (isAnswered) return;
    setSelected(option);
    if (option === exercise.correctAnswer) setScore((s) => s + 1);
  }

  function next() {
    if (isLast) setFinished(true);
    else { setIndex((i) => i + 1); setSelected(null); }
  }

  function restart() {
    setIndex(0); setSelected(null); setScore(0); setFinished(false);
  }

  if (finished) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scroll}>
            <ThemedText type="title">Waad dhammaysay! 🎉</ThemedText>
            <ThemedText style={styles.scoreText}>Natiijada: {score} / {total}</ThemedText>
            <Pressable style={styles.button} onPress={restart}>
              <ThemedText style={styles.buttonText}>Mar kale bilow</ThemedText>
            </Pressable>
            <Pressable onPress={() => router.back()} style={styles.back}>
              <ThemedText type="small">← Dib u noqo</ThemedText>
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
          <Pressable onPress={() => router.back()} style={styles.back}>
            <ThemedText type="small">← Dib u noqo</ThemedText>
          </Pressable>

          <ThemedText type="small" style={styles.progress}>
            Su'aasha {index + 1} / {total}
          </ThemedText>
          <ThemedText type="title" style={styles.prompt}>{exercise.prompt}</ThemedText>
          <ThemedText type="small" style={styles.instruction}>
            Dooro tarjumaada saxda ah:
          </ThemedText>

          {exercise.options.map((option) => {
            const isThis = selected === option;
            const isRight = option === exercise.correctAnswer;
            let bg: string | undefined;
            if (isAnswered) {
              if (isRight) bg = '#2e7d32';
              else if (isThis) bg = '#c62828';
            }
            return (
              <Pressable
                key={option}
                onPress={() => choose(option)}
                disabled={isAnswered}
                style={[styles.option, bg ? { backgroundColor: bg, borderColor: bg } : null]}
              >
                <ThemedText style={bg ? styles.optionTextActive : undefined}>{option}</ThemedText>
              </Pressable>
            );
          })}

          {isAnswered && (
            <Pressable style={styles.button} onPress={next}>
              <ThemedText style={styles.buttonText}>
                {isLast ? 'Dhammaystir' : 'Xiga →'}
              </ThemedText>
            </Pressable>
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
  scroll: { paddingVertical: Spacing.four, gap: Spacing.two },
  back: { marginBottom: Spacing.three },
  progress: { opacity: 0.6 },
  prompt: { marginVertical: Spacing.three },
  instruction: { marginBottom: Spacing.two },
  option: {
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.three,
    borderWidth: 1,
    borderColor: 'rgba(128,128,128,0.4)',
    marginBottom: Spacing.two,
  },
  optionTextActive: { color: 'white' },
  button: {
    backgroundColor: '#0a7ea4',
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.three,
    alignItems: 'center',
    marginTop: Spacing.three,
  },
  buttonText: { color: 'white' },
  scoreText: { fontSize: 18, marginVertical: Spacing.three },
});