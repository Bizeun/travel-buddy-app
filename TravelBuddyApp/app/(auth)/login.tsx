import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { supabase } from '@/lib/supaClient';
import { Link } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, StyleSheet, TextInput } from 'react-native';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

async function signInWithGoogle() {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: Linking.createURL('/'),
        skipBrowserRedirect: true,
      },
    });
    if (error) {
      Alert.alert('Error', error.message);
    }
    const { url } = data;
    if (url) {
      const result = await WebBrowser.openAuthSessionAsync(
        url,
        Linking.createURL('/')
      );
      if (result.type === 'success') {
        console.log('브라우저 세션 성공');
      }
    }
  } catch (error) {
    console.error('Google 로그인 오류:', error);
    Alert.alert('Error', 'Google 로그인에 실패했습니다.');
  }
}

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert('Error', error.message);
    }
    setLoading(false);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Login</ThemedText>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} disabled={loading} />
      <Button title="Sign in with Google" onPress={signInWithGoogle} />

      <Link href={'/(auth)/signup' as any} style={styles.link}>
        <ThemedText type="link">Don't have an account? Sign up</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  link: {
    marginTop: 20,
  }
}); 