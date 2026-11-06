import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { AnimatedButton } from 'react-native-3d-animated-buttons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8FAFC' }}>
      <View style={styles.container}>
        <Text style={{ fontSize: 32, fontWeight: 'bold', color: '#1E293B' }}>Gal (Login)</Text>
        <Text style={{ color: '#64748B', marginTop: 10, marginBottom: 30, fontSize: 16 }}>Ku soo dhawow Jarmalka</Text>
        
        {/* Your Login form goes here */}

        <AnimatedButton 
          title="Dib u noqo" 
          onPress={() => router.back()} 
          backgroundColor="#E2E8F0" 
          shadowColor="#CBD5E1" 
          textColor="#475569"
          fullWidth 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' }
});