import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Avatar, Card, Divider } from 'react-native-paper';
import { useAuthStore } from '../store/authStore';

// Placeholder screen - will be fully implemented later
export default function ProfileScreen() {
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  if (!user) {
    return null;
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text 
          size={80} 
          label={user.name[0].toUpperCase()} 
          style={styles.avatar}
        />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        
        {user.university && (
          <Text style={styles.institution}>🎓 {user.university}</Text>
        )}
        {user.school && (
          <Text style={styles.institution}>🏫 {user.school}</Text>
        )}
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{user.followersCount || 0}</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>{user.followingCount || 0}</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>
            {formatTime(user.totalLearningTime || 0)}
          </Text>
          <Text style={styles.statLabel}>Total Time</Text>
        </View>
      </View>

      <Divider style={styles.divider} />

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>About</Text>
          <Text>{user.bio || 'No bio yet'}</Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>Recent Sessions</Text>
          <Text style={styles.placeholder}>No sessions yet</Text>
        </Card.Content>
      </Card>

      <Button 
        mode="outlined" 
        onPress={handleLogout}
        style={styles.logoutButton}
      >
        Logout
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
  },
  avatar: {
    backgroundColor: '#6200ee',
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  institution: {
    fontSize: 14,
    color: '#444',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  divider: {
    marginVertical: 8,
  },
  card: {
    margin: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  placeholder: {
    color: '#999',
    fontStyle: 'italic',
  },
  logoutButton: {
    margin: 20,
    borderColor: '#d32f2f',
  },
});
