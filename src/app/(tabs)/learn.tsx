import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { levels } from '@/data/lessons';
import { supabase } from '@/lib/supabase';

export default function LearnScreen() {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [lessonCounts, setLessonCounts] = useState({ a1: 0, a2: 0, b1: 0 });
  // Fallback to 0 instead of 100 so you can see if it fails
  const [stats, setStats] = useState({ streak_count: 1, total_xp: 0, hearts: 7, gems: 0 });

  useFocusEffect(
    useCallback(() => {
      async function loadData() {
        const { data: { session } } = await supabase.auth.getSession();
        let localProgress: string[] = [];

        if (session?.user) {
          // LOGGED IN: 100% Cloud. No local storage allowed.
          const { data } = await supabase.from('user_progress').select('lesson_id').eq('user_id', session.user.id);
          if (data) {
            localProgress = data.map(item => item.lesson_id);
          }

          const { data: userStats } = await supabase.from('user_stats').select('*').eq('user_id', session.user.id).single();
          if (userStats) {
            setStats(userStats);
          } else {
            // If stats are missing for some reason, reset them
            setStats({ streak_count: 1, total_xp: 0, hearts: 7, gems: 0 });
          }
        } else {
          // GUEST: Use Local Storage
          const saved = await AsyncStorage.getItem('@jarmalka_progress');
          if (saved) localProgress = JSON.parse(saved);
        }
        
        setCompletedLessons(localProgress);

        // 3. Dynamic lesson counts
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
      loadData();
    }, [])
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        
        <View style={styles.topBar}>
          <View style={styles.statPill}>
            <ThemedText style={styles.statIcon}>❤️</ThemedText>
            <ThemedText style={styles.statText}>{stats.hearts}</ThemedText>
          </View>
          <View style={styles.statPill}>
            <ThemedText style={styles.statIcon}>💎</ThemedText>
            <ThemedText style={styles.statText}>{stats.gems}</ThemedText>
          </View>
          <View style={styles.statPill}>
            <ThemedText style={styles.statIcon}>🔥</ThemedText>
            <ThemedText style={styles.statText}>{stats.streak_count}</ThemedText>
          </View>
        </View>

        <View style={styles.headerContainer}>
          <ThemedText type="title" style={styles.headerTitle}>Baro Jarmalka</ThemedText>
          <ThemedText style={styles.headerSubtitle}>Dooro heerkaaga (Select your level)</ThemedText>
        </View>

        <Pressable onPress={() => router.push('/alphabet')} style={{ marginBottom: 20 }}>
          <View style={[styles.alphabetCard, { backgroundColor: '#E5F0FF', borderColor: '#4189DD' }]}>
            <View>
              <ThemedText type="title" style={{ fontSize: 20, color: '#4189DD', fontWeight: 'bold' }}>Alfaabka Jarmalka</ThemedText>
              <ThemedText type="small" style={{ color: '#4189DD', marginTop: 4 }}>Baro dhawaaqa xarfaha (A-Z)</ThemedText>
            </View>
            <ThemedText style={{ fontSize: 32 }}>🔤</ThemedText>
          </View>
        </Pressable>

        <FlatList
          data={levels}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const totalInLevel = lessonCounts[item.id as keyof typeof lessonCounts] || 0;
            const completedInLevel = completedLessons.filter(id => id.startsWith(item.id)).length;
            
            const progressText = totalInLevel > 0 
              ? `${completedInLevel} / ${totalInLevel} Cashar` 
              : 'Dhawaan 🚧';

            let cardColor = '#4189DD';
            if (item.id === 'a2') cardColor = '#DD0000';
            if (item.id === 'b1') cardColor = '#FFCE00';

            return (
              <Pressable 
                               onPress={() => {
                  if (totalInLevel > 0) {
                    router.push({ pathname: '/lessons/[level]', params: { level: item.id } });
                  } else {
                    alert("Wali casharro kama jiraan heerkan.");
                  }
                }}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.badge, { backgroundColor: cardColor }]}>
                    <ThemedText style={{ color: item.id === 'b1' ? '#000' : 'white', fontWeight: 'bold', fontSize: 20 }}>
                      {item.title}
                    </ThemedText>
                  </View>
                  <View style={{ flex: 1, marginLeft: 15 }}>
                    <ThemedText type="title" style={{ fontSize: 22, color: '#333' }}>{item.subtitle}</ThemedText>
                    <ThemedText type="small" style={{ opacity: 0.6, marginTop: 4, color: '#555' }}>{progressText}</ThemedText>
                  </View>
                  <ThemedText style={{ fontSize: 24 }}>{item.unlocked && totalInLevel > 0 ? '▶️' : '🔒'}</ThemedText>
                </View>
              </Pressable>
            );
          }}
        />  
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  safeArea: { flex: 1, paddingHorizontal: 20, paddingBottom: BottomTabInset + Spacing.three, maxWidth: MaxContentWidth, width: '100%', alignSelf: 'center' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, marginBottom: 10, gap: 10 },
  statPill: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', paddingVertical: 10, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, gap: 8 },
  statIcon: { fontSize: 20 },
  statText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  headerContainer: { marginTop: 20, marginBottom: 25 },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: '#333' },
  headerSubtitle: { fontSize: 16, color: '#666', marginTop: 5 },
  alphabetCard: { padding: 20, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 2, borderBottomWidth: 6 },
  list: { gap: 16 },
  levelCard: { padding: 20, borderRadius: 16, backgroundColor: '#FFFFFF', borderLeftWidth: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4, borderWidth: 1, borderColor: '#F0F0F0' },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  badge: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 3 },
});