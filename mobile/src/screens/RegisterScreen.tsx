import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput, Button, Text, Title } from 'react-native-paper';
import { useAuthStore } from '../store/authStore';
import { useNavigation } from '@react-navigation/native';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    dateOfBirth: '',
    school: '',
    university: '',
  });
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  
  const { register, error, clearError } = useAuthStore();
  const navigation = useNavigation();

  const handleRegister = async () => {
    setValidationError('');
    
    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 8) {
      setValidationError('Password must be at least 8 characters');
      return;
    }

    try {
      setLoading(true);
      clearError();
      
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
    } catch (err) {
      // Error is handled in the store
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData((prev: typeof formData) => ({ ...prev, [field]: value }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Title style={styles.title}>Create Account</Title>
        <Text style={styles.subtitle}>Join the learning community</Text>

        <TextInput
          label="Full Name *"
          value={formData.name}
          onChangeText={(text: string) => updateField('name', text)}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Email *"
          value={formData.email}
          onChangeText={(text: string) => updateField('email', text)}
          mode="outlined"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <TextInput
          label="Password *"
          value={formData.password}
          onChangeText={(text: string) => updateField('password', text)}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />

        <TextInput
          label="Confirm Password *"
          value={formData.confirmPassword}
          onChangeText={(text: string) => updateField('confirmPassword', text)}
          mode="outlined"
          secureTextEntry
          style={styles.input}
        />

        <TextInput
          label="Date of Birth (YYYY-MM-DD) *"
          value={formData.dateOfBirth}
          onChangeText={(text: string) => updateField('dateOfBirth', text)}
          mode="outlined"
          placeholder="1995-01-15"
          style={styles.input}
        />

        <TextInput
          label="School"
          value={formData.school}
          onChangeText={(text: string) => updateField('school', text)}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="University"
          value={formData.university}
          onChangeText={(text: string) => updateField('university', text)}
          mode="outlined"
          style={styles.input}
        />

        {(validationError || error) && (
          <Text style={styles.error}>{validationError || error}</Text>
        )}

        <Button
          mode="contained"
          onPress={handleRegister}
          loading={loading}
          disabled={loading || !formData.email || !formData.password || !formData.name}
          style={styles.button}
        >
          Register
        </Button>

        <Button
          mode="text"
          onPress={() => navigation.goBack()}
          style={styles.linkButton}
        >
          Already have an account? Login
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#6200ee',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#666',
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
    paddingVertical: 6,
  },
  linkButton: {
    marginTop: 8,
  },
  error: {
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 8,
  },
});
