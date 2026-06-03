class Cache {
  constructor() {
    this.cache = new Map();
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  set(key, value, ttlMs = 60000) {
    const expiry = Date.now() + ttlMs;
    this.cache.set(key, { value, expiry });
  }

  clear() {
    this.cache.clear();
  }
}

module.exports = new Cache();
