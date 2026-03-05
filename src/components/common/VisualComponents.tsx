import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

export function ScreenFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text variant="headlineSmall" style={styles.title}>{title}</Text>
      {children}
    </ScrollView>
  );
}

export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="labelLarge">{label}</Text>
        <Text variant="titleMedium">{value}</Text>
      </Card.Content>
    </Card>
  );
}

export function PrimaryAction({ label, onPress }: { label: string; onPress: () => void }) {
  return <Button mode="contained" onPress={onPress} style={styles.button}>{label}</Button>;
}

export const Inline = ({ children }: { children: React.ReactNode }) => <View style={styles.inline}>{children}</View>;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#121212' },
  container: { padding: 16, gap: 12 },
  title: { color: '#fff', marginBottom: 8 },
  card: { backgroundColor: '#1E1E1E' },
  button: { marginTop: 6 },
  inline: { flexDirection: 'row', gap: 8 },
});
