import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Bird } from '../types/Bird';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParam } from '../navigation/AppNavigator';

interface Props {
  bird: Bird;
}

export default function BirdCard({ bird }: Props) {
  const navigation = useNavigation<NavigationProp<RootStackParam>>();
  
  return (
    <TouchableOpacity testID="bird-card" style={styles.card} onPress={() => navigation.navigate('Detail', { bird })}>
      <Image testID="bird-image" source={{ uri: bird.images.thumb }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{bird.name.spanish}</Text>
        <Text>{bird.name.english}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  image: { width: 60, height: 60, borderRadius: 8, marginRight: 10 },
  info: { justifyContent: 'center' },
  name: { fontWeight: 'bold', fontSize: 16 },
});