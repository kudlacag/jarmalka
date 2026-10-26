import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { a1Lessons } from '../data/lessons';

export default function LearnScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ThemedText type="title" style={styles.heading}>Baro Jarmalka</ThemedText>
        <ThemedText type="small" style={styles.subheading}>Casharrada A1 — bilaash</ThemedText>

        <FlatList
          data={a1Lessons}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push({ pathname: '/lesson/[id]', params: { id: item.id } })}>
              <ThemedView type="backgroundElement" style={styles.card}>
                <ThemedText type="title" style={styles.cardTitle}>{item.title}</ThemedText>
                <ThemedText type="small">{item.titleDe} · Unit {item.unit}</ThemedText>
                <ThemedText type="small" style={styles.bilow}>Bilow →</ThemedText>
              </ThemedView>
            </Pressable>
          )}
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
  card: { padding: Spacing.three, borderRadius: Spacing.three, gap: Spacing.one },
  cardTitle: { fontSize: 17, lineHeight: 22 },
  bilow: { marginTop: Spacing.two, opacity: 0.7 },
  comingSoon: { padding: Spacing.three, borderRadius: Spacing.three, marginTop: Spacing.four, gap: Spacing.one },
});