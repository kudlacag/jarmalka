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
    <ThemedView style={[styles.container, { backgroundColor: '#F8FAFC' }]}>
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
                  style={({ pressed }) => [
                    styles.emojiOption, 
                    stats.avatar_emoji === emoji && styles.emojiOptionSelected,
                    pressed && { transform: [{ scale: 0.9 }] }
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

          <Pressable 
            onPress={handleLogout} 
            style={({ pressed }) => [styles.logoutBtn, pressed && { transform: [{ scale: 0.97 }] }]}
          >
            <ThemedText style={{ color: '#F43F5E', fontWeight: 'bold', fontSize: 16 }}>Ka bax (Logout)</ThemedText>
          </Pressable>

        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: 20, maxWidth: MaxContentWidth, width: '100%', alignSelf: 'center' },
  scroll: { paddingBottom: 50 },
  profileHeader: { alignItems: 'center', marginTop: 20, marginBottom: 15 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#EEF2FF', alignItems: 'center', justifyContent: 'center', marginBottom: 15, borderWidth: 4, borderColor: '#6366F1' },
  avatarEmoji: { fontSize: 55, lineHeight: 65, textAlign: 'center', textAlignVertical: 'center' },
  name: { fontSize: 24, fontWeight: 'bold', color: '#1E293B' },
  email: { fontSize: 14, color: '#64748B', marginTop: 5 },
  
  emojiSelectorContainer: { marginBottom: 30 },
  emojiScroll: { gap: 12, paddingHorizontal: 5, paddingVertical: 10 },
  emojiOption: { width: 55, height: 55, borderRadius: 28, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'transparent' },
  emojiOptionSelected: { borderColor: '#10B981', backgroundColor: '#ECFDF5', transform: [{ scale: 1.1 }] },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginBottom: 40 },
  statCard: { flex: 1, backgroundColor: '#FFF', borderRadius: 16, padding: 15, alignItems: 'center', shadowColor: '#64748B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 2 },
  statIcon: { fontSize: 24, marginBottom: 5 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: '#1E293B' },
  statLabel: { fontSize: 12, color: '#64748B', marginTop: 2 },
  sectionTitle: { fontSize: 20, marginBottom: 15, color: '#1E293B' },
  achievementsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 15, justifyContent: 'space-between' },
  badgeCard: { width: '47%', backgroundColor: '#FFF', padding: 20, borderRadius: 16, alignItems: 'center', borderWidth: 2 },
  badgeUnlocked: { borderColor: '#F59E0B', backgroundColor: '#FFFBEB' },
  badgeLocked: { borderColor: '#E2E8F0', opacity: 0.5 },
  badgeIcon: { fontSize: 32, marginBottom: 10 },
  badgeTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  badgeDesc: { fontSize: 12, color: '#64748B', marginTop: 4 },
  logoutBtn: { marginTop: 40, padding: 16, alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16, borderWidth: 2, borderColor: '#F43F5E' }
});