import AsyncStorage from '@react-native-async-storage/async-storage';
import { INITIAL_BOOKS } from '../constants/initialBooks';
import type { Book } from '../types/book';

const STORAGE_KEY = '@library_app_books_v1';

export const loadBooksFromStorage = async (): Promise<Book[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    if (jsonValue !== null) {
      const parsed = JSON.parse(jsonValue) as Book[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BOOKS));
    return INITIAL_BOOKS;
  } catch (error) {
    console.error('Lỗi khi đọc sách từ AsyncStorage:', error);
    return INITIAL_BOOKS;
  }
};

export const saveBooksToStorage = async (books: Book[]): Promise<boolean> => {
  try {
    const jsonValue = JSON.stringify(books);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    return true;
  } catch (error) {
    console.error('Lỗi khi lưu sách vào AsyncStorage:', error);
    return false;
  }
};

export const resetBooksStorage = async (): Promise<Book[]> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BOOKS));
    return INITIAL_BOOKS;
  } catch (error) {
    console.error('Lỗi khi reset sách:', error);
    return INITIAL_BOOKS;
  }
};
