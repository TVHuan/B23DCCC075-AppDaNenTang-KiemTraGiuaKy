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
import type { Book, BookFormData, BorrowRecord } from '../types/book';

export interface BorrowerInput {
  name: string;
  studentId: string;
  phone: string;
  borrowDate: string;
  dueDate: string;
  borrowCount?: number;
}

export interface ActiveBorrowItem {
  bookId: string;
  bookTitle: string;
  bookCategory: string;
  record: BorrowRecord;
}

interface BookContextType {
  books: Book[];
  loading: boolean;
  addBook: (bookData: BookFormData) => Promise<Book>;
  updateBook: (updatedBook: Book) => Promise<void>;
  deleteBook: (id: string) => Promise<boolean>;
  borrowBook: (id: string, borrowerInfo: BorrowerInput) => Promise<boolean>;
  returnBook: (id: string, borrowerRecordId?: string) => Promise<boolean>;
  getBookById: (id: string) => Book | null;
  totalBooks: number;
  totalBorrowed: number;
  activeBorrowList: ActiveBorrowItem[];
}

const BookContext = createContext<BookContextType | null>(null);

export const BookProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Nạp dữ liệu từ AsyncStorage
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

  const updateAndPersist = useCallback(async (newBooks: Book[]) => {
    setBooks(newBooks);
    await saveBooksToStorage(newBooks);
  }, []);

  // Thêm sách mới
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
        borrowers: [],
      };
      const updated = [newBook, ...books];
      await updateAndPersist(updated);
      return newBook;
    },
    [books, updateAndPersist]
  );

  // Sửa sách
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
            borrowers: b.borrowers || [],
          };
        }
        return b;
      });
      await updateAndPersist(updated);
    },
    [books, updateAndPersist]
  );

  // Xoá sách
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

  // Cho mượn sách với đầy đủ thông tin: họ tên, mã SV, SĐT, ngày mượn, ngày hẹn trả, số cuốn
  const borrowBook = useCallback(
    async (id: string, borrowerInfo: BorrowerInput): Promise<boolean> => {
      const target = books.find((b) => b.id === id);
      if (!target) return false;
      const count = borrowerInfo.borrowCount && borrowerInfo.borrowCount > 0 ? borrowerInfo.borrowCount : 1;
      const remaining = target.quantity - target.borrowed;
      if (remaining < count) return false;

      const newRecord: BorrowRecord = {
        id: Date.now().toString(),
        borrowerName: borrowerInfo.name.trim(),
        studentId: borrowerInfo.studentId.trim(),
        borrowerPhone: borrowerInfo.phone.trim(),
        borrowDate: borrowerInfo.borrowDate.trim(),
        dueDate: borrowerInfo.dueDate.trim(),
        borrowCount: count,
      };

      const updated = books.map((b) => {
        if (b.id === id) {
          const currentBorrowers = b.borrowers || [];
          return {
            ...b,
            borrowed: b.borrowed + count,
            borrowers: [newRecord, ...currentBorrowers],
          };
        }
        return b;
      });
      await updateAndPersist(updated);
      return true;
    },
    [books, updateAndPersist]
  );

  // Nhận trả sách
  const returnBook = useCallback(
    async (id: string, borrowerRecordId?: string): Promise<boolean> => {
      const target = books.find((b) => b.id === id);
      if (!target) return false;
      if (target.borrowed <= 0) return false;

      const updated = books.map((b) => {
        if (b.id === id) {
          let updatedBorrowers = b.borrowers || [];
          let returnCount = 1;

          if (borrowerRecordId) {
            const found = updatedBorrowers.find((r) => r.id === borrowerRecordId);
            if (found) {
              returnCount = found.borrowCount || 1;
            }
            updatedBorrowers = updatedBorrowers.filter((r) => r.id !== borrowerRecordId);
          } else if (updatedBorrowers.length > 0) {
            const first = updatedBorrowers[0];
            returnCount = first.borrowCount || 1;
            updatedBorrowers = updatedBorrowers.slice(1);
          }

          return {
            ...b,
            borrowed: Math.max(0, b.borrowed - returnCount),
            borrowers: updatedBorrowers,
          };
        }
        return b;
      });
      await updateAndPersist(updated);
      return true;
    },
    [books, updateAndPersist]
  );

  // Lấy 1 cuốn sách
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

  // Danh sách toàn bộ bạn đọc đang mượn trong hệ thống
  const activeBorrowList = useMemo((): ActiveBorrowItem[] => {
    const list: ActiveBorrowItem[] = [];
    books.forEach((book) => {
      if (book.borrowers && book.borrowers.length > 0) {
        book.borrowers.forEach((rec) => {
          list.push({
            bookId: book.id,
            bookTitle: book.title,
            bookCategory: book.category,
            record: rec,
          });
        });
      }
    });
    return list;
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
      activeBorrowList,
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
      activeBorrowList,
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
