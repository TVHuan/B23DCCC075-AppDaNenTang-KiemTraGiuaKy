import type { Book } from '../types/book';

export const INITIAL_BOOKS: Book[] = [
  {
    id: '1',
    title: 'Giáo trình Lập trình React Native',
    author: 'TS. Nguyễn Văn A',
    category: 'Giáo trình',
    year: 2022,
    quantity: 10,
    borrowed: 3,
    borrowers: [
      { id: 'b1', borrowerName: 'Nguyễn Văn Minh', borrowerPhone: '0912345678', borrowDate: '20/10/2026' },
      { id: 'b2', borrowerName: 'Trần Thị Lan', borrowerPhone: '0987654321', borrowDate: '22/10/2026' },
      { id: 'b3', borrowerName: 'Lê Hoàng Nam', borrowerPhone: '0905123456', borrowDate: '25/10/2026' },
    ],
  },
  {
    id: '2',
    title: 'Dế Mèn Phiêu Lưu Ký',
    author: 'Tô Hoài',
    category: 'Thiếu nhi',
    year: 2018,
    quantity: 5,
    borrowed: 5, // Còn 0 cuốn -> Hiển thị nhãn đỏ "Hết sách"
    borrowers: [
      { id: 'b4', borrowerName: 'Phạm Quỳnh Anh', borrowerPhone: '0933112233', borrowDate: '15/10/2026' },
      { id: 'b5', borrowerName: 'Vũ Đức Thịnh', borrowerPhone: '0944556677', borrowDate: '18/10/2026' },
      { id: 'b6', borrowerName: 'Hoàng Hải Yến', borrowerPhone: '0966778899', borrowDate: '21/10/2026' },
      { id: 'b7', borrowerName: 'Bùi Tuấn Kiệt', borrowerPhone: '0977889900', borrowDate: '23/10/2026' },
      { id: 'b8', borrowerName: 'Đỗ Thảo My', borrowerPhone: '0988990011', borrowDate: '24/10/2026' },
    ],
  },
  {
    id: '3',
    title: 'Vũ Trụ Trong Vỏ Hạt Dẻ',
    author: 'Stephen Hawking',
    category: 'Khoa học',
    year: 2020,
    quantity: 8,
    borrowed: 2,
    borrowers: [
      { id: 'b9', borrowerName: 'Ngô Kiến Huy', borrowerPhone: '0911223344', borrowDate: '24/10/2026' },
      { id: 'b10', borrowerName: 'Đặng Thuỳ Trang', borrowerPhone: '0922334455', borrowDate: '26/10/2026' },
    ],
  },
  {
    id: '4',
    title: 'Mắt Biếc',
    author: 'Nguyễn Nhật Ánh',
    category: 'Tiểu thuyết',
    year: 2019,
    quantity: 12,
    borrowed: 4,
    borrowers: [
      { id: 'b11', borrowerName: 'Nguyễn Anh Tuấn', borrowerPhone: '0933445566', borrowDate: '19/10/2026' },
      { id: 'b12', borrowerName: 'Lý Kim Phượng', borrowerPhone: '0944556677', borrowDate: '22/10/2026' },
      { id: 'b13', borrowerName: 'Dương Văn Toàn', borrowerPhone: '0955667788', borrowDate: '24/10/2026' },
      { id: 'b14', borrowerName: 'Võ Mai Linh', borrowerPhone: '0966778899', borrowDate: '25/10/2026' },
    ],
  },
  {
    id: '5',
    title: 'Lược Sử Thời Gian',
    author: 'Stephen Hawking',
    category: 'Khoa học',
    year: 2021,
    quantity: 6,
    borrowed: 0, // borrowed = 0, kiểm tra disabled nút Nhận trả
    borrowers: [],
  },
  {
    id: '6',
    title: 'Hoàng Tử Bé',
    author: 'Antoine de Saint-Exupéry',
    category: 'Thiếu nhi',
    year: 2016,
    quantity: 7,
    borrowed: 1,
    borrowers: [
      { id: 'b15', borrowerName: 'Hồ Gia Bảo', borrowerPhone: '0977112233', borrowDate: '26/10/2026' },
    ],
  },
];
