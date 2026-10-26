import { router } from 'expo-router';
import { FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { articles } from '@/data/articles';

export default function InfoScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ThemedText type="title" style={styles.heading}>Jarmalka</ThemedText>
        <ThemedText type="small" style={styles.subheading}>
          Macluumaad muhiim ah oo ku saabsan nololka Jarmalka
        </ThemedText>

        <FlatList
          data={articles}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push(`/article/${item.id}`)}>
              <ThemedView type="backgroundElement" style={styles.card}>
                <ThemedView type="backgroundElement" style={styles.cardRow}>
                  <ThemedText type="title" style={styles.cardTitle}>{item.title}</ThemedText>
                  <ThemedText style={styles.chevron}>›</ThemedText>
                </ThemedView>
                <ThemedText type="small">{item.summary}</ThemedText>
                <ThemedText type="small" style={styles.readMore}>Akhri →</ThemedText>
              </ThemedView>
            </Pressable>
          )}
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
  list: { gap: Spacing.three, paddingBottom: Spacing.four },
  card: { padding: Spacing.three, borderRadius: Spacing.three, gap: Spacing.one },
  cardRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { fontSize: 17, lineHeight: 22, flex: 1 },
  chevron: { fontSize: 24, opacity: 0.5 },
  readMore: { marginTop: Spacing.two, opacity: 0.7 },
});