import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, Card, Avatar, Button, ActivityIndicator } from 'react-native-paper';

// Placeholder screen - will be fully implemented later
export default function HomeScreen() {
  // TODO: Fetch feed data from API
  const feedItems: any[] = [];
  const loading = false;

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (feedItems.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>No learning activities yet</Text>
        <Text style={styles.emptySubtext}>
          Follow users to see their learning progress
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={feedItems}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }: { item: any }) => (
          <Card style={styles.card}>
            <Card.Title
              title={item.user.name}
              subtitle={item.createdAt}
              left={(props: any) => <Avatar.Text {...props} label={item.user.name[0]} />}
            />
            <Card.Content>
              <Text>{item.content}</Text>
              <Text style={styles.duration}>Duration: {item.duration}</Text>
            </Card.Content>
            <Card.Actions>
              <Button>Like ({item.likesCount})</Button>
            </Card.Actions>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    margin: 8,
  },
  duration: {
    marginTop: 8,
    fontWeight: 'bold',
    color: '#6200ee',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
