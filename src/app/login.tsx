import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { AnimatedButton } from 'react-native-3d-animated-buttons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <View style={styles.container}>
        <Text style={{ fontSize: 32, fontWeight: 'bold' }}>Gal (Login)</Text>
        <Text style={{ color: '#666', marginTop: 10, marginBottom: 30 }}>Ku soo dhawow Jarmalka</Text>
        
        {/* Your Login form goes here */}

        <AnimatedButton 
          title="Dib u noqo" 
          onPress={() => router.back()} 
          backgroundColor="#E5E5E5" 
          shadowColor="#C0C0C0" 
          textColor="#333"
          fullWidth 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' }
});