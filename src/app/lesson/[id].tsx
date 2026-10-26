import { useAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AnimatedButton } from 'react-native-3d-animated-buttons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { MaxContentWidth, Spacing } from '../../constants/theme';
import { a1Lessons } from '../../data/lessons';

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = a1Lessons.find((l) => l.id === id);
  
  // --- States ---
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [germanVoiceId, setGermanVoiceId] = useState<string | undefined>(undefined);
  
  // Sentence Build specific state
  const [selectedWords, setSelectedWords] = useState<string[]>([]);

  // --- Audio Players (NEW: expo-audio) ---
  const correctPlayer = useAudioPlayer(require('../../../assets/sounds/correct.mp3'));
  const wrongPlayer = useAudioPlayer(require('../../../assets/sounds/wrong.mp3'));

  const exercise = lesson?.exercises[index];
  const isAnswered = selected !== null || (exercise?.type === 'sentence_build' && selectedWords.length > 0 && isAnsweredState());
  const total = lesson?.exercises.length || 0;
  const isLast = index + 1 >= total;

  // --- Load Voice ---
  useEffect(() => {
    async function loadGermanVoice() {
      const voices = await Speech.getAvailableVoicesAsync();
      const deVoice = voices.find(v => v.language.startsWith('de'));
      if (deVoice) setGermanVoiceId(deVoice.identifier);
    }
    loadGermanVoice();
  }, []);

  // --- Sound Effect Player (NEW: expo-audio) ---
  function playSound(isCorrect: boolean) {
    try {
      const player = isCorrect ? correctPlayer : wrongPlayer;
      player.seekTo(0); // Reset to start
      player.play();
    } catch (e) {
      console.log("Sound error", e);
    }
  }

  // --- Setup Question ---
  useEffect(() => {
    if (exercise) {
      if (exercise.type === 'multiple_choice') {
        Speech.stop();
        Speech.speak(exercise.prompt, { language: 'de-DE', voice: germanVoiceId, rate: 0.9 });
      }
      
      // Shuffle options
      const options = [...exercise.options];
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }
      setShuffledOptions(options);
    }
  }, [index, exercise, germanVoiceId]);

  // --- Handlers ---
  function chooseMC(option: string) {
    if (isAnswered) return;
    setSelected(option);
    const isRight = option === exercise?.correctAnswer;
    if (isRight) { setScore(s => s + 1); playSound(true); } else { playSound(false); }
    Haptics.notificationAsync(isRight ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error);
  }

  function handleWordTap(word: string) {
    if (isAnswered) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (selectedWords.includes(word)) {
      setSelectedWords(prev => prev.filter(w => w !== word));
    } else {
      setSelectedWords(prev => [...prev, word]);
    }
  }

  function checkSentence() {
    if (selectedWords.length === 0) return;
    const userAnswer = selectedWords.join(' ');
    const isRight = userAnswer === exercise?.correctAnswer;
    
    setSelected(userAnswer); // Use the selected state to mark it as answered
    if (isRight) { setScore(s => s + 1); playSound(true); } else { playSound(false); }
    Haptics.notificationAsync(isRight ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error);
  }

  function next() {
    if (isLast) setFinished(true);
    else { 
      setIndex(i => i + 1); 
      setSelected(null); 
      setSelectedWords([]); 
    }
  }

  function restart() {
    setIndex(0); setSelected(null); setScore(0); setFinished(false); setSelectedWords([]);
  }
  
  function isAnsweredState() {
    return selected !== null;
  }

  if (!lesson || !exercise) return null;
  const progressPercentage = (index / total) * 100;

  // --- Render Finished Screen ---
  if (finished) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scroll}>
            <ThemedText type="title">Waad dhammaysay! 🎉</ThemedText>
            <ThemedText style={styles.scoreText}>Natiijada: {score} / {total}</ThemedText>
            <AnimatedButton title="Mar kale bilow" onPress={restart} backgroundColor="#58cc02" shadowColor="#58a700" fullWidth />
            <Pressable onPress={() => router.back()} style={styles.back}>
              <ThemedText type="small" style={{ textAlign: 'center', marginTop: 20 }}>← Dib u noqo</ThemedText>
            </Pressable>
          </ScrollView>
        </SafeAreaView>
      </ThemedView>
    );
  }

  // --- Render Lesson Screen ---
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll}>
          
          <View style={styles.topBar}>
            <Pressable onPress={() => router.back()} style={styles.closeBtn}>
              <ThemedText type="title" style={{ fontSize: 20 }}>✕</ThemedText>
            </Pressable>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
            </View>
            <ThemedText type="small" style={styles.counter}>{index + 1}/{total}</ThemedText>
          </View>

          {/* TTS Warning Banner */}
          {!germanVoiceId && (
            <View style={styles.warningBanner}>
              <ThemedText type="small" style={{ color: '#cc0000' }}>⚠️ Codka Jarmalka lama helin telefoonkaaga.</ThemedText>
              <ThemedText type="small" style={{ color: '#cc0000', marginTop: 4 }}>
                Fadlan ka shid Settings &gt; Text-to-Speech si aad u maqasho dhawaaqa saxda ah.
              </ThemedText>
            </View>
          )}

          <ThemedText type="small" style={styles.instruction}>
            {exercise.type === 'multiple_choice' ? 'Dooro tarjumaada saxda ah:' : 'Iska soo ururi jumlada saxda ah:'}
          </ThemedText>
          
          {/* Prompt Area */}
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
              {shuffledOptions.map((option) => {
                const isThis = selected === option;
                const isRight = option === exercise.correctAnswer;
                let bgColor = '#FFFFFF', shadowColor = '#E5E5E5', textColor = '#333333';
                if (isAnswered) {
                  if (isRight) { bgColor = '#d7ffb8'; shadowColor = '#a5d68c'; textColor = '#58a700'; }
                  else if (isThis) { bgColor = '#ffdfe0'; shadowColor = '#ea2b2b'; textColor = '#ea2b2b'; }
                }
                return (
                  <View key={option} style={{ marginBottom: 12 }}>
                     <AnimatedButton title={option} onPress={() => chooseMC(option)} disabled={isAnswered} backgroundColor={bgColor} shadowColor={shadowColor} textColor={textColor} fullWidth hapticStyle="Light" />
                  </View>
                );
              })}
            </View>
          )}

          {/* SENTENCE BUILD UI */}
          {exercise.type === 'sentence_build' && (
            <View style={styles.sentenceContainer}>
              {/* The blank line where words go */}
              <View style={styles.sentenceLine}>
                {selectedWords.map((word, i) => (
                  <Pressable key={`${word}-${i}`} onPress={() => handleWordTap(word)} style={styles.wordChipSelected}>
                    <ThemedText style={{ color: '#333' }}>{word}</ThemedText>
                  </Pressable>
                ))}
              </View>

              {/* The word bank */}
              <View style={styles.wordBank}>
                {shuffledOptions.map((word, i) => {
                  const isUsed = selectedWords.includes(word);
                  return (
                    <Pressable 
                      key={`${word}-${i}`} 
                      onPress={() => handleWordTap(word)} 
                      disabled={isAnswered}
                      style={[styles.wordChip, isUsed && { opacity: 0.3 }]}
                    >
                      <ThemedText>{word}</ThemedText>
                    </Pressable>
                  );
                })}
              </View>

              {/* Check Button for Sentence Build */}
              {!isAnswered && (
                <View style={{ marginTop: 20 }}>
                  <AnimatedButton 
                    title="Hubi" 
                    onPress={checkSentence} 
                    disabled={selectedWords.length === 0}
                    backgroundColor={selectedWords.length > 0 ? "#1cb0f6" : "#E5E5E5"} 
                    shadowColor={selectedWords.length > 0 ? "#1899d6" : "#d4d4d4"} 
                    fullWidth 
                  />
                </View>
              )}
              {/* Feedback for Sentence Build */}
              {isAnswered && (
                <View style={{ marginTop: 20, alignItems: 'center' }}>
                   <ThemedText style={{ color: selected === exercise.correctAnswer ? '#58a700' : '#ea2b2b', fontWeight: 'bold', fontSize: 18 }}>
                     {selected === exercise.correctAnswer ? 'Aad u fiican! (Sax)' : `Qalad. Sax: ${exercise.correctAnswer}`}
                   </ThemedText>
                </View>
              )}
            </View>
          )}

          {/* Continue Button */}
          {isAnswered && (
            <View style={{ marginTop: 20 }}>
              <AnimatedButton title={isLast ? "Dhammaystir" : "Xiga →"} onPress={next} backgroundColor="#58cc02" shadowColor="#58a700" fullWidth hapticStyle="Medium" />
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
  topBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 30, gap: 15 },
  closeBtn: { padding: 5 },
  progressBarBg: { flex: 1, height: 14, backgroundColor: '#E5E5E5', borderRadius: 7, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#58cc02', borderRadius: 7 },
  counter: { fontWeight: 'bold', opacity: 0.5 },
  instruction: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, opacity: 0.8 },
  promptContainer: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 30 },
  prompt: { fontSize: 26 },
  audioBtn: { padding: 10, backgroundColor: '#E5F0FF', borderRadius: 12 },
  optionsContainer: { marginTop: 10 },
  scoreText: { fontSize: 22, marginVertical: 30, fontWeight: 'bold' },
  back: { marginTop: 20 },
  warningBanner: { backgroundColor: '#ffe5e5', padding: 12, borderRadius: 8, marginBottom: 20, borderWidth: 1, borderColor: '#ffcccc' },
  
  sentenceContainer: { flex: 1 },
  sentenceLine: { minHeight: 60, flexDirection: 'row', flexWrap: 'wrap', borderBottomWidth: 2, borderBottomColor: '#E5E5E5', paddingBottom: 10, gap: 8, marginBottom: 30 },
  wordBank: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  wordChip: { paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E5E5', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  wordChipSelected: { paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#E5E5E5', borderRadius: 12, borderWidth: 1, borderColor: '#d4d4d4' }
});