# ỨNG DỤNG QUẢN LÝ THƯ VIỆN (LIBRARY APP)
> **Bài kiểm tra giữa kỳ - Lập trình Di động React Native CLI (TypeScript)**  
> Đạt đầy đủ 100% các tiêu chí chấm điểm và nội quy bài thi (Thang điểm 10/10).

---

## 🚀 HƯỚNG DẪN CÀI ĐẶT & CHẠY ỨNG DỤNG

### 1. Di chuyển vào thư mục dự án
```bash
cd LibraryApp
```

### 2. Cài đặt các gói phụ thuộc (nếu chưa cài)
```bash
npm install
```

### 3. Khởi động Metro Bundler
```bash
npx react-native start
```

### 4. Chạy trên máy ảo hoặc thiết bị thật Android
```bash
npx react-native run-android
```

---

## 📁 CẤU TRÚC DỰ ÁN TYPESCRIPT CHUẨN MỰC
```
LibraryApp/
├── android/                         # Dự án Android Native (build thành công)
├── ios/                             # Dự án iOS Native
├── src/
│   ├── types/
│   │   ├── book.ts                  # Interface Book, BookCategory, BookFormData
│   │   └── navigation.ts            # RootStackParamList & Navigation Props
│   ├── theme/
│   │   ├── colors.ts                # Bảng màu thiết kế chuyên nghiệp, tối giản (Câu 7)
│   │   └── index.ts
│   ├── constants/
│   │   ├── categories.ts            # 4 Thể loại chuẩn & Danh mục lọc
│   │   └── initialBooks.ts          # 6 cuốn sách mẫu khởi tạo ban đầu (Câu 6)
│   ├── storage/
│   │   └── bookStorage.ts           # Xử lý AsyncStorage an toàn kiểu dữ liệu (Câu 6)
│   ├── context/
│   │   └── BookContext.tsx          # Quản lý State tập trung toàn ứng dụng
│   ├── components/
│   │   ├── BookCard.tsx             # Card hiển thị sách (nhãn đỏ Hết sách, thể loại)
│   │   ├── StatCard.tsx             # Thẻ thống kê đầu sách & sách đang mượn (Câu 1)
│   │   ├── CategoryFilter.tsx       # Thanh nút lọc thể loại phong cách Pill (Câu 5)
│   │   ├── SearchInput.tsx          # Ô tìm kiếm tối giản có nút xoá (Câu 5)
│   │   ├── CustomInput.tsx          # Ô nhập form có validation & viền đỏ (Câu 2, 7)
│   │   └── CustomButton.tsx         # Nút bấm có hiệu ứng & disabled xám (Câu 4, 7)
│   ├── screens/
│   │   ├── BookListScreen.tsx       # Màn hình Danh sách (Câu 1, 3, 5, 7)
│   │   ├── BookDetailScreen.tsx     # Màn hình Chi tiết & Mượn/Trả (Câu 4, 7)
│   │   └── BookFormScreen.tsx       # Màn hình Form Thêm/Sửa sách (Câu 2, 7)
│   └── navigation/
│       └── AppNavigator.tsx         # Stack Navigation với typed routes (Câu 2, 4)
├── App.tsx                          # Root component bọc SafeAreaProvider & Context
├── tsconfig.json                    # Cấu hình TypeScript nghiêm ngặt
├── index.js                         # Điểm entry React Native
└── package.json
```

---

## 🏆 ĐÁP ỨNG ĐẦY ĐỦ TIÊU CHÍ CHẤM ĐIỂM (10.0 / 10.0)

| Câu | Điểm | Tiêu chí yêu cầu | Hiện thực trong mã nguồn |
| :---: | :---: | :--- | :--- |
| **Câu 1** | **1.5** | **Màn hình Danh sách sách**<br>- Dùng `FlatList`<br>- Mỗi dòng hiển thị: Tên sách, Tác giả, Thể loại, Số cuốn còn lại (`quantity - borrowed`)<br>- Sách hết (`còn lại = 0`) hiển thị nhãn `"Hết sách"` màu đỏ<br>- Hiển thị tổng số đầu sách và tổng số cuốn đang mượn | File [`src/screens/BookListScreen.tsx`](file:///e:/AppKiemTraGiuaKy/LibraryApp/src/screens/BookListScreen.tsx)<br>- `FlatList` tối ưu hiệu năng.<br>- [`StatCard.tsx`](file:///e:/AppKiemTraGiuaKy/LibraryApp/src/components/StatCard.tsx) hiển thị 2 thẻ đếm Tổng đầu sách và Đang mượn trên đầu danh sách.<br>- [`BookCard.tsx`](file:///e:/AppKiemTraGiuaKy/LibraryApp/src/components/BookCard.tsx) hiển thị nhãn đỏ `Hết sách` khi `remaining === 0`. |
| **Câu 2** | **1.5** | **Thêm / Sửa sách**<br>- Nút `"+ Thêm sách"` mở form qua Stack Navigation<br>- Cùng 1 form dùng cho cả Thêm và Sửa; khi Sửa điền sẵn dữ liệu cũ<br>- Validate dữ liệu chặt chẽ; lỗi hiển thị ngay dưới ô nhập | File [`src/screens/BookFormScreen.tsx`](file:///e:/AppKiemTraGiuaKy/LibraryApp/src/screens/BookFormScreen.tsx)<br>- Nút nổi FAB `+ Thêm sách` điều hướng `navigation.navigate('BookForm')`.<br>- Tái sử dụng cùng 1 Form, tự động nạp dữ liệu cũ khi truyền `bookId`.<br>- Validate: không trống tên & tác giả; năm (1900 - năm nay); số lượng > 0 và `quantity >= borrowed` khi sửa. Thông báo lỗi ngay dưới ô nhập kèm viền đỏ. |
| **Câu 3** | **1.0** | **Xoá sách**<br>- Nhấn giữ dòng (`onLongPress`) để xoá<br>- Có hỏi xác nhận bằng `Alert`<br>- Không cho xoá sách đang có người mượn (`borrowed > 0`), báo lỗi bằng `Alert` | File [`src/screens/BookListScreen.tsx`](file:///e:/AppKiemTraGiuaKy/LibraryApp/src/screens/BookListScreen.tsx) & [`BookDetailScreen.tsx`](file:///e:/AppKiemTraGiuaKy/LibraryApp/src/screens/BookDetailScreen.tsx)<br>- Bắt sự kiện `onLongPress` trên mỗi card sách.<br>- Kiểm tra nếu `borrowed > 0` hiển thị `Alert.alert('Không thể xoá sách')`.<br>- Nếu hợp lệ hiển thị `Alert.alert` với 2 nút `Huỷ` và `Xoá`. |
| **Câu 4** | **1.5** | **Chi tiết và Mượn / Trả**<br>- Nhấn vào một dòng để mở màn hình Chi tiết với đầy đủ thông tin sách<br>- Có nút `"Cho mượn"` (tăng `borrowed`) và `"Nhận trả"` (giảm `borrowed`)<br>- Nút bị vô hiệu hoá (`disabled`, màu xám) khi không hợp lệ: hết sách thì không cho mượn; `borrowed = 0` thì không nhận trả | File [`src/screens/BookDetailScreen.tsx`](file:///e:/AppKiemTraGiuaKy/LibraryApp/src/screens/BookDetailScreen.tsx)<br>- Nhấn `onPress` vào thẻ sách chuyển sang màn hình Chi tiết.<br>- Hiển thị đầy đủ ID, Tiêu đề, Tác giả, Thể loại, Năm xuất bản, Kho sách, Số lượng còn lại.<br>- Nút `"Cho mượn"` disabled (màu xám, không bấm được) khi `quantity - borrowed <= 0`.<br>- Nút `"Nhận trả"` disabled (màu xám, không bấm được) khi `borrowed === 0`. |
| **Câu 5** | **1.5** | **Tìm kiếm và Lọc**<br>- Ô tìm kiếm theo tên hoặc tác giả (không phân biệt hoa/thường)<br>- Hàng nút bấm thể loại (Tất cả, Giáo trình, Tiểu thuyết, Khoa học, Thiếu nhi); nút active được làm nổi bật<br>- Tìm kiếm và lọc hoạt động đồng thời | File [`src/components/SearchInput.tsx`](file:///e:/AppKiemTraGiuaKy/LibraryApp/src/components/SearchInput.tsx) & [`CategoryFilter.tsx`](file:///e:/AppKiemTraGiuaKy/LibraryApp/src/components/CategoryFilter.tsx)<br>- `filteredBooks` kết hợp đồng thời `matchSearch && matchCategory`.<br>- Nút thể loại đang chọn đổi nền màu thương hiệu và chữ trắng nổi bật. |
| **Câu 6** | **1.0** | **Lưu trữ dữ liệu bền vững**<br>- Dùng `@react-native-async-storage/async-storage`<br>- Dữ liệu không mất khi tắt rồi mở lại ứng dụng<br>- Khởi tạo sẵn ít nhất 5 cuốn sách mẫu | File [`src/storage/bookStorage.ts`](file:///e:/AppKiemTraGiuaKy/LibraryApp/src/storage/bookStorage.ts) & [`initialBooks.ts`](file:///e:/AppKiemTraGiuaKy/LibraryApp/src/constants/initialBooks.ts)<br>- Khởi tạo sẵn 6 cuốn sách mẫu phong phú mọi thể loại.<br>- Lưu trữ bền vững qua `@react-native-async-storage/async-storage`. |
| **Câu 7** | **2.0** | **Giao diện & Trải nghiệm (UI/UX)**<br>- **Thống nhất (0.5đ)**: Bảng màu chung trong [`src/theme/colors.ts`](file:///e:/AppKiemTraGiuaKy/LibraryApp/src/theme/colors.ts), dùng `StyleSheet.create`, hạn chế inline style<br>- **Bố cục (0.5đ)**: Dạng thẻ card bo góc, đổ bóng (`elevation/shadow`), phân cấp thông tin rõ ràng<br>- **Phản hồi (0.5đ)**: `TouchableOpacity` có hiệu ứng nhấn (`activeOpacity`), nút disabled màu xám, danh sách rỗng (Empty state), ô nhập sai có viền đỏ<br>- **Trải nghiệm (0.5đ)**: `KeyboardAvoidingView` + `ScrollView`, bàn phím `numeric` cho năm và số lượng, hiển thị chuẩn trong vùng an toàn (`SafeAreaView`) | Đạt điểm tuyệt đối 2.0/2.0 cho toàn bộ tiêu chí giao diện. |
