import { useAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams, type Href } from 'expo-router';
import * as Speech from 'expo-speech';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AnimatedButton } from 'react-native-3d-animated-buttons';
import ConfettiCannon from 'react-native-confetti-cannon';
import { SafeAreaView } from 'react-native-safe-area-context';

import { supabase } from '@/lib/supabase';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { MaxContentWidth, Spacing } from '../../constants/theme';
import { generateDynamicExercises } from '../../data/lessons';

export function safeGoBack(fallbackPath: Href = '/') {
  if (router.canGoBack()) router.back();
  else router.replace(fallbackPath);
}

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  // --- States ---  
  const [lesson, setLesson] = useState<any>(null); 
  const [lessonLevel, setLessonLevel] = useState<string>('a1');
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showVocab, setShowVocab] = useState(true);
  const [activeQueue, setActiveQueue] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);
  
  const [hearts, setHearts] = useState(7);
  const [gems, setGems] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [showGemWarning, setShowGemWarning] = useState(false);

  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [germanVoiceId, setGermanVoiceId] = useState<string | undefined>(undefined);
  
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [leftWords, setLeftWords] = useState<string[]>([]);
  const [rightWords, setRightWords] = useState<string[]>([]);
  const [leftSelected, setLeftSelected] = useState<string | null>(null);
  const [rightSelected, setRightSelected] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]); 
  const [matchMapping, setMatchMapping] = useState<Record<string, string>>({});

  const startTimeRef = useRef<number>(Date.now());  
  const bounceAnim = useRef(new Animated.Value(0)).current;

  const correctPlayer = useAudioPlayer(require('../../../assets/sounds/correct.mp3'));
  const wrongPlayer = useAudioPlayer(require('../../../assets/sounds/wrong.mp3'));

  const exercise = activeQueue[index];
  const isAnswered = selected !== null;
  const total = activeQueue.length;   
  const isLast = index + 1 >= total;

  const owlAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(1)).current;
  const card1Anim = useRef(new Animated.Value(0)).current;
  const card2Anim = useRef(new Animated.Value(0)).current;
  const card3Anim = useRef(new Animated.Value(0)).current;

  // --- FETCH FROM SUPABASE ---
  useEffect(() => {
    async function fetchLessonAndStats() {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: stats } = await supabase.from('user_stats').select('hearts, gems').eq('user_id', session.user.id).single();
        if (stats) {
          setHearts(stats.hearts || 7);
          setGems(stats.gems || 0);
        }
      }

      const { data: dbLesson } = await supabase.from('lessons').select('*').eq('id', id).single();
      
      if (dbLesson) {
        setLessonLevel(dbLesson.level || 'a1');

        if (dbLesson.level === 'a2' || dbLesson.level === 'b1') {
          const { data: dbActivities } = await supabase.from('activities').select('*').eq('lesson_id', id);
          if (dbActivities) setActivities(dbActivities);
          setLesson({ title: dbLesson.title_so, titleDe: dbLesson.title_de });
          setLoading(false);
          return; 
        }

        const { data: dbVocab } = await supabase.from('vocabulary').select('*').eq('lesson_id', id);
        const { data: dbExercises } = await supabase.from('exercises').select('*').eq('lesson_id', id);

        const formattedLesson = {
          id: dbLesson.id,
          title: dbLesson.title_so,
          titleDe: dbLesson.title_de,
          unit: dbLesson.unit,
          vocabulary: dbVocab?.map((v: any) => ({ de: v.de, so: v.so })) || [],
          exercises: dbExercises?.map((e: any) => ({
            id: e.id, type: 'sentence_build' as const, prompt: e.prompt, correctAnswer: e.correct_answer, options: e.options
          })) || []
        };
        const finalLesson = generateDynamicExercises(formattedLesson);
        setLesson(finalLesson);
        setActiveQueue(finalLesson.exercises);
      }
      setLoading(false);
    }
    if (id) fetchLessonAndStats();
  }, [id]);

  useEffect(() => {
    async function loadGermanVoice() {
      const voices = await Speech.getAvailableVoicesAsync();
      const deVoice = voices.find(v => v.language.startsWith('de'));
      if (deVoice) setGermanVoiceId(deVoice.identifier);
    }
    loadGermanVoice();
  }, []);

    // --- Setup Question Logic (THIS WAS MISSING) ---
  useEffect(() => {
    if (exercise && !showVocab) {
      if (exercise.type === 'multiple_choice') {
        Speech.stop();
        Speech.speak(exercise.prompt, { language: 'de-DE', voice: germanVoiceId, rate: 0.9 });
      }

      if (exercise.type === 'match_pairs') {
        const pairs = [];
        for (let i = 0; i < exercise.options.length; i += 2) {
          pairs.push({ de: exercise.options[i], so: exercise.options[i + 1] });
        }
        const shuffledPairs = pairs.sort(() => 0.5 - Math.random()).slice(0, 5);
        const deWords = shuffledPairs.map(p => p.de).sort(() => 0.5 - Math.random());
        const soWords = shuffledPairs.map(p => p.so).sort(() => 0.5 - Math.random());
        
        setLeftWords(deWords);
        setRightWords(soWords);
        
        const mapping: Record<string, string> = {};
        shuffledPairs.forEach(p => { mapping[p.de] = p.so; });
        setMatchMapping(mapping);
        
        setLeftSelected(null);
        setRightSelected(null);
        setMatchedPairs([]); 
      }

      // SAFETY CHECK: If options are empty, provide a fallback
      let rawOptions = exercise.options;
      if (!rawOptions || !Array.isArray(rawOptions)) {
        rawOptions = ['Error', 'Loading', 'Please Check'];
      }
      
      const options = [...rawOptions];
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }
      setShuffledOptions(options);
    }
  }, [index, exercise, germanVoiceId, showVocab]);

  useEffect(() => {
    if (finished) {
      Animated.sequence([
        Animated.delay(500),
        Animated.spring(owlAnim, { toValue: 1, friction: 4, tension: 40, useNativeDriver: true })
      ]).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(textAnim, { toValue: 1.1, duration: 600, useNativeDriver: true }),
          Animated.timing(textAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      ).start();

      Animated.stagger(1000, [
        Animated.spring(card1Anim, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }),
        Animated.spring(card2Anim, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }),
        Animated.spring(card3Anim, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }),
      ]).start();
    }
  }, [finished]);

  function playSound(isCorrect: boolean) {
    try {
      const player = isCorrect ? correctPlayer : wrongPlayer;
      player.seekTo(0);
      player.play();
    } catch (e) {}
  }

  function speakAnswer(text: string) {
    Speech.stop();
    Speech.speak(text, { language: 'de-DE', voice: germanVoiceId, rate: 0.9 });
  }

  async function loseHeart() {
    const newHearts = hearts - 1;
    setHearts(newHearts);
    
    if (newHearts <= 0) {
      setGameOver(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await supabase.from('user_stats').update({ hearts: 0, last_heart_lost_time: new Date().toISOString() }).eq('user_id', session.user.id);
      }
    }
  }

  function chooseMC(option: string) {
    if (isAnswered) return;
    setSelected(option);
    const isRight = option === exercise?.correctAnswer;
    if (isRight) { setScore(s => s + 1); playSound(true); speakAnswer(exercise.correctAnswer); } 
    else { playSound(false); loseHeart(); }
    Haptics.notificationAsync(isRight ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error);
  }

  function handleWordTap(word: string) {
    if (isAnswered) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newSelected = [...selectedWords, word];
    setSelectedWords(newSelected);

    if (exercise?.type === 'sentence_build' && newSelected.length === exercise.options.length) {
      setTimeout(() => {
        const userAnswer = newSelected.join(' ');
        const isRight = userAnswer === exercise.correctAnswer;
        setSelected(userAnswer);
        if (isRight) { setScore(s => s + 1); playSound(true); speakAnswer(exercise.correctAnswer); } 
        else { playSound(false); loseHeart(); }
      }, 100);
    }
  }

  function handleLetterTap(letter: string) {
    if (isAnswered) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newSelected = [...selectedLetters, letter];
    setSelectedLetters(newSelected);

    if (exercise?.type === 'spelling' && newSelected.length === exercise.correctAnswer.length) {
      setTimeout(() => {
        const userAnswer = newSelected.join('');
        const isRight = userAnswer === exercise.correctAnswer;
        setSelected(userAnswer);
        if (isRight) { setScore(s => s + 1); playSound(true); } 
        else { playSound(false); loseHeart(); }
      }, 100);
    }
  }

  function handleMatchTap(word: string, side: 'left' | 'right') {
    if (isAnswered || matchedPairs.includes(word)) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (side === 'left') setLeftSelected(word);
    if (side === 'right') setRightSelected(word);

    const currentLeft = side === 'left' ? word : leftSelected;
    const currentRight = side === 'right' ? word : rightSelected;

    if (currentLeft && currentRight) {
      if (matchMapping[currentLeft] === currentRight) {
        playSound(true);
        const newMatched = [...matchedPairs, currentLeft];
        setMatchedPairs(newMatched);
        setLeftSelected(null);
        setRightSelected(null);
        if (newMatched.length === 5) { setSelected('matched'); setScore(s => s + 1); }
      } else {
        playSound(false); loseHeart();
        setTimeout(() => { setLeftSelected(null); setRightSelected(null); }, 600);
      }
    }
  }

  async function next() {
    const isWrong = selected !== exercise.correctAnswer;
    let updatedQueue = [...activeQueue]; 

    if (isWrong && !gameOver) {
      const retryExercise = { ...exercise, id: `${exercise.id}-retry-${Date.now()}` };
      const remainingQueue = updatedQueue.slice(index + 1);
      const randomIndex = Math.floor(Math.random() * (remainingQueue.length + 1));
      remainingQueue.splice(randomIndex, 0, retryExercise);
      updatedQueue = [...updatedQueue.slice(0, index + 1), ...remainingQueue];
      setActiveQueue(updatedQueue);
    }

    if (index + 1 >= updatedQueue.length) {
      const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setTimeTaken(duration);
      setFinished(true);
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await supabase.from('user_progress').upsert({ user_id: session.user.id, lesson_id: lesson?.id, score: Math.round((score / total) * 100) }, { onConflict: 'user_id, lesson_id' });

          const { data: stats } = await supabase.from('user_stats').select('*').eq('user_id', session.user.id).single();
          if (stats) {
            const today = new Date().toISOString().split('T')[0];
            const lastActive = stats.last_active_date;
            let newStreak = stats.streak_count;
            
            if (lastActive !== today) {
              const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
              if (lastActive === yesterday.toISOString().split('T')[0]) newStreak += 1;
              else newStreak = 1;
            }

            await supabase.from('user_stats').update({
              total_xp: stats.total_xp + 10,
              streak_count: newStreak,
              last_active_date: today,
              gems: stats.gems + 20
            }).eq('user_id', session.user.id);
          }
        }
      } catch (e) { console.log(e); }
    } else {
      setIndex(i => i + 1);
      setSelected(null);
      setSelectedWords([]);
      setSelectedLetters([]);
    }
  }

  async function refillHearts() {
    if (gems < 50) {
      setShowGemWarning(true);
      return;
    }
    const newGems = gems - 50;
    setGems(newGems);
    setHearts(7);
    setGameOver(false);
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await supabase.from('user_stats').update({ hearts: 7, gems: newGems }).eq('user_id', session.user.id);
    }
  }

  function restart() {
    startTimeRef.current = Date.now();
    setActiveQueue(lesson?.exercises || []);
    setIndex(0); setSelected(null); setScore(0); setFinished(false); setSelectedWords([]); setSelectedLetters([]);
  }

  function startLesson() {
    setActiveQueue(lesson?.exercises || []);
    setShowVocab(false); 
    startTimeRef.current = Date.now();
  }

  if (loading) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8FAFC' }]}>
        <ActivityIndicator size="large" color="#6366F1" />
      </ThemedView>
    );
  }

  if (!lesson) return null;
  const progressPercentage = total > 0 ? (index / total) * 100 : 0;

  // --- RENDER A2/B1 ACTIVITIES LIST ---
  if (lessonLevel === 'a2' || lessonLevel === 'b1') {
    return (
      <ThemedView style={[styles.container, { backgroundColor: '#F8FAFC' }]}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <ScrollView contentContainerStyle={styles.scroll}>
            <Pressable onPress={() => safeGoBack('/learn')} style={styles.closeBtn}>
              <ThemedText type="title" style={{ fontSize: 20, color: '#1E293B' }}>✕</ThemedText>
            </Pressable>
            
            <ThemedText type="title" style={{ marginTop: 10, color: '#1E293B' }}>{lesson?.title}</ThemedText>
            <ThemedText type="small" style={{ marginBottom: 20, color: '#64748B' }}>
              {lesson?.titleDe} · Dooro casharka (Choose an activity)
            </ThemedText>

            {activities.length === 0 && (
               <ThemedText style={{ textAlign: 'center', marginTop: 40, color: '#94A3B8' }}>Ma jiraan waxqabadyo wali (No activities yet).</ThemedText>
            )}

            {activities.map((act) => (
              <Pressable 
                key={act.id} 
                onPress={() => router.push({ pathname: '/activity/[id]', params: { id: act.id } })}
                style={({ pressed }) => [
                  { marginBottom: 15 },
                  pressed && { transform: [{ scale: 0.97 }] }
                ]}
              >
                <View style={{ backgroundColor: '#FFF', padding: 20, borderRadius: 20, borderLeftWidth: 8, borderLeftColor: act.type === 'reading' ? '#6366F1' : act.type === 'listening' ? '#F59E0B' : '#10B981', shadowColor: '#64748B', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 }}>
                  <ThemedText type="title" style={{ fontSize: 18, color: '#1E293B' }}>{act.title_so}</ThemedText>
                  <ThemedText style={{ fontSize: 14, color: '#64748B', marginTop: 4 }}>{act.title_de}</ThemedText>
                  <ThemedText style={{ fontSize: 16, fontWeight: 'bold', color: '#333', marginTop: 10 }}>
                    {act.type === 'reading' ? '📖 Akhris (Reading)' : act.type === 'listening' ? '🎧 Dhageysi (Listening)' : '📝 Naxwe (Grammar)'}
                  </ThemedText>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </SafeAreaView>
      </ThemedView>
    );
  }

  // --- GAME OVER SCREEN ---
  if (gameOver) {
    return (
      <ThemedView style={[styles.container, { backgroundColor: '#F8FAFC' }]}>
        <SafeAreaView style={styles.safeArea}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
            <ThemedText style={{ fontSize: 80 }}>💔</ThemedText>
            <ThemedText type="title" style={{ marginTop: 20, textAlign: 'center', fontSize: 28, color: '#1E293B' }}>
              Waxaad dhammaysatay Qalbiga!
            </ThemedText>
            <ThemedText style={{ textAlign: 'center', marginTop: 10, color: '#64748B', marginBottom: 30, fontSize: 16 }}>
              Ma haysato qalbiyo ku hadhay. Maxaad jeceshahay inaad samayso?
            </ThemedText>

            <AnimatedButton 
              title={`Ku buuxi 50 💎 Gems (Waxaa haysata ${gems})`} 
              onPress={refillHearts} 
              backgroundColor={gems >= 50 ? "#10B981" : "#94A3B8"} 
              shadowColor={gems >= 50 ? "#059669" : "#64748B"} 
              fullWidth 
            />
            
            <View style={{ marginTop: 15, width: '100%' }}>
              <AnimatedButton title="Ku noqo casharka (Read Vocab)" onPress={() => safeGoBack('/learn')} backgroundColor="#6366F1" shadowColor="#4F46E5" fullWidth />
            </View>
          </View>
        </SafeAreaView>

        {showGemWarning && (
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ThemedText style={{ fontSize: 50, textAlign: 'center', marginBottom: 10 }}>💎</ThemedText>
              <ThemedText type="title" style={{ textAlign: 'center', fontSize: 22, color: '#1E293B' }}>Gems kuma filna!</ThemedText>
              <ThemedText style={{ textAlign: 'center', marginTop: 10, color: '#64748B' }}>
                Waxaad u baahan tahay 50 Gems si aad u buuxiso Qalbiga. Fadlan samee casharro kale si aad u hesho Gems.
              </ThemedText>
              <View style={{ marginTop: 20 }}>
                <AnimatedButton title="Hagaag" onPress={() => setShowGemWarning(false)} backgroundColor="#6366F1" shadowColor="#4F46E5" fullWidth />
              </View>
            </View>
          </View>
        )}
      </ThemedView>
    );
  }

  // --- Render Vocabulary Preview (A1 Only) ---
  if (showVocab && lessonLevel === 'a1') {
    return (
      <ThemedView style={[styles.container, { backgroundColor: '#F8FAFC' }]}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <ScrollView contentContainerStyle={styles.scroll}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Pressable onPress={() => safeGoBack('/learn')} style={styles.closeBtn}>
                <ThemedText type="title" style={{ fontSize: 20, color: '#1E293B' }}>✕</ThemedText>
              </Pressable>
              <View style={styles.statPill}>
                <ThemedText style={styles.statIcon}>❤️</ThemedText>
                <ThemedText style={styles.statText}>{hearts}</ThemedText>
              </View>
            </View>
            <ThemedText type="title" style={{ marginTop: 10, color: '#1E293B' }}>{lesson.title}</ThemedText>
            <ThemedText type="small" style={{ marginBottom: 20, color: '#64748B' }}>Baro erayada ka hor inta aadan bilaabin casharka</ThemedText>
            
            <View style={{ gap: 10, marginBottom: 30 }}>
              {lesson.vocabulary.map((v: any, i: number) => (
                <Pressable key={i} onPress={() => Speech.speak(v.de, { language: 'de-DE', voice: germanVoiceId })}>
                  <View style={styles.vocabRow}>
                    <ThemedText style={{ fontSize: 18, fontWeight: 'bold', flex: 1, color: '#1E293B' }}>{v.de}</ThemedText>
                    <ThemedText style={{ fontSize: 16, color: '#64748B', flex: 1, textAlign: 'right' }}>{v.so}</ThemedText>
                    <ThemedText style={{ fontSize: 18, marginLeft: 10 }}>🔊</ThemedText>
                  </View>
                </Pressable>
              ))}
            </View>

            <AnimatedButton title="Bilow Casharka" onPress={startLesson} backgroundColor="#10B981" shadowColor="#059669" fullWidth />
          </ScrollView>
        </SafeAreaView>
      </ThemedView>
    );
  }

  // --- Render Finished Screen (A1 Only) ---
  if (finished && lessonLevel === 'a1') {
    const percentage = Math.round((score / total) * 100);
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;
    const formattedTime = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

    const owlScale = owlAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
    const owlTranslateY = owlAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] });
    const card1Y = card1Anim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] });
    const card2Y = card2Anim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] });
    const card3Y = card3Anim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] });

    return (
      <ThemedView style={[styles.container, { backgroundColor: '#F8FAFC' }]}>
        <ConfettiCannon count={100} origin={{x: -10, y: 0}} fadeOut={true} />
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollCenter} showsVerticalScrollIndicator={false}>
            
            <Animated.View style={{ transform: [{ scale: owlScale }, { translateY: owlTranslateY }] }}>
              <ThemedText style={{ fontSize: 100, textAlign: 'center' }}>🦉</ThemedText>
            </Animated.View>
            
            <ThemedText type="title" style={{ marginTop: 10, textAlign: 'center', fontSize: 32, color: '#1E293B' }}>
              Waad dhammaysay! 🎉
            </ThemedText>

            <Animated.View style={{ transform: [{ scale: textAnim }] }}>
              <ThemedText style={{ fontSize: 18, color: '#10B981', fontWeight: 'bold', marginTop: 10, marginBottom: 20 }}>
                Aad baad u fiican tahay!
              </ThemedText>
            </Animated.View>

            <View style={styles.statsRow}>
              <Animated.View style={[styles.statCard, { borderBottomColor: '#F59E0B', transform: [{ translateY: card1Y }] }]}>
                <ThemedText style={styles.statIcon}>🎯</ThemedText>
                <ThemedText style={styles.statValue}>{percentage}%</ThemedText>
                <ThemedText style={styles.statLabel}>Natiijo ({score}/{total})</ThemedText>
              </Animated.View>

              <Animated.View style={[styles.statCard, { borderBottomColor: '#6366F1', transform: [{ translateY: card2Y }] }]}>
                <ThemedText style={styles.statIcon}>⏱️</ThemedText>
                <ThemedText style={styles.statValue}>{formattedTime}</ThemedText>
                <ThemedText style={styles.statLabel}>Waqti</ThemedText>
              </Animated.View>

              <Animated.View style={[styles.statCard, { borderBottomColor: '#F43F5E', transform: [{ translateY: card3Y }] }]}>
                <ThemedText style={styles.statIcon}>⚡</ThemedText>
                <ThemedText style={styles.statValue}>+10</ThemedText>
                <ThemedText style={styles.statLabel}>XP</ThemedText>
              </Animated.View>
            </View>

            <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
               <ThemedText style={{ fontSize: 20 }}>💎</ThemedText>
               <ThemedText style={{ fontSize: 18, fontWeight: 'bold', color: '#6366F1' }}>+20 Gems Earned!</ThemedText>
            </View>

            <AnimatedButton title="Mar kale bilow" onPress={restart} backgroundColor="#10B981" shadowColor="#059669" fullWidth style={{ marginTop: 40 }} />
            
            <Pressable onPress={() => safeGoBack('/learn')} style={styles.back}>
              <ThemedText type="small" style={{ textAlign: 'center', marginTop: 20, color: '#64748B' }}>← Dib u noqo</ThemedText>
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </ThemedView>
    );
  }

  if (!exercise || lessonLevel !== 'a1') return null;

  // --- Render A1 Game Screen ---
  return (
    <ThemedView style={[styles.container, { backgroundColor: '#F8FAFC' }]}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll}>
          
          <View style={styles.topBar}>
            <Pressable onPress={() => safeGoBack('/learn')} style={styles.closeBtn}>
              <ThemedText type="title" style={{ fontSize: 20, color: '#1E293B' }}>✕</ThemedText>
            </Pressable>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <ThemedText style={{ fontSize: 18 }}>❤️</ThemedText>
              <ThemedText style={styles.counter}>{hearts}</ThemedText>
            </View>
          </View>

          <ThemedText type="small" style={styles.instruction}>
            {exercise.type === 'multiple_choice' ? 'Dooro tarjumaada saxda ah:' : 
             exercise.type === 'sentence_build' ? 'Iska soo ururi jumlada saxda ah (Taabo erayada):' :
             exercise.type === 'match_pairs' ? 'Ku xir ereyada isku midka ah (Match the pairs):' : 
             'Qor erayga Jarmalka (Halkan ka dooro xarfaha):'}
          </ThemedText>
          
          <View style={styles.promptContainer}>
            <ThemedText type="title" style={styles.prompt}>{exercise.prompt}</ThemedText>
            {exercise.type === 'multiple_choice' && (
              <Pressable onPress={() => Speech.speak(exercise.prompt, { language: 'de-DE', voice: germanVoiceId, rate: 0.9 })} style={styles.audioBtn}>
                <ThemedText style={{ fontSize: 24 }}>🔊</ThemedText>
              </Pressable>
            )}
          </View>

          {exercise.type === 'multiple_choice' && (
            <View style={styles.optionsContainer}>
              {shuffledOptions.map((option, i) => {
                const isThis = selected === option;
                const isRight = option === exercise.correctAnswer;
                let bgColor = '#FFFFFF', shadowColor = '#E2E8F0', textColor = '#1E293B';
                if (isAnswered) {
                  if (isRight) { bgColor = '#ECFDF5'; shadowColor = '#10B981'; textColor = '#059669'; }
                  else if (isThis) { bgColor = '#FFF1F2'; shadowColor = '#F43F5E'; textColor = '#E11D48'; }
                }
                return (
                  <View key={`${option}-${i}`} style={{ marginBottom: 12 }}>
                     <AnimatedButton title={option} onPress={() => chooseMC(option)} disabled={isAnswered} backgroundColor={bgColor} shadowColor={shadowColor} textColor={textColor} fullWidth hapticStyle="Light" />
                  </View>
                );
              })}
            </View>  
          )}

          {exercise.type === 'sentence_build' && (
            <View style={styles.sentenceContainer}>
              <View style={styles.sentenceLine}>
                {selectedWords.map((word, i) => (
                  <Pressable key={`${word}-${i}`} onPress={() => {
                      if (isAnswered) return;
                      const newSelected = [...selectedWords];
                      newSelected.splice(i, 1);
                      setSelectedWords(newSelected);
                    }} style={styles.wordChipSelected}>
                    <ThemedText style={{ color: '#1E293B', fontSize: 16, fontWeight: 'bold' }}>{word}</ThemedText>
                  </Pressable>
                ))}
              </View>
              <View style={styles.wordBank}>
                {shuffledOptions.map((word, i) => {
                  const isUsed = selectedWords.includes(word);
                  return (
                    <Pressable key={`${word}-${i}`} onPress={() => handleWordTap(word)} disabled={isAnswered || isUsed} style={({ pressed }) => [
                      styles.wordChip, 
                      isUsed && { opacity: 0.2 },
                      pressed && { transform: [{ scale: 0.95 }] }
                    ]}>
                      <ThemedText style={{ fontSize: 16, fontWeight: 'bold', color: '#1E293B' }}>{word}</ThemedText>
                    </Pressable>
                  );
                })}
              </View>  
            </View>
          )}

          {exercise.type === 'spelling' && (
            <View style={styles.sentenceContainer}>
              <View style={styles.spellingLine}>
                {exercise.correctAnswer.split('').map((_: string, index: number) => {
                  const letter = selectedLetters[index];
                  return (
                    <Pressable key={index} onPress={() => {
                        if (isAnswered) return;
                        const newSelected = [...selectedLetters];
                        newSelected.splice(index, 1);
                        setSelectedLetters(newSelected);
                      }} style={[styles.spellingBox, letter && styles.spellingBoxFilled]}>
                      <ThemedText style={{ fontSize: 20, fontWeight: 'bold', color: '#1E293B' }}>{letter === ' ' ? '' : letter}</ThemedText>
                    </Pressable>
                  );
                })}
              </View>
              <View style={styles.wordBank}>
                {shuffledOptions.map((letter, i) => {
                  const isUsed = selectedLetters.filter(l => l === letter).length >= shuffledOptions.filter(l => l === letter).length;
                  return (
                    <Pressable key={`${letter}-${i}`} onPress={() => handleLetterTap(letter)} disabled={isAnswered || isUsed} style={({ pressed }) => [
                      styles.wordChip, 
                      isUsed && { opacity: 0.2 }, 
                      letter === ' ' && { backgroundColor: '#EEF2FF', borderColor: '#6366F1' },
                      pressed && { transform: [{ scale: 0.95 }] }
                    ]}>
                      <ThemedText style={{ fontSize: 20, fontWeight: 'bold', color: '#1E293B' }}>{letter === ' ' ? '🔲' : letter}</ThemedText>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {exercise.type === 'match_pairs' && (
            <View style={styles.matchContainer}>
              <View style={styles.matchColumn}>
                {leftWords.map((word, index) => {
                  const isMatched = matchedPairs.includes(word);
                  const isSelected = leftSelected === word;
                  return (
                    <Pressable key={`left-${word}-${index}`} onPress={() => handleMatchTap(word, 'left')} disabled={isMatched || isAnswered} style={({ pressed }) => [
                      styles.matchCard, 
                      isSelected && styles.matchCardSelected, 
                      isMatched && styles.matchCardMatched,
                      pressed && { transform: [{ scale: 0.95 }] }
                    ]}>
                      <ThemedText style={[styles.matchText, isMatched && { opacity: 0.3 }]}>{word}</ThemedText>
                    </Pressable>
                  );
                })}
              </View>
              <View style={styles.matchColumn}>
                {rightWords.map((word, index) => {
                  const matchedWord = matchMapping[word] || Object.keys(matchMapping).find(k => matchMapping[k] === word);
                  const isMatched = matchedWord !== undefined && matchedPairs.includes(matchedWord);
                  const isSelected = rightSelected === word;
                  return (
                    <Pressable key={`right-${word}-${index}`} onPress={() => handleMatchTap(word, 'right')} disabled={isMatched || isAnswered} style={({ pressed }) => [
                      styles.matchCard, 
                      isSelected && styles.matchCardSelected, 
                      isMatched && styles.matchCardMatched,
                      pressed && { transform: [{ scale: 0.95 }] }
                    ]}>
                      <ThemedText style={[styles.matchText, isMatched && { opacity: 0.3 }]}>{word}</ThemedText>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {isAnswered && (
            <View style={{ marginTop: 30, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
               <ThemedText style={{ color: selected === exercise.correctAnswer || selected === 'matched' ? '#10B981' : '#F43F5E', fontWeight: 'bold', fontSize: 18 }}>
                 {selected === exercise.correctAnswer || selected === 'matched' ? 'Aad u fiican! (Sax)' : `Qalad. Sax: ${exercise.correctAnswer}`}
               </ThemedText>
               {(selected === exercise.correctAnswer || selected === 'matched') && exercise.type !== 'match_pairs' && (
                 <Pressable onPress={() => speakAnswer(exercise.correctAnswer)}>
                   <ThemedText style={{ fontSize: 22 }}>🔊</ThemedText>
                 </Pressable>
               )}
            </View>
          )}  
          
          {isAnswered && (
            <View style={{ marginTop: 20, marginBottom: 40 }}>
              <AnimatedButton title={isLast && (selected === exercise.correctAnswer || selected === 'matched') ? "Dhammaystir" : "Xiga →"} onPress={next} backgroundColor="#6366F1" shadowColor="#4F46E5" fullWidth hapticStyle="Medium" />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );  
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: Spacing.four, maxWidth: MaxContentWidth, width: '100%', alignSelf: 'center' },
  scroll: { paddingVertical: Spacing.four, flexGrow: 1 },
  scrollCenter: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
  topBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 15 },
  closeBtn: { padding: 5 },
  progressBarBg: { flex: 1, height: 14, backgroundColor: '#E2E8F0', borderRadius: 7, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#6366F1', borderRadius: 7 },
  counter: { fontWeight: 'bold', opacity: 0.5, color: '#1E293B' },
  instruction: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, color: '#475569' },
  promptContainer: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 30 },
  prompt: { fontSize: 26, color: '#1E293B' },
  audioBtn: { padding: 10, backgroundColor: '#EEF2FF', borderRadius: 12 },
  optionsContainer: { marginTop: 10 },
  back: { marginTop: 20 },
  vocabRow: { flexDirection: 'row', backgroundColor: '#FFF', padding: 15, borderRadius: 16, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  sentenceContainer: { flex: 1 },
  sentenceLine: { minHeight: 60, flexDirection: 'row', flexWrap: 'wrap', borderBottomWidth: 2, borderBottomColor: '#E2E8F0', paddingBottom: 10, gap: 8, marginBottom: 30 },
  wordBank: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  wordChip: { paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 2, borderColor: '#E2E8F0', shadowColor: '#64748B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  wordChipSelected: { paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#EEF2FF', borderRadius: 12, borderWidth: 2, borderColor: '#6366F1' },
  
  spellingLine: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 40, justifyContent: 'center' },
  spellingBox: { width: 40, height: 50, borderBottomWidth: 3, borderBottomColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center' },
  spellingBoxFilled: { borderBottomColor: '#6366F1', backgroundColor: '#EEF2FF', borderRadius: 8 },

  statsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 20, marginTop: 20 },
  statCard: { flex: 1, backgroundColor: '#FFF', borderRadius: 16, padding: 15, alignItems: 'center', marginHorizontal: 5, borderBottomWidth: 4, shadowColor: '#64748B', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  statIcon: { fontSize: 24, marginBottom: 5 },
  statValue: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  statLabel: { fontSize: 12, color: '#64748B', marginTop: 2, textAlign: 'center' },

  matchContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 10 },
  matchColumn: { flex: 1, gap: 10 },
  matchCard: { backgroundColor: '#FFF', padding: 15, borderRadius: 16, borderWidth: 2, borderColor: '#E2E8F0', borderBottomWidth: 4, alignItems: 'center', justifyContent: 'center', minHeight: 60 },
  matchCardSelected: { borderColor: '#6366F1', backgroundColor: '#EEF2FF' },
  matchCardMatched: { borderColor: '#10B981', backgroundColor: '#ECFDF5', borderBottomWidth: 2, marginTop: 2 },
  matchText: { fontSize: 16, fontWeight: 'bold', textAlign: 'center', color: '#1E293B' },
  
  statPill: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#FFF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0' },
  statText: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  modalOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15,23,42,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20, zIndex: 999 },
  modalContent: { backgroundColor: '#FFF', padding: 30, borderRadius: 24, width: '100%', maxWidth: 350, shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 },
});