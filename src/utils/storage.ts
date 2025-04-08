import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bird } from '../types/Bird';
import { STORAGE_KEYS } from './constants';

export const saveBirds = async (birds: Bird[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.BIRDS, JSON.stringify(birds));
  } catch (e) {
    console.error('Error guardando aves', e);
  }
};

export const getStoredBirds = async (): Promise<Bird[] | null> => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEYS.BIRDS);
    return stored ? JSON.parse(stored) : null;
  } catch (e) {
    console.error('Error leyendo aves guardadas', e);
    return null;
  }
};