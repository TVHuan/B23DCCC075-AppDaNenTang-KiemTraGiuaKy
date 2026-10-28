import type { Book } from '../types/book';

export const INITIAL_BOOKS: Book[] = [
  {
    id: '1',
    title: 'Giáo trình Lập trình React Native',
    author: 'TS. Nguyễn Văn A',
    category: 'Giáo trình',
    year: 2022,
    quantity: 10,
    borrowed: 3, // Còn 7 cuốn
  },
  {
    id: '2',
    title: 'Dế Mèn Phiêu Lưu Ký',
    author: 'Tô Hoài',
    category: 'Thiếu nhi',
    year: 2018,
    quantity: 5,
    borrowed: 5, // Còn 0 cuốn -> Hiển thị nhãn đỏ "Hết sách"
  },
  {
    id: '3',
    title: 'Vũ Trụ Trong Vỏ Hạt Dẻ',
    author: 'Stephen Hawking',
    category: 'Khoa học',
    year: 2020,
    quantity: 8,
    borrowed: 2, // Còn 6 cuốn
  },
  {
    id: '4',
    title: 'Mắt Biếc',
    author: 'Nguyễn Nhật Ánh',
    category: 'Tiểu thuyết',
    year: 2019,
    quantity: 12,
    borrowed: 4, // Còn 8 cuốn
  },
  {
    id: '5',
    title: 'Lược Sử Thời Gian',
    author: 'Stephen Hawking',
    category: 'Khoa học',
    year: 2021,
    quantity: 6,
    borrowed: 0, // Còn 6 cuốn -> kiểm tra disabled nút Nhận trả
  },
  {
    id: '6',
    title: 'Hoàng Tử Bé',
    author: 'Antoine de Saint-Exupéry',
    category: 'Thiếu nhi',
    year: 2016,
    quantity: 7,
    borrowed: 1, // Còn 6 cuốn
  },
];
