import NodeCache from 'node-cache';
import { HotTeacherProfile } from './instagram-scraper.js';

/**
 * In-memory cache service for Instagram profiles
 * TTL: 3 days (259200 seconds)
 */
export class CacheService {
  private cache: NodeCache;
  private readonly DEFAULT_TTL = 259200; // 3 days in seconds
  
  constructor(ttlSeconds: number = 259200) {
    this.cache = new NodeCache({
      stdTTL: ttlSeconds,
      checkperiod: 600, // Check for expired keys every 10 minutes
      useClones: false, // Don't clone objects for better performance
      deleteOnExpire: true,
      enableLegacyCallbacks: false
    });
    
    // Log cache stats periodically
    this.cache.on('set', (key) => {
      console.log(`[Cache] Set: ${key}`);
    });
    
    this.cache.on('del', (key) => {
      console.log(`[Cache] Deleted: ${key}`);
    });
    
    this.cache.on('expired', (key) => {
      console.log(`[Cache] Expired: ${key}`);
    });
  }
  
  /**
   * Generate cache key for a set of handles
   */
  private getCacheKey(handles: string[]): string {
    // Sort handles to ensure consistent keys regardless of order
    const sortedHandles = [...handles].sort();
    return `profiles:${sortedHandles.join(',')}`;
  }
  
  /**
   * Get cached profiles for given handles
   */
  get(handles: string[]): HotTeacherProfile[] | undefined {
    const key = this.getCacheKey(handles);
    const cached = this.cache.get<HotTeacherProfile[]>(key);
    
    if (cached) {
      console.log(`[Cache] HIT for handles: ${handles.join(', ')}`);
      const ttl = this.cache.getTtl(key);
      if (ttl) {
        const remainingTime = Math.round((ttl - Date.now()) / 1000 / 60 / 60); // hours
        console.log(`[Cache] TTL remaining: ${remainingTime} hours`);
      }
    } else {
      console.log(`[Cache] MISS for handles: ${handles.join(', ')}`);
    }
    
    return cached;
  }
  
  /**
   * Cache profiles with optional custom TTL
   */
  set(handles: string[], profiles: HotTeacherProfile[], ttlSeconds?: number): void {
    const key = this.getCacheKey(handles);
    const ttl = ttlSeconds || this.DEFAULT_TTL;
    
    this.cache.set(key, profiles, ttl);
    console.log(`[Cache] Stored ${profiles.length} profiles for ${ttl/3600} hours`);
  }
  
  /**
   * Check if profiles are cached for given handles
   */
  has(handles: string[]): boolean {
    const key = this.getCacheKey(handles);
    return this.cache.has(key);
  }
  
  /**
   * Manually invalidate cache for specific handles
   */
  invalidate(handles: string[]): void {
    const key = this.getCacheKey(handles);
    this.cache.del(key);
    console.log(`[Cache] Invalidated: ${handles.join(', ')}`);
  }
  
  /**
   * Clear entire cache
   */
  clear(): void {
    this.cache.flushAll();
    console.log('[Cache] Cleared all entries');
  }
  
  /**
   * Get cache statistics
   */
  getStats() {
    const keys = this.cache.keys();
    const stats = this.cache.getStats();
    
    return {
      keys: keys.length,
      hits: stats.hits,
      misses: stats.misses,
      hitRate: stats.hits > 0 ? (stats.hits / (stats.hits + stats.misses) * 100).toFixed(2) + '%' : '0%',
      ksize: stats.ksize,
      vsize: stats.vsize
    };
  }
  
  /**
   * Warm up cache with default handles
   * Useful for preloading popular profiles on startup
   */
  async warmUp(
    defaultHandles: string[], 
    fetchFunction: (handles: string[]) => Promise<HotTeacherProfile[]>
  ): Promise<void> {
    console.log('[Cache] Warming up with default handles...');
    
    try {
      const profiles = await fetchFunction(defaultHandles);
      this.set(defaultHandles, profiles);
      console.log(`[Cache] Warmed up with ${profiles.length} profiles`);
    } catch (error) {
      console.error('[Cache] Warmup failed:', error);
    }
  }
}

// Singleton instance
let cacheInstance: CacheService | null = null;

export const getCache = (): CacheService => {
  if (!cacheInstance) {
    cacheInstance = new CacheService();
  }
  return cacheInstance;
};

export default CacheService;