import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect, useLocalSearchParams, type Href } from 'expo-router';
import { useCallback, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { supabase } from '@/lib/supabase';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { MaxContentWidth } from '../../constants/theme';

export function safeGoBack(fallbackPath: Href = '/') {
  if (router.canGoBack()) router.back();
  else router.replace(fallbackPath);
}

export default function LevelScreen() {
  const { level } = useLocalSearchParams<{ level: string }>();
  const [progressData, setProgressData] = useState<Record<string, number>>({});
  const [stats, setStats] = useState({ streak_count: 1, gems: 0 });
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      async function loadData() {
        setLoading(true);
        // 1. Fetch Lessons from Supabase
        const { data: dbLessons } = await supabase
          .from('lessons')
          .select('*')
          .eq('level', level || 'a1')
          .order('unit', { ascending: true });

        if (dbLessons) setLessons(dbLessons);

        // 2. Load Progress (Cloud is priority)
        let finalProgress: Record<string, number> = {};
        
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // FETCH FROM CLOUD
          const { data } = await supabase.from('user_progress').select('lesson_id, score').eq('user_id', session.user.id);
          if (data) {
            data.forEach(item => { finalProgress[item.lesson_id] = item.score; });
          }

          const { data: userStats } = await supabase.from('user_stats').select('streak_count, gems').eq('user_id', session.user.id).single();
          if (userStats) setStats(userStats);
        } else {
          // FALLBACK TO LOCAL (Only if not logged in)
          const localProgress = await AsyncStorage.getItem('@jarmalka_progress');
          if (localProgress) {
            const parsed = JSON.parse(localProgress);
            if (Array.isArray(parsed)) {
               parsed.forEach((id: string) => { finalProgress[id] = 100; });
            } else {
               finalProgress = parsed;
            }
          }
        }

        setProgressData(finalProgress);
        setLoading(false);
      }
      loadData();
    }, [level])
  );

  const isA1Complete = lessons.length >= 18 && lessons.every(l => progressData[l.id] !== undefined);

  if (loading) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#6366F1" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        
        <View style={styles.topBar}>
          <Pressable onPress={() => safeGoBack('/learn')} style={styles.backBtn}>
            <ThemedText type="title" style={{ fontSize: 24, color: '#1E293B' }}>←</ThemedText>
          </Pressable>
          <ThemedText type="title" style={styles.headerTitle}>Casharrada {level?.toUpperCase()}</ThemedText>
          <View style={styles.statsContainer}>
            <ThemedText style={styles.statText}>🔥 {stats.streak_count}</ThemedText>
            <ThemedText style={styles.statText}>💎 {stats.gems}</ThemedText>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.pathContainer}>
            {lessons.map((lesson, index) => {
              const score = progressData[lesson.id];
              const isCompleted = score !== undefined;
              
              // LOCKING LOGIC (Untouched)
              const previousLessonId = index > 0 ? lessons[index - 1].id : null;
              const isUnlocked = index === 0 || (previousLessonId && progressData[previousLessonId] !== undefined);
              
              const isEven = index % 2 === 0;
              const alignmentStyle: ViewStyle = isEven
                ? { alignSelf: 'flex-start', marginLeft: 20 }
                : { alignSelf: 'flex-end', marginRight: 20 };

              // NEW COLORS FOR PATH
              let nodeColor = '#E2E8F0'; // Locked (Slate)
              let icon = '🔒'; 
              let shadowColor = '#CBD5E1';

              if (isCompleted) {
                if (score >= 80) { nodeColor = '#F59E0B'; icon = '⭐'; shadowColor = '#D97706'; } // Amber (Mastered)
                else { nodeColor = '#F43F5E'; icon = '🔄'; shadowColor = '#E11D48'; } // Rose (Needs Practice)
              } else if (isUnlocked) {
                nodeColor = '#10B981'; icon = '▶'; shadowColor = '#059669'; // Emerald (Active)
              }

              return (
                <View key={lesson.id} style={styles.nodeWrapper}>
                  {index > 0 && (
                    <View style={[styles.pathLine, isCompleted ? { backgroundColor: '#F59E0B' } : { backgroundColor: '#E2E8F0' }]} />
                  )}

                  <Pressable 
                    onPress={() => { 
                        if (isUnlocked) {
                            router.push({ pathname: '/lesson/[id]', params: { id: lesson.id } }); 
                        } else {
                            alert("Fadlan marka hore dhammaystir casharka hore!");
                        }
                    }}
                    // ADDED PRESS ANIMATION
                    style={({ pressed }) => [
                      styles.nodeButton, 
                      alignmentStyle, 
                      { backgroundColor: nodeColor, shadowColor: shadowColor },
                      pressed && { transform: [{ scale: 0.9 }] }
                    ]}
                  >
                    <ThemedText style={styles.nodeIcon}>{icon}</ThemedText>
                  </Pressable>

                  <View style={[styles.titleContainer, alignmentStyle]}>
                    <ThemedText type="title" style={[styles.lessonTitle, !isUnlocked && { color: '#94A3B8' }]}>
                      {lesson.title_so}
                    </ThemedText>
                    <ThemedText type="small" style={styles.lessonSubtitle}>
                      Unit {lesson.unit} · {lesson.title_de}
                    </ThemedText>
                  </View>
                </View>
              );
            })}
          </View>

          {isA1Complete && (
            <View style={{ paddingHorizontal: 20, marginTop: 20, marginBottom: 40 }}>
              <Pressable 
                onPress={() => router.push('/exam' as Href)}
                style={({ pressed }) => [ pressed && { transform: [{ scale: 0.97 }] } ]}
              >
                <View style={{ backgroundColor: '#F59E0B', padding: 20, borderRadius: 20, alignItems: 'center', borderBottomWidth: 6, borderBottomColor: '#D97706', shadowColor: '#64748B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5, elevation: 5 }}>
                  <ThemedText style={{ fontSize: 24, fontWeight: 'bold', color: '#FFF' }}>🏆 Imtixaanka A1</ThemedText>
                  <ThemedText style={{ fontSize: 16, color: '#FFF', marginTop: 5, textAlign: 'center' }}>Qaado imtixaanka rasmiga ah oo hel shahaadaada!</ThemedText>
                </View>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' }, // New Slate background
  safeArea: { flex: 1, maxWidth: MaxContentWidth, width: '100%', alignSelf: 'center' },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 15, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0', shadowColor: '#64748B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  statsContainer: { flexDirection: 'row', gap: 15 },
  statText: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  scrollContent: { paddingBottom: 50 },
  pathContainer: { paddingTop: 30, paddingHorizontal: 20, position: 'relative' },
  nodeWrapper: { position: 'relative', marginBottom: 40, width: '100%' },
  pathLine: { position: 'absolute', top: -40, left: '50%', width: 12, height: 40, marginLeft: -6, zIndex: -1, borderRadius: 6 },
  nodeButton: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 0, elevation: 6, borderWidth: 4, borderColor: 'rgba(255,255,255,0.4)' },
  nodeIcon: { fontSize: 32, color: '#FFF' },
  titleContainer: { marginTop: 10, maxWidth: 160 },
  lessonTitle: { fontSize: 16, lineHeight: 20, color: '#1E293B' },
  lessonSubtitle: { fontSize: 12, color: '#64748B', marginTop: 2 }
});