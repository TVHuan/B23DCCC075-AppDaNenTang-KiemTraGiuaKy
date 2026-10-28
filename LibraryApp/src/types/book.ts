export type BookCategory = 'Giáo trình' | 'Tiểu thuyết' | 'Khoa học' | 'Thiếu nhi';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  year: number;
  quantity: number;
  borrowed: number;
}

export type BookFormData = Omit<Book, 'id' | 'borrowed'>;
