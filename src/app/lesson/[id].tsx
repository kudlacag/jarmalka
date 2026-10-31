import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams, type Href } from 'expo-router';
import * as Speech from 'expo-speech';
import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AnimatedButton } from 'react-native-3d-animated-buttons';
import ConfettiCannon from 'react-native-confetti-cannon';
import { SafeAreaView } from 'react-native-safe-area-context';

import { supabase } from '@/lib/supabase';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { MaxContentWidth, Spacing } from '../../constants/theme';
import { a1Lessons } from '../../data/lessons';
export function safeGoBack(fallbackPath: Href = '/') {
  if (router.canGoBack()) {
    router.back();
  } else {
    // If there is no history, replace the current screen with the fallback
    router.replace(fallbackPath);
  }
}

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = a1Lessons.find((l) => l.id === id);
  
  // --- States ---  
  const [showVocab, setShowVocab] = useState(true);
  const [activeQueue, setActiveQueue] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);
  
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [germanVoiceId, setGermanVoiceId] = useState<string | undefined>(undefined);
  
  // Sentence Build State
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  // Spelling State
  const [spellingLetters, setSpellingLetters] = useState<string[]>([]);
  const [usedBankIndices, setUsedBankIndices] = useState<number[]>([]);

  const startTimeRef = useRef<number>(Date.now());  
  const bounceAnim = useRef(new Animated.Value(0)).current;

  const correctPlayer = useAudioPlayer(require('../../../assets/sounds/correct.mp3'));
  const wrongPlayer = useAudioPlayer(require('../../../assets/sounds/wrong.mp3'));

  const exercise = activeQueue[index];
  const isAnswered = selected !== null;
  const total = activeQueue.length;   
  const isLast = index + 1 >= total;

  const [selectedLetters, setSelectedLetters] = useState<string[]>([]); 

    // --- New Animations ---
  const owlAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(1)).current;
  const card1Anim = useRef(new Animated.Value(0)).current;
  const card2Anim = useRef(new Animated.Value(0)).current;
  const card3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    async function loadGermanVoice() {
      const voices = await Speech.getAvailableVoicesAsync();
      const deVoice = voices.find(v => v.language.startsWith('de'));
      if (deVoice) setGermanVoiceId(deVoice.identifier);
    }
    loadGermanVoice();
  }, []);

  // --- Success Screen Animation Sequence ---
  useEffect(() => {
    if (finished) {
      // 1. Owl pops in after a 500ms delay
      Animated.sequence([
        Animated.delay(500),
        Animated.spring(owlAnim, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        })
      ]).start();

      // 2. Green text bounces continuously
      Animated.loop(
        Animated.sequence([
          Animated.timing(textAnim, { toValue: 1.1, duration: 600, useNativeDriver: true }),
          Animated.timing(textAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      ).start();

      // 3. Cards slide in one by one (1 second apart)
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

  useEffect(() => {
    if (exercise && !showVocab) {
      if (exercise.type === 'multiple_choice') {
        Speech.stop();
        Speech.speak(exercise.prompt, { language: 'de-DE', voice: germanVoiceId, rate: 0.9 });
      }
      
      const options = [...exercise.options];
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }
      setShuffledOptions(options);
    }
  }, [index, exercise, germanVoiceId, showVocab]);

  // --- Handlers ---
  function chooseMC(option: string) {
    if (isAnswered) return;
    setSelected(option);
    const isRight = option === exercise?.correctAnswer;
    if (isRight) { 
      setScore(s => s + 1); 
      playSound(true); 
      speakAnswer(exercise.correctAnswer); // <-- ADD THIS
    } else { 
      playSound(false); 
    }
    Haptics.notificationAsync(isRight ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error);
  }

  function handleWordTap(word: string) {
    if (isAnswered) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    // Add the tapped word to the sentence  
    const newSelected = [...selectedWords, word];
    setSelectedWords(newSelected);

    // If the user has used all the words, check the answer
    if (exercise?.type === 'sentence_build' && newSelected.length === exercise.options.length) {
      setTimeout(() => {
        // This joins the words with spaces (e.g., "das Internet")
        const userAnswer = newSelected.join(' ');
        const isRight = userAnswer === exercise.correctAnswer;
        setSelected(userAnswer);
               if (isRight) { 
          setScore(s => s + 1); 
          playSound(true); 
          speakAnswer(exercise.correctAnswer); // <-- ADD THIS
        } else { 
          playSound(false); 
        }
        Haptics.notificationAsync(isRight ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error);
      }, 100);
    }
  }

    function handleLetterTap(letter: string) {
    if (isAnswered) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    const newSelected = [...selectedLetters, letter];
    setSelectedLetters(newSelected);

    // Auto-check when the user has filled all the boxes
    if (exercise?.type === 'spelling' && newSelected.length === exercise.correctAnswer.length) {
      setTimeout(() => {
        const userAnswer = newSelected.join(''); // Joins with NO space (because the space is already in the array)
        const isRight = userAnswer === exercise.correctAnswer;
        setSelected(userAnswer);
        if (isRight) { setScore(s => s + 1); playSound(true); } else { playSound(false); }
        Haptics.notificationAsync(isRight ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error);
      }, 100);
    }
  }


  function removeSpellingLetter(indexToRemove: number) {
    if (isAnswered) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const newLetters = spellingLetters.filter((_, i) => i !== indexToRemove);
    const newUsedIndices = usedBankIndices.filter((_, i) => i !== indexToRemove);
    setSpellingLetters(newLetters);
    setUsedBankIndices(newUsedIndices);
  }

  async function next() {
    const isWrong = selected !== exercise.correctAnswer;
    let updatedQueue = [...activeQueue]; 

    if (isWrong) {
      const retryExercise = { ...exercise, id: `${exercise.id}-retry-${Date.now()}` };
      const remainingQueue = updatedQueue.slice(index + 1);
      const randomIndex = Math.floor(Math.random() * (remainingQueue.length + 1));
      remainingQueue.splice(randomIndex, 0, retryExercise);
      updatedQueue = [...updatedQueue.slice(0, index + 1), ...remainingQueue];
      setActiveQueue(updatedQueue);
    }

    if (index + 1 >= updatedQueue.length) {
      const durationInSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setTimeTaken(durationInSeconds);
      setFinished(true);
      
      try {
        // 1. Save locally (always works, even if offline)
        const saved = await AsyncStorage.getItem('@jarmalka_progress');
        let progress = saved ? JSON.parse(saved) : [];
        if (!progress.includes(lesson?.id)) {
          progress.push(lesson?.id);
          await AsyncStorage.setItem('@jarmalka_progress', JSON.stringify(progress));
        }

        // 2. Save to Supabase (Cloud sync)
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          await supabase.from('user_progress').upsert({
            user_id: session.user.id,
            lesson_id: lesson?.id,
            score: Math.round((score / total) * 100), // Save score as percentage
          }, { onConflict: 'user_id, lesson_id' });
        }
      } catch (e) { 
        console.log("Failed to save", e); 
      }
    } else {
      setIndex(i => i + 1);
      setSelected(null);
      setSelectedWords([]);
      setSpellingLetters([]);
      setUsedBankIndices([]);
      setSelectedLetters([]);  
    }
  }

  function restart() {
    startTimeRef.current = Date.now();
    setActiveQueue(lesson?.exercises || []);
    setIndex(0); setSelected(null); setScore(0); setFinished(false); setSelectedWords([]); setSpellingLetters([]); setUsedBankIndices([]);
    setSelectedLetters([]);
  }

  function startLesson() {
    setActiveQueue(lesson?.exercises || []);
    setShowVocab(false); 
    startTimeRef.current = Date.now();
  }

  if (!lesson) return null;
  const progressPercentage = total > 0 ? (index / total) * 100 : 0;

  if (showVocab) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea} edges={['top']}>
          <ScrollView contentContainerStyle={styles.scroll}>
            <Pressable onPress={() => safeGoBack('/learn')} style={styles.closeBtn}>
              <ThemedText type="title" style={{ fontSize: 20 }}>✕</ThemedText>
            </Pressable>
            <ThemedText type="title" style={{ marginTop: 10 }}>{lesson.title}</ThemedText>
            <ThemedText type="small" style={{ marginBottom: 20, opacity: 0.7 }}>Baro erayada ka hor inta aadan bilaabin casharka</ThemedText>
            
            <View style={{ gap: 10, marginBottom: 30 }}>
              {lesson.vocabulary.map((v, i) => (
                <Pressable key={i} onPress={() => Speech.speak(v.de, { language: 'de-DE', voice: germanVoiceId })}>
                  <View style={styles.vocabRow}>
                    <ThemedText style={{ fontSize: 18, fontWeight: 'bold', flex: 1 }}>{v.de}</ThemedText>
                    <ThemedText style={{ fontSize: 16, opacity: 0.7, flex: 1, textAlign: 'right' }}>{v.so}</ThemedText>
                    <ThemedText style={{ fontSize: 18, marginLeft: 10 }}>🔊</ThemedText>
                  </View>
                </Pressable>
              ))}
            </View>

            <AnimatedButton title="Bilow Casharka" onPress={startLesson} backgroundColor="#58cc02" shadowColor="#58a700" fullWidth />
          </ScrollView>
        </SafeAreaView>
      </ThemedView>
    );
  }

  // --- Render Finished Screen ---
  if (finished) {
    const percentage = Math.round((score / total) * 100);
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;
    const formattedTime = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

    // Interpolations for the animations
    const owlScale = owlAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
    const owlTranslateY = owlAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] });
    const card1Y = card1Anim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] });
    const card2Y = card2Anim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] });
    const card3Y = card3Anim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] });

    return (
      <ThemedView style={styles.container}>
        {/* Confetti is now less aggressive so you can read the cards */}
        <ConfettiCannon count={100} origin={{x: -10, y: 0}} fadeOut={true} />
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollCenter} showsVerticalScrollIndicator={false}>
            
            {/* Delayed Owl */}
            <Animated.View style={{ transform: [{ scale: owlScale }, { translateY: owlTranslateY }] }}>
              <ThemedText style={{ fontSize: 100, textAlign: 'center' }}>🦉</ThemedText>
            </Animated.View>
            
            <ThemedText type="title" style={{ marginTop: 10, textAlign: 'center', fontSize: 32 }}>
              Waad dhammaysay! 🎉
            </ThemedText>

            {/* Bouncing Green Text */}
            <Animated.View style={{ transform: [{ scale: textAnim }] }}>
              <ThemedText style={{ fontSize: 18, color: '#58cc02', fontWeight: 'bold', marginTop: 10, marginBottom: 20 }}>
                Aad baad u fiican tahay!
              </ThemedText>
            </Animated.View>

            {/* Staggered Stats Cards */}
            <View style={styles.statsRow}>
              
              {/* Score Card */}
              <Animated.View style={[styles.statCard, { borderBottomColor: '#FFCE00', transform: [{ translateY: card1Y }] }]}>
                <ThemedText style={styles.statIcon}>🎯</ThemedText>
                <ThemedText style={styles.statValue}>{percentage}%</ThemedText>
                <ThemedText style={styles.statLabel}>Natiijo ({score}/{total})</ThemedText>
              </Animated.View>

              {/* Time Card */} 
              <Animated.View style={[styles.statCard, { borderBottomColor: '#1cb0f6', transform: [{ translateY: card2Y }] }]}>
                <ThemedText style={styles.statIcon}>⏱️</ThemedText>
                <ThemedText style={styles.statValue}>{formattedTime}</ThemedText>
                <ThemedText style={styles.statLabel}>Waqti</ThemedText>
              </Animated.View>

              {/* XP Card */}
              <Animated.View style={[styles.statCard, { borderBottomColor: '#ce82ff', transform: [{ translateY: card3Y }] }]}>
                <ThemedText style={styles.statIcon}>⚡</ThemedText>
                <ThemedText style={styles.statValue}>+10</ThemedText>
                <ThemedText style={styles.statLabel}>XP</ThemedText>
              </Animated.View>

            </View>

            <AnimatedButton 
              title="Mar kale bilow" 
              onPress={restart} 
              backgroundColor="#58cc02" 
              shadowColor="#58a700" 
              fullWidth 
              style={{ marginTop: 40 }}
            />
            
          <Pressable onPress={() => {
  if (router.canGoBack()) {
    router.back();
  } else {
    router.replace('/learn'); // Or '/' for the home tab
  }
}}>
  <ThemedText>← Dib u noqo</ThemedText>
</Pressable>

{/* // For the top arrow: */}
<Pressable onPress={() => {
  if (router.canGoBack()) router.back();
  else router.replace('/learn');
}}>
  <ThemedText style={{ fontSize: 24 }}>←</ThemedText>
</Pressable>

            
          </ScrollView>
        </SafeAreaView>
      </ThemedView>
    );
  }

  if (!exercise) return null;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll}>
          
          <View style={styles.topBar}>
            <Pressable onPress={() => safeGoBack('/learn')} style={styles.closeBtn}>
              <ThemedText type="title" style={{ fontSize: 20 }}>✕</ThemedText>
            </Pressable>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
            </View>
            <ThemedText type="small" style={styles.counter}>{index + 1}/{total}</ThemedText>
          </View>

            <ThemedText type="small" style={styles.instruction}>
            {exercise.type === 'multiple_choice' ? 'Dooro tarjumaada saxda ah:' : 'Iska soo ururi jumlada saxda ah (Taabo erayada):'}
          </ThemedText>
          
          <View style={styles.promptContainer}>
            <ThemedText type="title" style={styles.prompt}>{exercise.prompt}</ThemedText>
            {exercise.type === 'multiple_choice' && (
              <Pressable onPress={() => Speech.speak(exercise.prompt, { language: 'de-DE', voice: germanVoiceId, rate: 0.9 })} style={styles.audioBtn}>
                <ThemedText style={{ fontSize: 24 }}>🔊</ThemedText>
              </Pressable>
            )}
          </View>

          {/* MULTIPLE CHOICE UI */}
          {exercise.type === 'multiple_choice' && (
            <View style={styles.optionsContainer}>
                            {shuffledOptions.map((option, i) => {
                const isThis = selected === option;
                const isRight = option === exercise.correctAnswer;
                let bgColor = '#FFFFFF', shadowColor = '#E5E5E5', textColor = '#333333';
                if (isAnswered) {
                  if (isRight) { bgColor = '#d7ffb8'; shadowColor = '#a5d68c'; textColor = '#58a700'; }
                  else if (isThis) { bgColor = '#ffdfe0'; shadowColor = '#ea2b2b'; textColor = '#ea2b2b'; }
                }
                 return (
                  <View key={`${option}-${i}`} style={{ marginBottom: 12 }}>
                     <AnimatedButton title={option} onPress={() => chooseMC(option)} disabled={isAnswered} backgroundColor={bgColor} shadowColor={shadowColor} textColor={textColor} fullWidth hapticStyle="Light" />
                  </View>
                );
              })}
            </View>  
          )}

                  {/* SENTENCE BUILD UI */}
              {/* SENTENCE BUILD UI */}
          {exercise.type === 'sentence_build' && (
            <View style={styles.sentenceContainer}>
              
              {/* Output Line (Where words go) */}
              <View style={styles.sentenceLine}>
                {selectedWords.map((word, i) => (
                  <Pressable 
                    key={`${word}-${i}`} 
                    onPress={() => {
                      if (isAnswered) return;
                      const newSelected = [...selectedWords];
                      newSelected.splice(i, 1);
                      setSelectedWords(newSelected);
                    }} 
                    style={styles.wordChipSelected}
                  >
                    <ThemedText style={{ color: '#333', fontSize: 16, fontWeight: 'bold' }}>{word}</ThemedText>
                  </Pressable>
                ))}
              </View>

              {/* Word Bank (Where you tap the words) */}
              <View style={styles.wordBank}>
                {shuffledOptions.map((word, i) => {
                  const isUsed = selectedWords.includes(word);
                  return (
                    <Pressable 
                      key={`${word}-${i}`} 
                      onPress={() => handleWordTap(word)} 
                      disabled={isAnswered || isUsed}
                      style={[styles.wordChip, isUsed && { opacity: 0.2 }]}
                    >
                      <ThemedText style={{ fontSize: 16, fontWeight: 'bold' }}>{word}</ThemedText>
                    </Pressable>
                  );
                })}
              </View>  
            </View>
          )}

          

          {/* SPELLING UI */}  
          {exercise.type === 'spelling' && (
            <View style={styles.sentenceContainer}>
              
              {/* Output Line (The empty boxes) */}
              <View style={styles.spellingLine}>
                {exercise.correctAnswer.split('').map((_: string, index: number) => {
                  const letter = selectedLetters[index];
                  return (
                    <Pressable 
                      key={index} 
                      onPress={() => {
                        if (isAnswered) return;
                        // Allow user to tap a box to remove the letter
                        const newSelected = [...selectedLetters];
                        newSelected.splice(index, 1);
                        setSelectedLetters(newSelected);
                      }}
                      style={[styles.spellingBox, letter && styles.spellingBoxFilled]}
                    >
                      <ThemedText style={{ fontSize: 20, fontWeight: 'bold' }}>
                        {letter === ' ' ? '' : letter}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </View>

              {/* Letter Bank */}
              <View style={styles.wordBank}>
                {shuffledOptions.map((letter, i) => {
                  const isUsed = selectedLetters.filter(l => l === letter).length >= shuffledOptions.filter(l => l === letter).length;
                  return (
                    <Pressable 
                      key={`${letter}-${i}`} 
                      onPress={() => handleLetterTap(letter)} 
                      disabled={isAnswered || isUsed}
                      style={[styles.wordChip, isUsed && { opacity: 0.2 }, letter === ' ' && { backgroundColor: '#E5F0FF' }]}
                    >
                      <ThemedText style={{ fontSize: 20, fontWeight: 'bold' }}>
                        {letter === ' ' ? '🔲' : letter}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </View>

      
            </View>
          )}

            {isAnswered && (
                <View style={{ marginTop: 30, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 10 }}>
                   <ThemedText style={{ color: selected === exercise.correctAnswer ? '#58a700' : '#ea2b2b', fontWeight: 'bold', fontSize: 18 }}>
                     {selected === exercise.correctAnswer ? 'Aad u fiican! (Sax)' : `Qalad. Sax: ${exercise.correctAnswer}`}
                   </ThemedText>
                   {selected === exercise.correctAnswer && (
                     <Pressable onPress={() => speakAnswer(exercise.correctAnswer)}>
                       <ThemedText style={{ fontSize: 22 }}>🔊</ThemedText>
                     </Pressable>
                   )}
                </View>
              )}  
          {/* THE NEXT BUTTON - FIXED LOCATION */}
          {isAnswered && (
            <View style={{ marginTop: 20, marginBottom: 40 }}>
              <AnimatedButton 
                title={isLast && selected === exercise.correctAnswer ? "Dhammaystir" : "Xiga →"} 
                onPress={next} 
                backgroundColor="#58cc02" 
                shadowColor="#58a700" 
                fullWidth 
                hapticStyle="Medium" 
              />
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
  progressBarBg: { flex: 1, height: 14, backgroundColor: '#E5E5E5', borderRadius: 7, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#58cc02', borderRadius: 7 },
  counter: { fontWeight: 'bold', opacity: 0.5 },
  instruction: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, opacity: 0.8 },
  promptContainer: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 30 },
  prompt: { fontSize: 26 },
  audioBtn: { padding: 10, backgroundColor: '#E5F0FF', borderRadius: 12 },
  optionsContainer: { marginTop: 10 },
  scoreText: { fontSize: 22, marginTop: 10, fontWeight: 'bold' },
  back: { marginTop: 20 },
  vocabRow: { flexDirection: 'row', backgroundColor: '#FFF', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#E5E5E5', alignItems: 'center' },
  sentenceContainer: { flex: 1 },
  sentenceLine: { minHeight: 60, flexDirection: 'row', flexWrap: 'wrap', borderBottomWidth: 2, borderBottomColor: '#E5E5E5', paddingBottom: 10, gap: 8, marginBottom: 30 },
  wordBank: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  wordChip: { paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E5E5', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  wordChipSelected: { paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#E5E5E5', borderRadius: 12, borderWidth: 1, borderColor: '#d4d4d4' },
  
  // Spelling Styles
  spellingContainer: { flex: 1, alignItems: 'center' },
  slotsContainer: { flexDirection: 'row', gap: 8, marginBottom: 40, flexWrap: 'wrap', justifyContent: 'center' },
  slot: { width: 45, height: 55, backgroundColor: '#F0F0F0', borderRadius: 8, borderBottomWidth: 3, borderBottomColor: '#CCCCCC', alignItems: 'center', justifyContent: 'center' },
  letterBank: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  letterChip: { width: 50, height: 50, backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E5E5', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },

  spellingLine: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 8, 
    marginBottom: 40, 
    justifyContent: 'center' 
  },
  spellingBox: { 
    width: 40, 
    height: 50, 
    borderBottomWidth: 3, 
    borderBottomColor: '#E5E5E5', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  spellingBoxFilled: { 
    borderBottomColor: '#58cc02', 
    backgroundColor: '#F7FFF2',
    borderRadius: 8
  },

    statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
    borderBottomWidth: 4, // The color strip at the bottom
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
    textAlign: 'center',
  },
});