import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { supabase } from '@/lib/supabase';

export default function LearnScreen() {
  const [stats, setStats] = useState({ streak_count: 1, total_xp: 0, hearts: 7, gems: 0 });

  useFocusEffect(
    useCallback(() => {
      async function loadStats() {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: userStats } = await supabase.from('user_stats').select('streak_count, total_xp, hearts, gems').eq('user_id', session.user.id).single();
          if (userStats) setStats(userStats);
        }
      }
      loadStats();
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
          <ThemedText style={styles.headerSubtitle}>Ku soo dhawow (Welcome)</ThemedText>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* COMPACT ALPHABET BUTTON */}
          <Pressable onPress={() => router.push('/alphabet')} style={{ marginBottom: 15 }}>
            <View style={styles.alphabetCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                <ThemedText style={{ fontSize: 24 }}>🔤</ThemedText>
                <View>
                  <ThemedText style={{ fontSize: 16, fontWeight: 'bold', color: '#333' }}>Alfaabka Jarmalka</ThemedText>
                  <ThemedText style={{ fontSize: 12, color: '#888' }}>Baro dhawaaqa xarfaha (A-Z)</ThemedText>
                </View>
              </View>
              <ThemedText style={{ fontSize: 20 }}>›</ThemedText>
            </View>
          </Pressable>

          {/* MAIN DEUTSCH LESSONS CARD */}
          <Pressable onPress={() => router.push('/lessons/levels')}>
            <View style={styles.lessonsCard}>
              <View style={styles.lessonsCardHeader}>
                <ThemedText style={{ fontSize: 50 }}>🇩🇪</ThemedText>
                <View style={{ flex: 1, marginLeft: 15 }}>
                  <ThemedText type="title" style={{ fontSize: 24, color: '#FFF' }}>Deutsch Lessons</ThemedText>
                  <ThemedText style={{ fontSize: 15, color: 'rgba(255,255,255,0.8)', marginTop: 5 }}>
                    Dooro heerkaaga (A1, A2, B1)
                  </ThemedText>
                </View>
              </View>
              <View style={styles.lessonsCardFooter}>
                <ThemedText style={{ color: '#FFF', fontWeight: 'bold' }}>Bilow Barashada →</ThemedText>
              </View>
            </View>
          </Pressable>

        </ScrollView>
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
  scrollContent: { paddingBottom: 50 },
  
  // Compact Alphabet Styles
  alphabetCard: { 
    backgroundColor: '#FFF', padding: 15, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1, borderColor: '#E5E5E5', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2
  },

  // Main Lessons Card Styles
  lessonsCard: {
    backgroundColor: '#4189DD', // Somali Blue
    borderRadius: 20, overflow: 'hidden',
    shadowColor: '#4189DD', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 8
  },
  lessonsCardHeader: { flexDirection: 'row', padding: 25, alignItems: 'center' },
  lessonsCardFooter: { backgroundColor: 'rgba(0,0,0,0.15)', paddingVertical: 15, paddingHorizontal: 25 }
}); 