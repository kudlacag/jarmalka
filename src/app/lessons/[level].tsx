import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect, useLocalSearchParams, type Href } from 'expo-router';
import { useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { supabase } from '@/lib/supabase';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { MaxContentWidth } from '../../constants/theme';
import { a1Lessons } from '../../data/lessons';


export function safeGoBack(fallbackPath: Href = '/') {
  if (router.canGoBack()) {
    router.back();
  } else {
    // If there is no history, replace the current screen with the fallback
    router.replace(fallbackPath); 
  }
}

export default function LevelScreen() {
  const { level } = useLocalSearchParams<{ level: string }>();
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  
  // Fake stats for the UI (we will connect these to real data later)
  const [streak, setStreak] = useState(1);
  const [gems, setGems] = useState(120);

  useFocusEffect(
    useCallback(() => {
      async function loadProgress() {
        // 1. Get local progress first (instant load for offline users)
        const saved = await AsyncStorage.getItem('@jarmalka_progress');
        let localProgress = saved ? JSON.parse(saved) : [];
        
        // 2. Get cloud progress if the user is logged in
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data, error } = await supabase
            .from('user_progress')
            .select('lesson_id')
            .eq('user_id', session.user.id);

          if (data && !error) {
            // Combine local and cloud progress so nothing is lost
            const cloudProgress = data.map(item => item.lesson_id);
            localProgress = Array.from(new Set([...localProgress, ...cloudProgress]));
            
            // Update local storage with the cloud data so it's fast next time
            await AsyncStorage.setItem('@jarmalka_progress', JSON.stringify(localProgress));
          }
        }
        
        setCompletedLessons(localProgress);
      }
      
      loadProgress();
    }, [])
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        
        {/* --- FIXED TOP HEADER --- */}
        <View style={styles.topBar}>
          <Pressable   onPress={() => safeGoBack('/learn')} style={styles.backBtn}>
            <ThemedText type="title" style={{ fontSize: 24 }}>←</ThemedText>
          </Pressable>
          <ThemedText type="title" style={styles.headerTitle}>Casharrada {level?.toUpperCase()}</ThemedText>
          <View style={styles.statsContainer}>
            <ThemedText style={styles.statText}>🔥 {streak}</ThemedText>
            <ThemedText style={styles.statText}>💎 {gems}</ThemedText>
          </View>
        </View>

        {/* --- SCROLLING PATH --- */}
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.pathContainer}>
            {a1Lessons.map((lesson, index) => {
              const isCompleted = completedLessons.includes(lesson.id);
              
              // Progression Logic
              const previousLessonId = index > 0 ? a1Lessons[index - 1].id : null;
              const isUnlocked = index === 0 || (previousLessonId && completedLessons.includes(previousLessonId));
              
              // Winding Path Logic (Left, Right, Center)
              const isEven = index % 2 === 0;
              const alignmentStyle: ViewStyle = isEven
                ? { alignSelf: 'flex-start', marginLeft: 20 }
                : { alignSelf: 'flex-end', marginRight: 20 };

              // Determine Node Color/Icon based on state
              let nodeColor = '#E5E5E5'; // Locked (Gray)
              let icon = '🔒';
              let shadowColor = '#C0C0C0';

              if (isCompleted) {
                // SMART COLOR: (We'll use Gold for now. Later, add Orange if mistakes were made)
                nodeColor = '#FFCE00'; // Gold (Mastered)
                icon = '⭐';
                shadowColor = '#D4A300';
              } else if (isUnlocked) {
                nodeColor = '#58cc02'; // Bright Green (Active)
                icon = '▶';
                shadowColor = '#46A302';
              }

              return (
                <View key={lesson.id} style={styles.nodeWrapper}>
                  {/* Connecting Line */}
                  {index > 0 && (
                    <View style={[
                      styles.pathLine, 
                      isCompleted ? { backgroundColor: '#FFCE00' } : { backgroundColor: '#E5E5E5' }
                    ]} />
                  )}

                  {/* Lesson Node Button */}
                  <Pressable 
                    onPress={() => {
                      if (isUnlocked) {
                        router.push({ pathname: '/lesson/[id]', params: { id: lesson.id } });
                      }
                    }}
                    disabled={!isUnlocked}
                    style={[styles.nodeButton, alignmentStyle, { backgroundColor: nodeColor, shadowColor: shadowColor }]}
                  >
                    <ThemedText style={styles.nodeIcon}>{icon}</ThemedText>
                  </Pressable>

                  {/* Lesson Title & Info */}
                  <View style={[styles.titleContainer, alignmentStyle]}>
                    <ThemedText type="title" style={[styles.lessonTitle, !isUnlocked && { color: '#A0A0A0' }]}>
                      {lesson.title}
                    </ThemedText>
                    <ThemedText type="small" style={styles.lessonSubtitle}>
                      Unit {lesson.unit} · {lesson.titleDe}
                    </ThemedText>
                  </View>
                </View>
              );
            })}
          </View>
          
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F8F9FB' // Soft, warm off-white background
  },
  safeArea: { 
    flex: 1, 
    maxWidth: MaxContentWidth, 
    width: '100%', 
    alignSelf: 'center' 
  },

  // --- Top Bar Styles ---
  topBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  statsContainer: { flexDirection: 'row', gap: 15 },
  statText: { fontSize: 16, fontWeight: 'bold', color: '#333' },

  // --- Path Styles ---
  scrollContent: { paddingBottom: 50 },
  pathContainer: { paddingTop: 30, paddingHorizontal: 20, position: 'relative' },
  
  nodeWrapper: { 
    position: 'relative', 
    marginBottom: 40,
    width: '100%',
  },
  
  // The vertical connecting line
  pathLine: { 
    position: 'absolute', 
    top: -40, 
    left: '50%', 
    width: 12, 
    height: 40, 
    marginLeft: -6, // Center it
    zIndex: -1 
  },

  nodeButton: { 
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    alignItems: 'center', 
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 0,
    elevation: 8,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  nodeIcon: { 
    fontSize: 32, 
    color: '#FFF' 
  },

  titleContainer: {
    marginTop: 10,
    maxWidth: 160,
  },
  lessonTitle: { 
    fontSize: 16, 
    lineHeight: 20,
  },
  lessonSubtitle: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  }
});