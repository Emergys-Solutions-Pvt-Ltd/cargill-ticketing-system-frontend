/**
 * local storage service
 * Handles all local storage operations including safe serialization/deserialization,
 * error handling, and basic CRUD helper methods.
 */

export const localStorageService = {
  /**
   * Set a value in local storage.
   * @param {string} key - The key under which the data is stored.
   * @param {any} value - The data to store. Can be object, array, string, number, boolean, etc.
   * @returns {boolean} - True if set successfully, false otherwise.
   */
  set(key, value) {
    try {
      if (key === undefined || key === null) {
        throw new Error("Storage key must be provided");
      }
      const serializedValue = typeof value === "string" ? value : JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error(`localStorageService.set error for key "${key}":`, error);
      return false;
    }
  },

  /**
   * Get a value from local storage.
   * @param {string} key - The key to retrieve.
   * @param {any} [defaultValue=null] - Default value to return if key is not found or parsing fails.
   * @returns {any} - The parsed object/value or raw string, or the defaultValue.
   */
  get(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(key);
      if (value === null) {
        return defaultValue;
      }
      try {
        return JSON.parse(value);
      } catch {
        // Return raw string if JSON parsing fails
        return value;
      }
    } catch (error) {
      console.error(`localStorageService.get error for key "${key}":`, error);
      return defaultValue;
    }
  },

  /**
   * Remove a value from local storage.
   * @param {string} key - The key to remove.
   * @returns {boolean} - True if removed successfully, false otherwise.
   */
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`localStorageService.remove error for key "${key}":`, error);
      return false;
    }
  },

  /**
   * Check if a key exists in local storage.
   * @param {string} key - The key to check.
   * @returns {boolean}
   */
  has(key) {
    try {
      return localStorage.getItem(key) !== null;
    } catch {
      return false;
    }
  },

  /**
   * Clear all items in local storage.
   * @returns {boolean} - True if cleared successfully, false otherwise.
   */
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error("localStorageService.clear error:", error);
      return false;
    }
  }
};
