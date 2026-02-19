import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, TextInput, Title } from 'react-native-paper';

// Placeholder screen - will be fully implemented later
export default function TimerScreen() {
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [content, setContent] = useState('');
  const [subject, setSubject] = useState('');

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime((prev: number) => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedTime(0);
  };

  const handleSaveSession = () => {
    // TODO: Save to API
    // eslint-disable-next-line no-console
    console.log('Saving session:', { elapsedTime, content, subject });
    handleReset();
    setContent('');
    setSubject('');
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Learning Timer</Title>
      
      <View style={styles.timerContainer}>
        <Text style={styles.timerText}>{formatTime(elapsedTime)}</Text>
      </View>

      <View style={styles.controls}>
        <Button
          mode="contained"
          onPress={handleStartPause}
          style={styles.button}
        >
          {isRunning ? 'Pause' : 'Start'}
        </Button>
        
        <Button
          mode="outlined"
          onPress={handleReset}
          style={styles.button}
          disabled={elapsedTime === 0}
        >
          Reset
        </Button>
      </View>

      <View style={styles.form}>
        <TextInput
          label="Subject"
          value={subject}
          onChangeText={setSubject}
          mode="outlined"
          style={styles.input}
        />
        
        <TextInput
          label="What did you learn?"
          value={content}
          onChangeText={setContent}
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.input}
        />
        
        <Button
          mode="contained"
          onPress={handleSaveSession}
          disabled={elapsedTime === 0 || !content}
          style={styles.saveButton}
        >
          Save Learning Session
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    marginBottom: 30,
  },
  timerText: {
    fontSize: 48,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    color: '#6200ee',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  form: {
    flex: 1,
  },
  input: {
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 16,
    paddingVertical: 6,
  },
});
