import { useState, useEffect } from 'react';
import { UseLocalStorageReturn } from '@/types/types';

export function useLocalStorage<T>(
  key: string, 
  initialValue: T
): UseLocalStorageReturn<T> {
  const [storedValue, setStoredValue] = useState(initialValue);

  // Get value from localStorage on mount
  useEffect(() => {
    try{
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      }
    }catch(error){
      console.error(`Error reading localStorage key "${key}":`, error);
      setStoredValue(initialValue);
    }
  }, [key, initialValue]);

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = (value: T) => {
    try{
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Function to remove the value from localStorage
  const removeValue = () => {
    try{
      // Remove from localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      
      // Reset state to initial value
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return {
    value: storedValue,
    setValue,
    removeValue
  };
}

// functions for localStorage operations
export const localStorageUtils = {
  // Get item with type safety and error handling
  getItem: <T>(key: string, defaultValue: T): T => {
    try{
      if (typeof window !== 'undefined') {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
      }
      return defaultValue;
    } catch (error) {
      console.error(`Error getting localStorage item "${key}":`, error);
      return defaultValue;
    }
  },

  // Set item with error handling
  setItem: <T>(key: string, value: T): boolean => {
    try{
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error setting localStorage item "${key}":`, error);
      return false;
    }
  },

  // Remove item with error handling
  removeItem: (key: string): boolean => {
    try{
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
        return true;
      }
      return false;
    } catch(error){
      console.error(`Error removing localStorage item "${key}":`, error);
      return false;
    }
  },

  // Clear all localStorage items
  clear: (): boolean => {
    try {
      if (typeof window !== 'undefined'){
        window.localStorage.clear();
        return true;
      }
      return false;
    } catch(error){
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },

  // Check if localStorage is available
  isAvailable: (): boolean =>{
    try {
      if (typeof window === 'undefined') return false;
      
      const test = '__localStorage_test__';
      window.localStorage.setItem(test, test);
      window.localStorage.removeItem(test);
      return true;
    }catch{
      return false;
    }
  },

  // Get all keys in localStorage
  getAllKeys: (): string[] =>{
    try{
      if (typeof window !== 'undefined') {
        return Object.keys(window.localStorage);
      }
      return [];
    }catch(error) {
      console.error('Error getting localStorage keys:', error);
      return [];
    }
  },

  // Get storage usage (approximate)
  getStorageSize: (): number =>{
    try{
      if (typeof window !== 'undefined'){
        let total = 0;
        for (const key in window.localStorage) {
          if (window.localStorage.hasOwnProperty(key)) {
            total += window.localStorage[key].length + key.length;
          }
        }
        return total;
      }
      return 0;
    }catch (error){
      console.error('Error calculating localStorage size:', error);
      return 0;
    }
  }
};

// Hook for managing arrays in localStorage
export function useLocalStorageArray<T>(
  key: string, 
  initialValue: T[] = []
): UseLocalStorageReturn<T[]> & {
  addItem: (item: T) =>void;
  removeItem: (index: number) =>void;
  updateItem: (index: number, item:T) =>void;
  clearArray: () =>void
} {
  const { value, setValue, removeValue} = useLocalStorage<T[]>(key, initialValue);

  const addItem = (item: T) =>{
    setValue([...value, item]);
  };

  const removeItem = (index: number) =>{
    setValue(value.filter((_, i) => i !== index));
  };

  const updateItem =(index: number, item: T) =>{
    const newArray = [...value];
    newArray[index] = item;
    setValue(newArray);
  };

  const clearArray =() =>{
    setValue([]);
  };

  return {
    value,
    setValue,
    removeValue,
    addItem,
    removeItem,
    updateItem,
    clearArray
  };
}