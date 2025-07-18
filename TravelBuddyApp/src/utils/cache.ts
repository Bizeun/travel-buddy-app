import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = 'cache_';
const DEFAULT_TTL = 3600 * 1000; // 1 hour in milliseconds

interface CacheItem<T> {
  timestamp: number;
  value: T;
  ttl: number;
}

export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (jsonValue != null) {
      const item: CacheItem<T> = JSON.parse(jsonValue);
      const now = Date.now();
      if (now - item.timestamp < item.ttl) {
        return item.value;
      }
      // Cache expired
      await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
    }
  } catch (e) {
    console.error('Failed to get cache.', e);
  }
  return null;
};

export const setCache = async <T>(key: string, value: T, ttl: number = DEFAULT_TTL): Promise<void> => {
  try {
    const item: CacheItem<T> = {
      timestamp: Date.now(),
      value,
      ttl,
    };
    const jsonValue = JSON.stringify(item);
    await AsyncStorage.setItem(`${CACHE_PREFIX}${key}`, jsonValue);
  } catch (e) {
    console.error('Failed to set cache.', e);
  }
}; 