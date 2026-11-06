import { useAudioPlayer } from 'expo-audio';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import * as Speech from 'expo-speech';
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { AnimatedButton } from 'react-native-3d-animated-buttons';
import ConfettiCannon from 'react-native-confetti-cannon';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '../components/themed-text';
import { ThemedView } from '../components/themed-view';
import { MaxContentWidth, Spacing } from '../constants/theme';
import { Exercise, generateA1Exam } from '../data/lessons';

export default function ExamScreen() {
  const [questions, setQuestions] = useState<Exercise[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  
  const [selected, setSelected] = useState<string | null>(null);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  
  // Match Pairs State
  const [leftWords, setLeftWords] = useState<string[]>([]);
  const [rightWords, setRightWords] = useState<string[]>([]);
  const [leftSelected, setLeftSelected] = useState<string | null>(null);
  const [rightSelected, setRightSelected] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);
  const [matchMapping, setMatchMapping] = useState<Record<string, string>>({});

  const [germanVoiceId, setGermanVoiceId] = useState<string | undefined>(undefined);
  const correctPlayer = useAudioPlayer(require('../../assets/sounds/correct.mp3'));
  const wrongPlayer = useAudioPlayer(require('../../assets/sounds/wrong.mp3'));

  const exercise = questions[index];
  const isAnswered = selected !== null;
  const total = questions.length;

  useEffect(() => {
    setQuestions(generateA1Exam());
    async function loadGermanVoice() {
      const voices = await Speech.getAvailableVoicesAsync();
      const deVoice = voices.find(v => v.language.startsWith('de'));
      if (deVoice) setGermanVoiceId(deVoice.identifier);
    }
    loadGermanVoice();
  }, []);

  function playSound(isCorrect: boolean) {
    try {
      const player = isCorrect ? correctPlayer : wrongPlayer;
      player.seekTo(0);
      player.play();
    } catch (e) {}
  }

  useEffect(() => {
    if (exercise) {
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
        setLeftWords(shuffledPairs.map(p => p.de).sort(() => 0.5 - Math.random()));
        setRightWords(shuffledPairs.map(p => p.so).sort(() => 0.5 - Math.random()));
        const mapping: Record<string, string> = {};
        shuffledPairs.forEach(p => { mapping[p.de] = p.so; });
        setMatchMapping(mapping);
        setLeftSelected(null);
        setRightSelected(null);
        setMatchedPairs([]); 
      }

      const options = [...exercise.options];
      for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
      }
      setShuffledOptions(options);
    }
  }, [index, exercise, germanVoiceId]);

  function chooseMC(option: string) {
    if (isAnswered) return;
    setSelected(option);
    const isRight = option === exercise?.correctAnswer;
    if (isRight) { setScore(s => s + 1); playSound(true); } else { playSound(false); }
    Haptics.notificationAsync(isRight ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error);
  }

  function handleWordTap(word: string) {
    if (isAnswered) return;
    const newSelected = [...selectedWords, word];
    setSelectedWords(newSelected);

    if (newSelected.length === exercise.options.length) {
      setTimeout(() => {
        const userAnswer = newSelected.join(' ');
        const isRight = userAnswer === exercise.correctAnswer;
        setSelected(userAnswer);
        if (isRight) { setScore(s => s + 1); playSound(true); } else { playSound(false); }
      }, 100);
    }
  }

  function handleLetterTap(letter: string) {
    if (isAnswered) return;
    const newSelected = [...selectedLetters, letter];
    setSelectedLetters(newSelected);

    if (newSelected.length === exercise.correctAnswer.length) {
      setTimeout(() => {
        const userAnswer = newSelected.join('');
        const isRight = userAnswer === exercise.correctAnswer;
        setSelected(userAnswer);
        if (isRight) { setScore(s => s + 1); playSound(true); } else { playSound(false); }
      }, 100);
    }
  }

  function handleMatchTap(word: string, side: 'left' | 'right') {
    if (isAnswered || matchedPairs.includes(word)) return;

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
        if (newMatched.length === 5) {
          setSelected('matched');
          setScore(s => s + 1);
        }
      } else {
        playSound(false);
        setTimeout(() => {
          setLeftSelected(null);
          setRightSelected(null);
        }, 600);
      }
    }
  }

  function next() {
    if (index + 1 >= total) {
      setFinished(true);
    } else {
      setIndex(i => i + 1);
      setSelected(null);
      setSelectedWords([]);
      setSelectedLetters([]);
    }
  }

  if (!exercise && !finished) return null;

  // --- RENDER CERTIFICATE ---
  if (finished) {
    const percentage = Math.round((score / total) * 100);
    const passed = percentage >= 60; // 60% passing grade
    const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

    return (
      <ThemedView style={styles.container}>
        <ConfettiCannon count={200} origin={{x: -10, y: 0}} fadeOut={true} />
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollCenter}>
            
            <View style={styles.certificate}>
              <ThemedText style={styles.certTitle}>JARMALKA</ThemedText>
              <ThemedText style={styles.certSubtitle}>Certificate of Completion</ThemedText>
              
              <ThemedText style={styles.certText}>This certifies that you have successfully completed the</ThemedText>
              <ThemedText style={styles.certLevel}>A1 German Course</ThemedText>
              
              <View style={styles.scoreCircle}>
                <ThemedText style={styles.scoreValue}>{percentage}%</ThemedText>
                <ThemedText style={styles.scoreLabel}>Score</ThemedText>
              </View>

              {passed ? (
                <ThemedText style={styles.certReady}>
                  Aad baad u fiican tahay! Waxaad diyaar u tahay inaad qaadato imtixaanka rasmiga ah ee A1 (You are ready to take the official A1 test).
                </ThemedText>
              ) : (
                <ThemedText style={[styles.certReady, { color: '#ea2b2b' }]}>
                  Wali ma aadan diyaar u ahayn imtixaanka. Fadlan ku celi casharrada oo isku day mar kale.
                </ThemedText>
              )}

              <View style={styles.certFooter}>
                <ThemedText style={styles.certDate}>{date}</ThemedText>
                <View style={styles.seal}>
                  <ThemedText style={{ fontSize: 24 }}>🏆</ThemedText>
                </View>
              </View>
            </View>

            <AnimatedButton 
              title="Ku noqo casharrada" 
              onPress={() => router.replace('/lessons/a1')} 
              backgroundColor="#4189DD" 
              shadowColor="#2b5a91" 
              fullWidth 
              style={{ marginTop: 30 }}
            />
          </ScrollView>
        </SafeAreaView>
      </ThemedView>
    );
  }

  // --- RENDER EXAM UI ---
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView contentContainerStyle={styles.scroll}>
          
          <View style={styles.topBar}>
            <Pressable onPress={() => router.back()} style={styles.closeBtn}>
              <ThemedText type="title" style={{ fontSize: 20 }}>✕</ThemedText>
            </Pressable>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${(index / total) * 100}%` }]} />
            </View>
            <ThemedText type="small" style={styles.counter}>{index + 1}/{total}</ThemedText>
          </View>

          <ThemedText type="small" style={styles.instruction}>
            {exercise.type === 'multiple_choice' ? 'Dooro tarjumaada saxda ah:' : 
             exercise.type === 'sentence_build' ? 'Iska soo ururi jumlada saxda ah:' :
             exercise.type === 'match_pairs' ? 'Ku xir ereyada isku midka ah:' : 
             'Qor erayga Jarmalka:'}
          </ThemedText>
          
          <View style={styles.promptContainer}>
            <ThemedText type="title" style={styles.prompt}>{exercise.prompt}</ThemedText>
          </View>

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

          {exercise.type === 'sentence_build' && (
            <View style={styles.sentenceContainer}>
              <View style={styles.sentenceLine}>
                {selectedWords.map((word, i) => (
                  <View key={`${word}-${i}`} style={styles.wordChipSelected}>
                    <ThemedText style={{ color: '#333', fontSize: 16, fontWeight: 'bold' }}>{word}</ThemedText>
                  </View>
                ))}
              </View>
              <View style={styles.wordBank}>
                {shuffledOptions.map((word, i) => {
                  const isUsed = selectedWords.includes(word);
                  return (
                    <Pressable key={`${word}-${i}`} onPress={() => handleWordTap(word)} disabled={isAnswered || isUsed} style={[styles.wordChip, isUsed && { opacity: 0.2 }]}>
                      <ThemedText style={{ fontSize: 16, fontWeight: 'bold' }}>{word}</ThemedText>
                    </Pressable>
                  );
                })}
              </View>  
            </View>
          )}

          {exercise.type === 'spelling' && (
            <View style={styles.sentenceContainer}>
              <View style={styles.spellingLine}>
                {exercise.correctAnswer.split('').map((_, i) => {
                  const letter = selectedLetters[i];
                  return (
                    <Pressable 
                      key={i} 
                      onPress={() => {
                        if (isAnswered) return;
                        // Allow user to remove a letter if they tap it
                        const newSelected = [...selectedLetters];
                        newSelected.splice(i, 1);
                        setSelectedLetters(newSelected);
                      }}
                      style={[styles.spellingBox, letter && styles.spellingBoxFilled]}
                    >
                      <ThemedText style={{ fontSize: 20, fontWeight: 'bold' }}>{letter === ' ' ? '' : letter}</ThemedText>
                    </Pressable>
                  );
                })}
              </View>
              <View style={styles.wordBank}>
                {shuffledOptions.map((letter, i) => {
                  const isUsed = selectedLetters.filter(l => l === letter).length >= shuffledOptions.filter(l => l === letter).length;
                  return (
                    <Pressable key={`${letter}-${i}`} onPress={() => handleLetterTap(letter)} disabled={isAnswered || isUsed} style={[styles.wordChip, isUsed && { opacity: 0.2 }, letter === ' ' && { backgroundColor: '#E5F0FF' }]}>
                      <ThemedText style={{ fontSize: 20, fontWeight: 'bold' }}>{letter === ' ' ? '🔲' : letter}</ThemedText>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {/* MATCH PAIRS UI */}
          {exercise.type === 'match_pairs' && (
            <View style={styles.matchContainer}>
              <View style={styles.matchColumn}>
                {leftWords.map((word, index) => {
                  const isMatched = matchedPairs.includes(word);
                  const isSelected = leftSelected === word;
                  return (
                    <Pressable 
                      key={`left-${word}-${index}`} 
                      onPress={() => handleMatchTap(word, 'left')}
                      disabled={isMatched || isAnswered}
                      style={[
                        styles.matchCard, 
                        isSelected && styles.matchCardSelected,
                        isMatched && styles.matchCardMatched
                      ]}
                    >
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
                    <Pressable 
                      key={`right-${word}-${index}`} 
                      onPress={() => handleMatchTap(word, 'right')}
                      disabled={isMatched || isAnswered}
                      style={[
                        styles.matchCard, 
                        isSelected && styles.matchCardSelected,
                        isMatched && styles.matchCardMatched
                      ]}
                    >
                      <ThemedText style={[styles.matchText, isMatched && { opacity: 0.3 }]}>{word}</ThemedText>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}

          {isAnswered && (
            <View style={{ marginTop: 20, marginBottom: 40 }}>
              <AnimatedButton title={index + 1 === total ? "Dhammaystir Imtixaanka" : "Xiga →"} onPress={next} backgroundColor="#58cc02" shadowColor="#58a700" fullWidth hapticStyle="Medium" />
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
  scrollCenter: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 40 },
  
  topBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, gap: 15 },
  closeBtn: { padding: 5 },
  progressBarBg: { flex: 1, height: 14, backgroundColor: '#E5E5E5', borderRadius: 7, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#4189DD', borderRadius: 7 },
  counter: { fontWeight: 'bold', opacity: 0.5 },
  instruction: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, opacity: 0.8 },
  promptContainer: { flexDirection: 'row', alignItems: 'center', gap: 15, marginBottom: 30 },
  prompt: { fontSize: 26 },
  
  optionsContainer: { marginTop: 10 },
  sentenceContainer: { flex: 1 },
  sentenceLine: { minHeight: 60, flexDirection: 'row', flexWrap: 'wrap', borderBottomWidth: 2, borderBottomColor: '#E5E5E5', paddingBottom: 10, gap: 8, marginBottom: 30 },
  wordBank: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  wordChip: { paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E5E5' },
  wordChipSelected: { paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#E5E5E5', borderRadius: 12 },
  spellingLine: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 40, justifyContent: 'center' },
  spellingBox: { width: 40, height: 50, borderBottomWidth: 3, borderBottomColor: '#E5E5E5', alignItems: 'center', justifyContent: 'center' },
  spellingBoxFilled: { borderBottomColor: '#4189DD', backgroundColor: '#E5F0FF', borderRadius: 8 },
  matchContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginTop: 10 },
  matchColumn: { flex: 1, gap: 10 },
  matchCard: { backgroundColor: '#FFF', padding: 15, borderRadius: 12, borderWidth: 2, borderColor: '#E5E5E5', borderBottomWidth: 4, alignItems: 'center', justifyContent: 'center', minHeight: 60 },
  matchCardSelected: { borderColor: '#1cb0f6', backgroundColor: '#E5F0FF' },
  matchCardMatched: { borderColor: '#A5D68C', backgroundColor: '#F7FFF2', borderBottomWidth: 2, marginTop: 2 },
  matchText: { fontSize: 16, fontWeight: 'bold', textAlign: 'center' },

  // Certificate Styles
  certificate: {
    backgroundColor: '#FFF',
    width: '100%',
    padding: 30,
    borderRadius: 16,
    borderWidth: 8,
    borderColor: '#FFCE00', // Gold border
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  certTitle: { fontSize: 32, fontWeight: 'bold', color: '#4189DD', letterSpacing: 2 },
  certSubtitle: { fontSize: 18, color: '#666', marginTop: 5, marginBottom: 30 },
  certText: { fontSize: 16, textAlign: 'center', lineHeight: 24 },
  certLevel: { fontSize: 24, fontWeight: 'bold', color: '#333', marginTop: 10, marginBottom: 30 },
  scoreCircle: { width: 120, height: 120, borderRadius: 60, borderWidth: 6, borderColor: '#58cc02', alignItems: 'center', justifyContent: 'center', marginBottom: 30 },
  scoreValue: { fontSize: 36, fontWeight: 'bold', color: '#58cc02' },
  scoreLabel: { fontSize: 14, color: '#888', textTransform: 'uppercase' },
  certReady: { fontSize: 16, textAlign: 'center', color: '#58cc02', fontWeight: 'bold', marginBottom: 40 },
  certFooter: { width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 20 },
  certDate: { fontSize: 14, color: '#888', fontStyle: 'italic' },
  seal: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#FFF9E6', borderWidth: 2, borderColor: '#FFCE00', alignItems: 'center', justifyContent: 'center' },
});