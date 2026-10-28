import type { BookCategory } from '../types/book';

export const BOOK_CATEGORIES: BookCategory[] = [
  'Giáo trình',
  'Tiểu thuyết',
  'Khoa học',
  'Thiếu nhi',
];

export type FilterCategory = 'Tất cả' | BookCategory;

export const FILTER_CATEGORIES: FilterCategory[] = [
  'Tất cả',
  ...BOOK_CATEGORIES,
];
