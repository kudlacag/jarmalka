import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '../../components/themed-text';
import { ThemedView } from '../../components/themed-view';
import { MaxContentWidth, Spacing } from '../../constants/theme';
import { a1Lessons } from '../../data/lessons';

export default function A1Screen() {
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  useFocusEffect(useCallback(() => {
    AsyncStorage.getItem('@jarmalka_progress').then(saved => {
      if (saved) setCompletedLessons(JSON.parse(saved));
    });
  }, []));

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()}><ThemedText style={{fontSize: 20}}>←</ThemedText></Pressable>
          <ThemedText type="title">A1 Casharrada</ThemedText>
          <View style={{width: 20}}/>
        </View>

        <FlatList
          data={a1Lessons}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => {
            const isCompleted = completedLessons.includes(item.id);
            return (
              <Pressable onPress={() => router.push({ pathname: '/lesson/[id]', params: { id: item.id } })}>
                <ThemedView type="backgroundElement" style={[styles.card, { borderLeftWidth: 5, borderLeftColor: isCompleted ? '#58cc02' : '#4189DD' }]}>
                  <View style={styles.cardHeader}>
                    <ThemedText type="title" style={styles.cardTitle}>{item.title}</ThemedText>
                    {isCompleted && <ThemedText style={{ fontSize: 20 }}>✅</ThemedText>}
                  </View>
                  <ThemedText type="small">{item.titleDe} · Casharka {item.unit}</ThemedText>
                </ThemedView>
              </Pressable>
            );
          }}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, paddingHorizontal: Spacing.four, maxWidth: MaxContentWidth, width: '100%', alignSelf: 'center' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: Spacing.four },
  list: { gap: Spacing.three, paddingBottom: 40 },
  card: { padding: Spacing.three, borderRadius: 12, gap: Spacing.one },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 17, lineHeight: 22 },
});