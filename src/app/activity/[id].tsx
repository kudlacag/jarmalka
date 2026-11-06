import { useAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import * as Speech from 'expo-speech';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { SafeAreaView } from 'react-native-safe-area-context';

import { supabase } from '@/lib/supabase';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { MaxContentWidth } from '../../constants/theme';

// --- SEPARATE AUDIO PLAYER COMPONENT ---
function ListeningPlayer({ url }: { url: string }) {
  const player = useAudioPlayer({ uri: url });
  return (
    <View style={{ backgroundColor: '#F8F9FB', padding: 20, borderRadius: 16, marginTop: 20, marginBottom: 20, alignItems: 'center' }}>
      <ThemedText style={{ fontSize: 40, marginBottom: 10 }}>🎧</ThemedText>
      <ThemedText style={{ fontWeight: 'bold', marginBottom: 15 }}>Dhageyso Casharka (Listen)</ThemedText>
      <View style={{ flexDirection: 'row', gap: 15 }}>
        <Pressable onPress={() => player.play()} style={{ backgroundColor: '#4189DD', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 }}>
          <ThemedText style={{ color: 'white', fontWeight: 'bold' }}>▶ Play</ThemedText>
        </Pressable>
        <Pressable onPress={() => player.pause()} style={{ backgroundColor: '#E5E5E5', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 20 }}>
          <ThemedText style={{ color: '#333', fontWeight: 'bold' }}>⏸ Pause</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

export default function ActivityScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activity, setActivity] = useState<any>(null);
  const [lang, setLang] = useState<'so' | 'de'>('so');
  
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  
  // Gamification States
  const [timeTaken, setTimeTaken] = useState(0);
  const [gemsEarned, setGemsEarned] = useState(0);
  const startTimeRef = useRef<number>(Date.now());

  // Animations
  const card1Anim = useRef(new Animated.Value(0)).current;
  const card2Anim = useRef(new Animated.Value(0)).current;
  const card3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    async function loadActivity() {
      const { data } = await supabase.from('activities').select('*').eq('id', id).single();
      if (data) {
        let safeQuestions = [];
        if (Array.isArray(data.questions)) {
          safeQuestions = data.questions;
        } else if (typeof data.questions === 'string') {
          try { safeQuestions = JSON.parse(data.questions); } catch (e) {}
        }
        setActivity({ ...data, questions: safeQuestions });
        startTimeRef.current = Date.now(); // START TIMER HERE
      }
    }
    loadActivity();
  }, [id]);

  function speakGerman() {
    if (activity) Speech.speak(activity.content_de, { language: 'de-DE', rate: 0.9 });
  }

  function handleAnswer(option: string) {
    if (selectedAnswer || !activity?.questions || activity.questions.length === 0) return;
    setSelectedAnswer(option);
    const isRight = option === activity.questions[currentQIndex]?.answer;
    if (isRight) {
      setScore(score + 1);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }

  async function nextQuestion() {
    if (!activity?.questions) return;
    
    if (currentQIndex + 1 >= activity.questions.length) {
      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setTimeTaken(duration);
      setQuizFinished(true);
      
      // Award +20 Gems and +10 XP for completing an Activity
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: stats } = await supabase.from('user_stats').select('*').eq('user_id', session.user.id).single();
          if (stats) {
            setGemsEarned(20);
            await supabase.from('user_stats').update({
              total_xp: stats.total_xp + 10,
              gems: stats.gems + 20
            }).eq('user_id', session.user.id);
          }
        }
      } catch (e) { console.log(e); }

      // Trigger card animations
      Animated.stagger(200, [
        Animated.spring(card1Anim, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }),
        Animated.spring(card2Anim, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }),
        Animated.spring(card3Anim, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }),
      ]).start();

    } else {
      setCurrentQIndex(currentQIndex + 1);
      setSelectedAnswer(null);
    }
  }

  if (!activity) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4189DD" />
      </ThemedView>
    );
  }

  // --- RENDER QUIZ RESULTS (GAMIFIED) ---
  if (quizFinished) {
    const percentage = Math.round((score / activity.questions.length) * 100);
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;
    const formattedTime = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

    const card1Y = card1Anim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] });
    const card2Y = card2Anim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] });
    const card3Y = card3Anim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] });

    return (
      <ThemedView style={styles.container}>
        <ConfettiCannon count={100} origin={{x: -10, y: 0}} fadeOut={true} />
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollCenter}>
            <ThemedText style={{ fontSize: 80 }}>🎉</ThemedText>
            <ThemedText type="title" style={{ marginTop: 10, textAlign: 'center', fontSize: 32 }}>Waad dhammaysay!</ThemedText>
            <ThemedText style={{ fontSize: 18, color: '#58cc02', fontWeight: 'bold', marginTop: 10, marginBottom: 20 }}>
              Aad baad u fiican tahay!
            </ThemedText>

            <View style={styles.statsRow}>
              <Animated.View style={[styles.statCard, { borderBottomColor: '#FFCE00', transform: [{ translateY: card1Y }] }]}>
                <ThemedText style={styles.statIcon}>🎯</ThemedText>
                <ThemedText style={styles.statValue}>{percentage}%</ThemedText>
                <ThemedText style={styles.statLabel}>Natiijo ({score}/{activity.questions.length})</ThemedText>
              </Animated.View>

              <Animated.View style={[styles.statCard, { borderBottomColor: '#1cb0f6', transform: [{ translateY: card2Y }] }]}>
                <ThemedText style={styles.statIcon}>⏱️</ThemedText>
                <ThemedText style={styles.statValue}>{formattedTime}</ThemedText>
                <ThemedText style={styles.statLabel}>Waqti</ThemedText>
              </Animated.View>

              <Animated.View style={[styles.statCard, { borderBottomColor: '#ce82ff', transform: [{ translateY: card3Y }] }]}>
                <ThemedText style={styles.statIcon}>⚡</ThemedText>
                <ThemedText style={styles.statValue}>+10</ThemedText>
                <ThemedText style={styles.statLabel}>XP</ThemedText>
              </Animated.View>
            </View>

            {gemsEarned > 0 && (
              <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <ThemedText style={{ fontSize: 20 }}>💎</ThemedText>
                <ThemedText style={{ fontSize: 18, fontWeight: 'bold', color: '#1cb0f6' }}>+{gemsEarned} Gems Earned!</ThemedText>
              </View>
            )}

            <Pressable onPress={() => router.back()} style={{ marginTop: 40, backgroundColor: '#58cc02', padding: 15, borderRadius: 12, width: '100%', alignItems: 'center' }}>
              <ThemedText style={{ color: 'white', fontWeight: 'bold', fontSize: 18 }}>Ku noqo (Go back)</ThemedText>
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </ThemedView>
    );
  }

  // --- RENDER READING & QUESTIONS ---
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

          {activity.image_url && (
            <Image source={{ uri: activity.image_url }} style={styles.heroImage} />
          )}

          <View style={styles.content}>
            <ThemedText type="title" style={styles.title}>
              {lang === 'so' ? activity.title_so : activity.title_de}
            </ThemedText>

            {lang === 'de' && (
              <Pressable onPress={speakGerman} style={styles.audioBtn}>
                <ThemedText style={{ fontSize: 20, fontWeight: 'bold', color: '#4189DD' }}>🔊 Dhageyso (Listen)</ThemedText>
              </Pressable>
            )}

            <ThemedText style={styles.body}>
              {lang === 'so' ? activity.content_so : activity.content_de}
            </ThemedText>

            {activity.type === 'listening' && activity.audio_url && (
              <ListeningPlayer url={activity.audio_url} />
            )}

            {activity.questions && activity.questions.length > 0 && (
              <View style={styles.quizSection}>
                <View style={styles.quizHeader}>
                  <ThemedText type="title" style={{ fontSize: 20 }}>Su'aalaha (Questions)</ThemedText>
                  <ThemedText style={{ fontWeight: 'bold', color: '#888' }}>
                    {currentQIndex + 1} / {activity.questions.length}
                  </ThemedText>
                </View>

                <ThemedText style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>
                  {activity.questions[currentQIndex]?.question}
                </ThemedText>

                {activity.questions[currentQIndex]?.options?.map((option: string, i: number) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrect = option === activity.questions[currentQIndex].answer;
                  
                  let bgColor = '#FFF';
                  let borderColor = '#E5E5E5';
                  let textColor = '#333';

                  if (selectedAnswer) {
                    if (isCorrect) { bgColor = '#d7ffb8'; borderColor = '#a5d68c'; textColor = '#58a700'; }
                    else if (isSelected) { bgColor = '#ffdfe0'; borderColor = '#ea2b2b'; textColor = '#ea2b2b'; }
                  }

                  return (
                    <Pressable 
                      key={i} 
                      onPress={() => handleAnswer(option)}
                      disabled={!!selectedAnswer}
                      style={[styles.optionBtn, { backgroundColor: bgColor, borderColor: borderColor }]}
                    >
                      <ThemedText style={{ fontSize: 16, fontWeight: 'bold', color: textColor }}>{option}</ThemedText>
                    </Pressable>
                  );
                })}

                {selectedAnswer && (
                  <Pressable onPress={nextQuestion} style={styles.nextQBtn}>
                    <ThemedText style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
                      {currentQIndex + 1 === activity.questions.length ? "Dhammaystir" : "Su'aasha Xigta →"}
                    </ThemedText>
                  </Pressable>
                )}
              </View>
            )}
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
  scrollCenter: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },
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
  
  quizSection: { marginTop: 40, borderTopWidth: 2, borderTopColor: '#E5E5E5', paddingTop: 30 },
  quizHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  optionBtn: { padding: 15, borderRadius: 12, borderWidth: 2, marginBottom: 10 },
  nextQBtn: { marginTop: 20, backgroundColor: '#58cc02', padding: 15, borderRadius: 12, alignItems: 'center' },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20, marginTop: 20 },
  statCard: { flex: 1, backgroundColor: '#FFF', borderRadius: 16, padding: 15, alignItems: 'center', marginHorizontal: 5, borderBottomWidth: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  statIcon: { fontSize: 24, marginBottom: 5 },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  statLabel: { fontSize: 12, color: '#888', marginTop: 2, textAlign: 'center' },
});