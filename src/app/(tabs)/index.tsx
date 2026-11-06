import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme'; // Using @/ here too
import { supabase } from '@/lib/supabase';

export default function InfoScreen() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticles() {
      const { data, error } = await supabase.from('articles').select('*').order('created_at', { ascending: false });
      if (data) setArticles(data);
      setLoading(false);
    }
    loadArticles();
  }, []);

  if (loading) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4189DD" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ThemedText type="title" style={styles.heading}>Jarmalka News</ThemedText>
        <ThemedText type="small" style={styles.subheading}>Macluumaad & Akhris (Info & Reading)</ThemedText>

        <FlatList
          data={articles}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <ThemedText style={{ textAlign: 'center', marginTop: 50, color: '#888' }}>
              Ma jiraan maqaallo cusub wali. (No articles yet)
            </ThemedText>
          }
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push({ pathname: '/article/[id]', params: { id: item.id } })}>
              <View style={styles.card}>
                {item.image_url && (
                  <Image source={{ uri: item.image_url }} style={styles.cardImage} />
                )}
                <View style={styles.cardContent}>
                  <ThemedText type="title" style={styles.cardTitle}>{item.title_so}</ThemedText>
                  <ThemedText type="small" style={styles.cardSubtitle}>{item.title_de}</ThemedText>
                  <ThemedText type="small" style={styles.readMore}>Akhri maanta →</ThemedText>
                </View>
              </View>
            </Pressable>
          )}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  safeArea: { flex: 1, paddingHorizontal: 20, paddingBottom: BottomTabInset + Spacing.three, maxWidth: MaxContentWidth, width: '100%', alignSelf: 'center' },
  heading: { marginTop: 30, fontSize: 32, fontWeight: 'bold' },
  subheading: { marginBottom: 20, color: '#666' },
  list: { gap: 20, paddingBottom: 40 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  cardImage: { width: '100%', height: 180, resizeMode: 'cover' },
  cardContent: { padding: 20, gap: 5 },
  cardTitle: { fontSize: 20, lineHeight: 26 },
  cardSubtitle: { color: '#888', fontStyle: 'italic' },
  readMore: { marginTop: 10, color: '#4189DD', fontWeight: 'bold' },
});