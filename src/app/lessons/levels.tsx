import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { supabase } from '@/lib/supabase';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { MaxContentWidth } from '../../constants/theme';
import { levels } from '../../data/lessons';

export default function LevelsScreen() {
  const [lessonCounts, setLessonCounts] = useState({ a1: 0, a2: 0, b1: 0 });

  useFocusEffect(
    useCallback(() => {
      async function fetchCounts() {
        const { data: allLessons } = await supabase.from('lessons').select('id, level');
        if (allLessons) {
          const counts = { a1: 0, a2: 0, b1: 0 };
          allLessons.forEach((lesson: any) => {
            if (lesson.level === 'a1') counts.a1++;
            if (lesson.level === 'a2') counts.a2++;
            if (lesson.level === 'b1') counts.b1++;
          });
          setLessonCounts(counts);
        }
      }
      fetchCounts();
    }, [])
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ThemedText style={{ fontSize: 24 }}>←</ThemedText>
          </Pressable>
          <ThemedText type="title" style={{ fontSize: 20 }}>Deutsch Lessons</ThemedText>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {levels.map((item) => {
            const totalInLevel = lessonCounts[item.id as keyof typeof lessonCounts] || 0;
            
            let cardColor = '#4189DD';
            if (item.id === 'a2') cardColor = '#DD0000';
            if (item.id === 'b1') cardColor = '#FFCE00';

            return (
              <Pressable 
                key={item.id}
                onPress={() => {
                  if (totalInLevel > 0) {
                    router.push({ pathname: '/lessons/[level]', params: { level: item.id } });
                  } else {
                    alert("Wali casharro kama jiraan heerkan.");
                  }
                }}
                style={({ pressed }) => [
                  styles.levelCard,
                  { borderLeftColor: cardColor },
                  pressed && { transform: [{ scale: 0.98 }] }
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.badge, { backgroundColor: cardColor }]}>
                    <ThemedText style={{ color: item.id === 'b1' ? '#000' : 'white', fontWeight: 'bold', fontSize: 20 }}>
                      {item.title}
                    </ThemedText>
                  </View>
                  <View style={{ flex: 1, marginLeft: 15 }}>
                    <ThemedText type="title" style={{ fontSize: 22, color: '#333' }}>{item.subtitle}</ThemedText>
                    <ThemedText type="small" style={{ opacity: 0.6, marginTop: 4, color: '#555' }}>
                      {totalInLevel} Cashar
                    </ThemedText>
                  </View>
                  <ThemedText style={{ fontSize: 24 }}>{totalInLevel > 0 ? '▶️' : '🔒'}</ThemedText>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  safeArea: { flex: 1, maxWidth: MaxContentWidth, width: '100%', alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15 },
  backBtn: { padding: 5 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 10, gap: 16, paddingBottom: 40 },
  levelCard: { padding: 20, borderRadius: 16, backgroundColor: '#FFFFFF', borderLeftWidth: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4, borderWidth: 1, borderColor: '#F0F0F0' },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  badge: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3 },
});