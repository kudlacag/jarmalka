import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
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
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }]}>
        <ActivityIndicator size="large" color="#6366F1" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor: '#F8FAFC' }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ThemedText type="title" style={styles.heading}>Jarmalka News</ThemedText>
        <ThemedText type="small" style={styles.subheading}>Macluumaad & Akhris (Info & Reading)</ThemedText>

        <FlatList
          data={articles}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <ThemedText style={{ textAlign: 'center', marginTop: 50, color: '#94A3B8' }}>
              Ma jiraan maqaallo cusub wali. (No articles yet)
            </ThemedText>
          }
          renderItem={({ item }) => (
            <Pressable 
              onPress={() => router.push({ pathname: '/article/[id]', params: { id: item.id } })}
              // ADDED PRESS ANIMATION
              style={({ pressed }) => [
                pressed && { transform: [{ scale: 0.97 }] }
              ]}
            >
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
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: 20, paddingBottom: BottomTabInset + Spacing.three, maxWidth: MaxContentWidth, width: '100%', alignSelf: 'center' },
  
  heading: { marginTop: 30, fontSize: 32, fontWeight: 'bold', color: '#1E293B' },
  subheading: { marginBottom: 20, color: '#64748B', fontSize: 16 },
  
  list: { gap: 20, paddingBottom: 40 },
  
  card: { 
    backgroundColor: '#FFFFFF', 
    borderRadius: 20, 
    overflow: 'hidden', 
    shadowColor: '#64748B', 
    shadowOffset: { width: 0, height: 6 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 12, 
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardImage: { width: '100%', height: 180, resizeMode: 'cover' },
  cardContent: { padding: 20, gap: 5 },
  cardTitle: { fontSize: 20, lineHeight: 26, color: '#1E293B' },
  cardSubtitle: { color: '#64748B', fontStyle: 'italic' },
  readMore: { marginTop: 10, color: '#6366F1', fontWeight: 'bold', fontSize: 14 },
});