import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { FirebirdColors } from '@/constants/Colors';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'athlete' | 'coach'>('athlete');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (!isLogin && password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password, role);
      router.replace('/(tabs)');
    } catch {
      Alert.alert('Error', 'Authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <LinearGradient
      colors={[FirebirdColors.royalBlue, FirebirdColors.gold]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Ionicons name="flame" size={60} color={FirebirdColors.white} />
            <Text style={styles.appName}>Firebird Fit</Text>
            <Text style={styles.tagline}>
              {isLogin ? 'Welcome Back!' : 'Join the Team!'}
            </Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.roleSelector}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === 'athlete' && styles.activeRoleButton,
                ]}
                onPress={() => setRole('athlete')}
              >
                <Ionicons
                  name="fitness"
                  size={20}
                  color={role === 'athlete' ? FirebirdColors.white : FirebirdColors.royalBlue}
                />
                <Text
                  style={[
                    styles.roleText,
                    role === 'athlete' && styles.activeRoleText,
                  ]}
                >
                  Athlete
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === 'coach' && styles.activeRoleButton,
                ]}
                onPress={() => setRole('coach')}
              >
                <Ionicons
                  name="trophy"
                  size={20}
                  color={role === 'coach' ? FirebirdColors.white : FirebirdColors.royalBlue}
                />
                <Text
                  style={[
                    styles.roleText,
                    role === 'coach' && styles.activeRoleText,
                  ]}
                >
                  Coach
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="mail" size={20} color={FirebirdColors.mediumGray} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor={FirebirdColors.mediumGray}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" size={20} color={FirebirdColors.mediumGray} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={FirebirdColors.mediumGray}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off' : 'eye'}
                  size={20}
                  color={FirebirdColors.mediumGray}
                />
              </TouchableOpacity>
            </View>

            {!isLogin && (
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} color={FirebirdColors.mediumGray} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm Password"
                  placeholderTextColor={FirebirdColors.mediumGray}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showPassword}
                />
              </View>
            )}

            <TouchableOpacity
              style={styles.authButton}
              onPress={handleAuth}
              disabled={isLoading}
            >
              <Text style={styles.authButtonText}>
                {isLoading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.switchButton} onPress={toggleMode}>
              <Text style={styles.switchText}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <Text style={styles.switchTextBold}>
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </Text>
              </Text>
            </TouchableOpacity>

            {isLogin && (
              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: FirebirdColors.white,
    marginTop: 10,
  },
  tagline: {
    fontSize: 16,
    color: FirebirdColors.white + 'CC',
    marginTop: 5,
  },
  formContainer: {
    backgroundColor: FirebirdColors.white,
    borderRadius: 20,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  roleSelector: {
    flexDirection: 'row',
    backgroundColor: FirebirdColors.lightGray,
    borderRadius: 25,
    padding: 4,
    marginBottom: 30,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
  },
  activeRoleButton: {
    backgroundColor: FirebirdColors.royalBlue,
  },
  roleText: {
    fontSize: 16,
    fontWeight: '600',
    color: FirebirdColors.royalBlue,
  },
  activeRoleText: {
    color: FirebirdColors.white,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: FirebirdColors.lightGray,
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: FirebirdColors.darkGray,
  },
  authButton: {
    backgroundColor: FirebirdColors.royalBlue,
    borderRadius: 15,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  authButtonText: {
    color: FirebirdColors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  switchButton: {
    alignItems: 'center',
    marginBottom: 10,
  },
  switchText: {
    fontSize: 14,
    color: FirebirdColors.mediumGray,
  },
  switchTextBold: {
    fontWeight: '600',
    color: FirebirdColors.royalBlue,
  },
  forgotPassword: {
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontSize: 14,
    color: FirebirdColors.gold,
    fontWeight: '500',
  },
}); 