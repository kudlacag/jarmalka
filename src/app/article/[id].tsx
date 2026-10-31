import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { articles } from '@/data/articles';

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const article = articles.find((a) => a.id === id);

  if (!article) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedText type="title">Ma jirto</ThemedText>
         <Pressable onPress={() => {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/learn');
  }
}}>
  <ThemedText>← Dib u noqo</ThemedText>
</Pressable>

// For the top arrow:
<Pressable onPress={() => {
  if (router.canGoBack()) router.back();
  else router.replace('/learn');
}}>
  <ThemedText style={{ fontSize: 24 }}>←</ThemedText>
</Pressable>
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
          <ThemedText type="title">{article.title}</ThemedText>
          <ThemedText type="small" style={styles.date}>
            Cusboonaysiin: {article.updatedAt}
          </ThemedText>
          <ThemedText style={styles.body}>{article.body}</ThemedText>
          {article.sourceUrl && (
            <ThemedText type="small" style={styles.source}>
              Isha: {article.sourceUrl}
            </ThemedText>
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
  scroll: { gap: Spacing.two, paddingVertical: Spacing.four },
  back: { marginBottom: Spacing.three },
  date: { opacity: 0.6, marginBottom: Spacing.three },
  body: { fontSize: 16, lineHeight: 24 },
  source: { marginTop: Spacing.four, opacity: 0.6 },
});