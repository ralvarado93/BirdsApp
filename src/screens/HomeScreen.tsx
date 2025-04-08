import React, { useEffect, useState, useCallback } from 'react';
import {
  RefreshControl,
  ActivityIndicator,
  Alert,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { Bird } from '../types/Bird';
import BirdCard from '../components/BirdCard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SwipeListView } from 'react-native-swipe-list-view';
import { API_URL, STORAGE_KEYS } from '../utils/constants';

const PAGE_SIZE = 10;

export default function HomeScreen() {
  const [birds, setBirds] = useState<Bird[]>([]);
  const [visibleBirds, setVisibleBirds] = useState<Bird[]>([]);
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [deleted, setDeleted] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const getBirds = async () => {
    try {
      const response = await axios.get<Bird[]>(API_URL);
      const savedDeleted = await AsyncStorage.getItem(STORAGE_KEYS.DELETEDBIRD);
      const deletedIds = savedDeleted ? JSON.parse(savedDeleted) : [];

      const filtered = response.data.filter(b => !deletedIds.includes(b.uid));
      setBirds(filtered);
      setVisibleBirds(filtered.slice(0, PAGE_SIZE));
      setPage(1);
      setDeleted(deletedIds);
      await AsyncStorage.setItem(STORAGE_KEYS.LASTBIRD, JSON.stringify(filtered));
    } catch (err) {
      const saved = await AsyncStorage.getItem(STORAGE_KEYS.LASTBIRD);
      if (saved) {
        const parsed = JSON.parse(saved);
        setBirds(parsed);
        setVisibleBirds(parsed.slice(0, PAGE_SIZE));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBirds();
  }, []);

  const loadMore = () => {
    const nextPage = page + 1;
    const start = (nextPage - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const more = birds.slice(start, end);
    setVisibleBirds(prev => [...prev, ...more]);
    setPage(nextPage);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getBirds().then(() => setRefreshing(false));
  }, []);

  const handleDelete = async (uid: string) => {
    const updatedDeleted = [...deleted, uid];
    const updated = birds.filter(b => b.uid !== uid);
    const updatedVisible = visibleBirds.filter(b => b.uid !== uid);
    setBirds(updated);
    setVisibleBirds(updatedVisible);
    setDeleted(updatedDeleted);
    await AsyncStorage.setItem(STORAGE_KEYS.DELETEDBIRD, JSON.stringify(updatedDeleted));
  };

  const confirmDelete = (uid: string) => {
    Alert.alert(
      'Eliminar ave',
      '¿Estás seguro de que quieres eliminar esta ave?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', onPress: () => handleDelete(uid), style: 'destructive' },
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return <ActivityIndicator testID="activity-indicator" style={{ flex: 1 }} size="large" color="#555" />;
  }

  return (
    <SwipeListView
      data={visibleBirds}
      keyExtractor={(item) => item.uid}
      renderItem={({ item }) => (
        <View style={styles.rowFront}>
          <BirdCard bird={item} />
        </View>
      )}
      renderHiddenItem={({ item }) => (
        <View style={styles.rowBack}>
          <TouchableOpacity style={styles.deleteBtn} onPress={() => confirmDelete(item.uid)}>
            <Text style={styles.deleteText}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      )}
      rightOpenValue={-100}
      disableRightSwipe
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      contentContainerStyle={{ padding: 10 }}
    />

  );
}

const styles = StyleSheet.create({
  rowFront: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
    elevation: 2,
  },
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#ff3b30',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderRadius: 8,
    marginBottom: 10,
    paddingRight: 15,
  },
  deleteBtn: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  deleteText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

