import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '../../constants/theme';
import { a1Lessons } from '../../data/lessons';

export default function LearnScreen() {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  // Refresh progress every time the user opens this tab
  useFocusEffect(
    useCallback(() => {
      async function loadProgress() {
        const saved = await AsyncStorage.getItem('@jarmalka_progress');
        if (saved) setCompletedLessons(JSON.parse(saved));
      }
      loadProgress();
    }, [])
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ThemedText type="title" style={styles.heading}>Baro Jarmalka</ThemedText>
        <ThemedText type="small" style={styles.subheading}>Casharrada A1 — bilaash</ThemedText>

        {/* Alphabet Button */}
        <Pressable onPress={() => router.push('/alphabet')} style={{ marginBottom: 20 }}>
          <ThemedView type="backgroundElement" style={styles.alphabetCard}>
            <View>
              <ThemedText type="title" style={{ fontSize: 18 }}>Alfaabka Jarmalka</ThemedText>
              <ThemedText type="small">Baro dhawaaqa xarfaha (A-Z)</ThemedText>
            </View>
            <ThemedText style={{ fontSize: 24 }}>🔤</ThemedText>
          </ThemedView>
        </Pressable>

        <FlatList
          data={a1Lessons}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const isCompleted = completedLessons.includes(item.id);
            return (
              <Pressable onPress={() => router.push({ pathname: '/lesson/[id]', params: { id: item.id } })}>
                <ThemedView type="backgroundElement" style={styles.card}>
                  <View style={styles.cardHeader}>
                    <ThemedText type="title" style={styles.cardTitle}>{item.title}</ThemedText>
                    {isCompleted && <ThemedText style={{ fontSize: 20 }}>✅</ThemedText>}
                  </View>
                  <ThemedText type="small">{item.titleDe} · Unit {item.unit}</ThemedText>
                  <ThemedText type="small" style={styles.bilow}>
                    {isCompleted ? 'Mar kale samee →' : 'Bilow →'}
                  </ThemedText>
                </ThemedView>
              </Pressable>
            );
          }}
          ListFooterComponent={
            <ThemedView type="backgroundElement" style={styles.comingSoon}>
              <ThemedText>A2 & B1 — Dhawaan 🚧</ThemedText>
              <ThemedText type="small">Cusboonaysiin dhawaan</ThemedText>
            </ThemedView>
          }
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  heading: { marginTop: Spacing.four },
  subheading: { marginBottom: Spacing.four },
  list: { gap: Spacing.three },
  alphabetCard: { padding: 20, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  card: { padding: Spacing.three, borderRadius: Spacing.three, gap: Spacing.one },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 17, lineHeight: 22 },
  bilow: { marginTop: Spacing.two, opacity: 0.7 },
  comingSoon: { padding: Spacing.three, borderRadius: Spacing.three, marginTop: Spacing.four, gap: Spacing.one, alignItems: 'center' },
});