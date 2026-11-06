import { router, useLocalSearchParams } from 'expo-router';
import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth } from '@/constants/theme';
import { supabase } from '@/lib/supabase';

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [article, setArticle] = useState<any>(null);
  const [lang, setLang] = useState<'so' | 'de'>('so');

  useEffect(() => {
    async function loadArticle() {
      const { data } = await supabase.from('articles').select('*').eq('id', id).single();
      if (data) setArticle(data);
    }
    loadArticle();
  }, [id]);

  function speakGerman() {
    if (article) {
      Speech.speak(article.body_de, { language: 'de-DE', rate: 0.9 });
    }
  }

  if (!article) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4189DD" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <ThemedText style={{ fontSize: 24 }}>←</ThemedText>
            </Pressable>
            
            <View style={styles.toggleContainer}>
              <Pressable onPress={() => setLang('so')} style={[styles.toggleBtn, lang === 'so' && styles.toggleBtnActive]}>
                <ThemedText style={lang === 'so' ? styles.toggleTextActive : styles.toggleText}>🇸🇴 SO</ThemedText>
              </Pressable>
              <Pressable onPress={() => setLang('de')} style={[styles.toggleBtn, lang === 'de' && styles.toggleBtnActive]}>
                <ThemedText style={lang === 'de' ? styles.toggleTextActive : styles.toggleText}>🇩🇪 DE</ThemedText>
              </Pressable>
            </View>
          </View>

          {article.image_url && (
            <Image source={{ uri: article.image_url }} style={styles.heroImage} />
          )}

          <View style={styles.content}>
            <ThemedText type="title" style={styles.title}>
              {lang === 'so' ? article.title_so : article.title_de}
            </ThemedText>

            {lang === 'de' && (
              <Pressable onPress={speakGerman} style={styles.audioBtn}>
                <ThemedText style={{ fontSize: 20, fontWeight: 'bold', color: '#4189DD' }}>🔊 Dhageyso (Listen)</ThemedText>
              </Pressable>
            )}

            <ThemedText style={styles.body}>
              {lang === 'so' ? article.body_so : article.body_de}
            </ThemedText>
          </View>

        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  safeArea: { flex: 1, maxWidth: MaxContentWidth, width: '100%', alignSelf: 'center' },
  scroll: { paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  backBtn: { padding: 5 },
  toggleContainer: { flexDirection: 'row', backgroundColor: '#E5E5E5', borderRadius: 20, padding: 3 },
  toggleBtn: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 18 },
  toggleBtnActive: { backgroundColor: '#FFF', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  toggleText: { fontSize: 14, fontWeight: 'bold', color: '#888' },
  toggleTextActive: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  heroImage: { width: '100%', height: 250, resizeMode: 'cover', marginBottom: 20 },
  content: { paddingHorizontal: 20 },
  title: { fontSize: 26, marginBottom: 15, lineHeight: 32 },
  audioBtn: { backgroundColor: '#E5F0FF', padding: 12, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 20 },
  body: { fontSize: 17, lineHeight: 28, color: '#333' },
});