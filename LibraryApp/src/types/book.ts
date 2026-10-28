export type BookCategory = 'Giáo trình' | 'Tiểu thuyết' | 'Khoa học' | 'Thiếu nhi';

export interface BorrowRecord {
  id: string;
  borrowerName: string;      // Họ và tên
  studentId: string;         // Mã sinh viên
  borrowerPhone: string;     // Số điện thoại
  borrowDate: string;        // Ngày mượn (DD/MM/YYYY)
  dueDate: string;           // Ngày hẹn trả (DD/MM/YYYY)
  borrowCount: number;       // Số lượng cuốn mượn
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
