export type BookCategory = 'Giáo trình' | 'Tiểu thuyết' | 'Khoa học' | 'Thiếu nhi';

export interface BorrowRecord {
  id: string;
  borrowerName: string;
  borrowerPhone?: string;
  borrowDate: string; // Ngày mượn (DD/MM/YYYY)
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  year: number;
  quantity: number;
  borrowed: number;
  borrowers?: BorrowRecord[];
}

export type BookFormData = Omit<Book, 'id' | 'borrowed' | 'borrowers'>;
