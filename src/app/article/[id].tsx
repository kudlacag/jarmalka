import { router, useLocalSearchParams } from 'expo-router';
import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth } from '@/constants/theme';
import { supabase } from '@/lib/supabase';

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [article, setArticle] = useState<any>(null);
  const [lang, setLang] = useState<'so' | 'de'>('so');
  
  // New state for fullscreen image
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);

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
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }]}>
        <ActivityIndicator size="large" color="#6366F1" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={[styles.container, { backgroundColor: '#F8FAFC' }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <ThemedText style={{ fontSize: 24, color: '#1E293B' }}>←</ThemedText>
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

          {/* Clickable Image to open Fullscreen */}
          {article.image_url && (
            <Pressable onPress={() => setIsImageFullscreen(true)}>
              <Image source={{ uri: article.image_url }} style={styles.heroImage} />
              <View style={styles.zoomBadge}>
                <ThemedText style={{ fontSize: 12, color: '#FFF', fontWeight: 'bold' }}>🔍 Taabo si aad u weyneysato</ThemedText>
              </View>
            </Pressable>
          )}

          <View style={styles.content}>
            <ThemedText type="title" style={styles.title}>
              {lang === 'so' ? article.title_so : article.title_de}
            </ThemedText>

            {lang === 'de' && (
              <Pressable onPress={speakGerman} style={styles.audioBtn}>
                <ThemedText style={{ fontSize: 20, fontWeight: 'bold', color: '#6366F1' }}>🔊 Dhageyso (Listen)</ThemedText>
              </Pressable>
            )}

            <ThemedText style={styles.body}>
              {lang === 'so' ? article.body_so : article.body_de}
            </ThemedText>
          </View>

        </ScrollView>
      </SafeAreaView>

      {/* FULLSCREEN IMAGE MODAL */}
      <Modal visible={isImageFullscreen} transparent={true} animationType="fade">
        <View style={styles.fullscreenContainer}>
          <Pressable style={styles.closeFullscreenBtn} onPress={() => setIsImageFullscreen(false)}>
            <ThemedText style={{ fontSize: 30, color: '#FFF', fontWeight: 'bold' }}>✕</ThemedText>
          </Pressable>
          <Image source={{ uri: article.image_url }} style={styles.fullscreenImage} resizeMode="contain" />
        </View>
      </Modal>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, maxWidth: MaxContentWidth, width: '100%', alignSelf: 'center' },
  scroll: { paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 15 },
  backBtn: { padding: 5 },
  
  toggleContainer: { flexDirection: 'row', backgroundColor: '#E2E8F0', borderRadius: 20, padding: 4 },
  toggleBtn: { paddingVertical: 6, paddingHorizontal: 16, borderRadius: 16 },
  toggleBtnActive: { backgroundColor: '#FFF', shadowColor: '#64748B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  toggleText: { fontSize: 14, fontWeight: 'bold', color: '#64748B' },
  toggleTextActive: { fontSize: 14, fontWeight: 'bold', color: '#1E293B' },

  heroImage: { width: '100%', height: 250, resizeMode: 'cover', marginBottom: 20 },
  zoomBadge: { position: 'absolute', bottom: 30, right: 20, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  
  content: { paddingHorizontal: 20 },
  title: { fontSize: 26, marginBottom: 15, lineHeight: 32, color: '#1E293B' },
  audioBtn: { backgroundColor: '#EEF2FF', padding: 12, borderRadius: 12, alignSelf: 'flex-start', marginBottom: 20 },
  body: { fontSize: 17, lineHeight: 28, color: '#334155' },

  // Fullscreen Modal Styles
  fullscreenContainer: { flex: 1, backgroundColor: 'rgba(0,0,0,0.95)', justifyContent: 'center', alignItems: 'center' },
  fullscreenImage: { width: '100%', height: '100%' },
  closeFullscreenBtn: { position: 'absolute', top: 50, right: 20, zIndex: 10, padding: 10, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 30 }
});