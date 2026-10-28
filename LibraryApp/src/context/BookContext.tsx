import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';
import { loadBooksFromStorage, saveBooksToStorage } from '../storage/bookStorage';
import type { Book, BookFormData } from '../types/book';

interface BookContextType {
  books: Book[];
  loading: boolean;
  addBook: (bookData: BookFormData) => Promise<Book>;
  updateBook: (updatedBook: Book) => Promise<void>;
  deleteBook: (id: string) => Promise<boolean>;
  borrowBook: (id: string) => Promise<boolean>;
  returnBook: (id: string) => Promise<boolean>;
  getBookById: (id: string) => Book | null;
  totalBooks: number;
  totalBorrowed: number;
}

const BookContext = createContext<BookContextType | null>(null);

export const BookProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Nạp dữ liệu ban đầu từ AsyncStorage
  useEffect(() => {
    const initData = async () => {
      try {
        const storedBooks = await loadBooksFromStorage();
        setBooks(storedBooks);
      } catch (err) {
        console.error('Lỗi khởi tạo BookContext:', err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  // Cập nhật state và lưu vào AsyncStorage
  const updateAndPersist = useCallback(async (newBooks: Book[]) => {
    setBooks(newBooks);
    await saveBooksToStorage(newBooks);
  }, []);

  // Thêm sách mới (Câu 2)
  const addBook = useCallback(
    async (bookData: BookFormData): Promise<Book> => {
      const newBook: Book = {
        id: Date.now().toString(),
        title: bookData.title.trim(),
        author: bookData.author.trim(),
        category: bookData.category,
        year: Number(bookData.year),
        quantity: Number(bookData.quantity),
        borrowed: 0,
      };
      const updated = [newBook, ...books];
      await updateAndPersist(updated);
      return newBook;
    },
    [books, updateAndPersist]
  );

  // Cập nhật sách (Câu 2)
  const updateBook = useCallback(
    async (updatedBook: Book): Promise<void> => {
      const updated = books.map((b) => {
        if (b.id === updatedBook.id) {
          return {
            ...b,
            title: updatedBook.title.trim(),
            author: updatedBook.author.trim(),
            category: updatedBook.category,
            year: Number(updatedBook.year),
            quantity: Number(updatedBook.quantity),
            borrowed: Number(b.borrowed) || 0,
          };
        }
        return b;
      });
      await updateAndPersist(updated);
    },
    [books, updateAndPersist]
  );

  // Xoá sách (Câu 3)
  const deleteBook = useCallback(
    async (id: string): Promise<boolean> => {
      const target = books.find((b) => b.id === id);
      if (!target) return false;
      if (target.borrowed > 0) {
        return false;
      }
      const updated = books.filter((b) => b.id !== id);
      await updateAndPersist(updated);
      return true;
    },
    [books, updateAndPersist]
  );

  // Cho mượn sách (Câu 4)
  const borrowBook = useCallback(
    async (id: string): Promise<boolean> => {
      const target = books.find((b) => b.id === id);
      if (!target) return false;
      const remaining = target.quantity - target.borrowed;
      if (remaining <= 0) return false;

      const updated = books.map((b) => {
        if (b.id === id) {
          return { ...b, borrowed: b.borrowed + 1 };
        }
        return b;
      });
      await updateAndPersist(updated);
      return true;
    },
    [books, updateAndPersist]
  );

  // Nhận trả sách (Câu 4)
  const returnBook = useCallback(
    async (id: string): Promise<boolean> => {
      const target = books.find((b) => b.id === id);
      if (!target) return false;
      if (target.borrowed <= 0) return false;

      const updated = books.map((b) => {
        if (b.id === id) {
          return { ...b, borrowed: b.borrowed - 1 };
        }
        return b;
      });
      await updateAndPersist(updated);
      return true;
    },
    [books, updateAndPersist]
  );

  // Lấy 1 cuốn sách theo ID
  const getBookById = useCallback(
    (id: string): Book | null => {
      return books.find((b) => b.id === id) || null;
    },
    [books]
  );

  const totalBooks = useMemo(() => books.length, [books]);
  const totalBorrowed = useMemo(() => {
    return books.reduce((sum, b) => sum + (Number(b.borrowed) || 0), 0);
  }, [books]);

  const value = useMemo(
    () => ({
      books,
      loading,
      addBook,
      updateBook,
      deleteBook,
      borrowBook,
      returnBook,
      getBookById,
      totalBooks,
      totalBorrowed,
    }),
    [
      books,
      loading,
      addBook,
      updateBook,
      deleteBook,
      borrowBook,
      returnBook,
      getBookById,
      totalBooks,
      totalBorrowed,
    ]
  );

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
};

export const useBooks = (): BookContextType => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks phải được sử dụng bên trong BookProvider');
  }
  return context;
};
