import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { MaxContentWidth } from '@/constants/theme';
import { supabase } from '@/lib/supabase';

const AVATARS = ['🧑🏾‍🎓', '👩🏽‍💻', '👨🏿‍🍳', '🧕🏽', '👶🏾', '🦁', '🦉', '🚀', '⚽', '🎨'];

export default function ProfileScreen() {
  const [stats, setStats] = useState<any>({ total_xp: 0, streak_count: 1, gems: 0, avatar_emoji: '🧑🏾‍🎓' });
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');

  // FIXED: Use useFocusEffect to refresh data every time the tab is opened
  useFocusEffect(
    useCallback(() => {
      async function loadStats() {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setEmail(session.user.email || '');
          setUserId(session.user.id);
          const { data } = await supabase.from('user_stats').select('*').eq('user_id', session.user.id).single();
          if (data) setStats(data);
        }
      }
      loadStats();
    }, [])
  );

  async function changeAvatar(emoji: string) {
    setStats({ ...stats, avatar_emoji: emoji });
    await supabase.from('user_stats').update({ avatar_emoji: emoji }).eq('user_id', userId);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.replace('/auth');
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          
          <View style={styles.profileHeader}>
            <View style={styles.avatar}>
              <ThemedText style={styles.avatarEmoji}>{stats.avatar_emoji}</ThemedText>
            </View>
            <ThemedText type="title" style={styles.name}>Ardayga Jarmalka</ThemedText>
            <ThemedText style={styles.email}>{email}</ThemedText>
          </View>

          <View style={styles.emojiSelectorContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.emojiScroll}>
              {AVATARS.map((emoji) => (
                <Pressable 
                  key={emoji} 
                  onPress={() => changeAvatar(emoji)}
                  style={[
                    styles.emojiOption, 
                    stats.avatar_emoji === emoji && styles.emojiOptionSelected
                  ]}
                >
                  <ThemedText style={{ fontSize: 28 }}>{emoji}</ThemedText>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <ThemedText style={styles.statIcon}>🔥</ThemedText>
              <ThemedText style={styles.statValue}>{stats.streak_count}</ThemedText>
              <ThemedText style={styles.statLabel}>Streak</ThemedText>
            </View>
            <View style={styles.statCard}>
              <ThemedText style={styles.statIcon}>⚡</ThemedText>
              <ThemedText style={styles.statValue}>{stats.total_xp}</ThemedText>
              <ThemedText style={styles.statLabel}>Total XP</ThemedText>
            </View>
            <View style={styles.statCard}>
              <ThemedText style={styles.statIcon}>💎</ThemedText>
              <ThemedText style={styles.statValue}>{stats.gems}</ThemedText>
              <ThemedText style={styles.statLabel}>Gems</ThemedText>
            </View>
          </View>

          <ThemedText type="title" style={styles.sectionTitle}>Abaalmarintaada (Achievements)</ThemedText>
          
          <View style={styles.achievementsGrid}>
            <View style={[styles.badgeCard, stats.total_xp >= 10 ? styles.badgeUnlocked : styles.badgeLocked]}>
              <ThemedText style={styles.badgeIcon}>🌱</ThemedText>
              <ThemedText style={styles.badgeTitle}>Bilowga</ThemedText>
              <ThemedText style={styles.badgeDesc}>+10 XP</ThemedText>
            </View>
            <View style={[styles.badgeCard, stats.streak_count >= 3 ? styles.badgeUnlocked : styles.badgeLocked]}>
              <ThemedText style={styles.badgeIcon}>🔥</ThemedText>
              <ThemedText style={styles.badgeTitle}>3 Maalmood</ThemedText>
              <ThemedText style={styles.badgeDesc}>3 Day Streak</ThemedText>
            </View>
            <View style={[styles.badgeCard, stats.total_xp >= 100 ? styles.badgeUnlocked : styles.badgeLocked]}>
              <ThemedText style={styles.badgeIcon}>⚡</ThemedText>
              <ThemedText style={styles.badgeTitle}>Xoog</ThemedText>
              <ThemedText style={styles.badgeDesc}>100 XP</ThemedText>
            </View>
            <View style={[styles.badgeCard, { opacity: 0.4 }]}>
              <ThemedText style={styles.badgeIcon}>🏆</ThemedText>
              <ThemedText style={styles.badgeTitle}>A1 Master</ThemedText>
              <ThemedText style={styles.badgeDesc}>Finish A1</ThemedText>
            </View>
          </View>

          <Pressable onPress={handleLogout} style={styles.logoutBtn}>
            <ThemedText style={{ color: '#ea2b2b', fontWeight: 'bold', fontSize: 16 }}>Ka bax (Logout)</ThemedText>
          </Pressable>

        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  safeArea: { flex: 1, paddingHorizontal: 20, maxWidth: MaxContentWidth, width: '100%', alignSelf: 'center' },
  scroll: { paddingBottom: 50 },
  profileHeader: { alignItems: 'center', marginTop: 20, marginBottom: 15 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#E5F0FF', alignItems: 'center', justifyContent: 'center', marginBottom: 15, borderWidth: 4, borderColor: '#4189DD' },
  avatarEmoji: { fontSize: 55, lineHeight: 65, textAlign: 'center', textAlignVertical: 'center' },
  name: { fontSize: 24, fontWeight: 'bold' },
  email: { fontSize: 14, color: '#888', marginTop: 5 },
  
  emojiSelectorContainer: { marginBottom: 30 },
  emojiScroll: { gap: 12, paddingHorizontal: 5, paddingVertical: 10 },
  emojiOption: { width: 55, height: 55, borderRadius: 28, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'transparent' },
  emojiOptionSelected: { borderColor: '#58cc02', backgroundColor: '#F7FFF2', transform: [{ scale: 1.1 }] },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginBottom: 40 },
  statCard: { flex: 1, backgroundColor: '#FFF', borderRadius: 16, padding: 15, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  statIcon: { fontSize: 24, marginBottom: 5 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  statLabel: { fontSize: 12, color: '#888', marginTop: 2 },
  sectionTitle: { fontSize: 20, marginBottom: 15 },
  achievementsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15, justifyContent: 'space-between' },
  badgeCard: { width: '47%', backgroundColor: '#FFF', padding: 20, borderRadius: 16, alignItems: 'center', borderWidth: 2 },
  badgeUnlocked: { borderColor: '#FFCE00', backgroundColor: '#FFFDF5' },
  badgeLocked: { borderColor: '#E5E5E5', opacity: 0.5 },
  badgeIcon: { fontSize: 32, marginBottom: 10 },
  badgeTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  badgeDesc: { fontSize: 12, color: '#888', marginTop: 4 },
  logoutBtn: { marginTop: 40, padding: 15, alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: '#ea2b2b' }
});