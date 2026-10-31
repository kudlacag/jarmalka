import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '../../constants/theme';
import { a1Lessons, levels } from '../../data/lessons';
export default function LearnScreen() {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      async function loadProgress() {
        const saved = await AsyncStorage.getItem('@jarmalka_progress');
        if (saved) setCompletedLessons(JSON.parse(saved));
      }
      loadProgress();
    }, [])
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        
        <View style={styles.headerContainer}>
          <ThemedText type="title" style={styles.headerTitle}>Baro Jarmalka</ThemedText>
          <ThemedText style={styles.headerSubtitle}>Dooro heerkaaga (Select your level)</ThemedText>

        </View>

        {/* Colorful Alphabet Button */}
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
            const totalA1 = a1Lessons.length;
            const completedA1 = completedLessons.filter(id => a1Lessons.some(l => l.id === id)).length;
            const progressText = item.id === 'a1' ? `${completedA1} / ${totalA1} Cashar` : 'Dhawaan 🚧';

            // Colors: Somali Blue for A1, German Red for A2, German Gold for B1
            let cardColor = '#4189DD';
            if (item.id === 'a2') cardColor = '#DD0000';
            if (item.id === 'b1') cardColor = '#FFCE00';

            return (
              <Pressable 
                onPress={() => {
                  if (item.unlocked) {
                    router.push({ pathname: '/lessons/[level]', params: { level: item.id } });
                  } else {
                    router.push('/coming-soon');
                  }
                }}
                style={({ pressed }) => [
                  styles.levelCard,
                  { borderLeftColor: cardColor },
                  pressed && { transform: [{ scale: 0.98 }] }
                ]}
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
                  <ThemedText style={{ fontSize: 24 }}>{item.unlocked ? '▶️' : '🔒'}</ThemedText>
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
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  headerContainer: { marginTop: 30, marginBottom: 25 },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: '#333' },
  headerSubtitle: { fontSize: 16, color: '#666', marginTop: 5 },
  
  alphabetCard: { 
    padding: 20, 
    borderRadius: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    borderWidth: 2,
    borderBottomWidth: 6, // 3D effect
  },

  list: { gap: 16 },
  levelCard: { 
    padding: 20, 
    borderRadius: 16, 
    backgroundColor: '#FFFFFF', 
    borderLeftWidth: 8, // Flag color strip
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 4 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 8, 
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center' },
  badge: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    alignItems: 'center', 
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
});