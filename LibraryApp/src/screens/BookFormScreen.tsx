import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useBooks } from '../context/BookContext';
import { BOOK_CATEGORIES } from '../constants/categories';
import { colors } from '../theme/colors';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';
import type { RootStackParamList } from '../types/navigation';
import type { BookCategory } from '../types/book';

type Props = NativeStackScreenProps<RootStackParamList, 'BookForm'>;

interface FormErrors {
  title?: string | null;
  author?: string | null;
  year?: string | null;
  quantity?: string | null;
}

export const BookFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const { addBook, updateBook, getBookById } = useBooks();

  const bookId = route.params?.bookId;
  const isEditing = Boolean(bookId);
  const existingBook = isEditing && bookId ? getBookById(bookId) : null;

  const currentYear = new Date().getFullYear();

  // State các trường
  const [title, setTitle] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [category, setCategory] = useState<BookCategory>(BOOK_CATEGORIES[0]);
  const [year, setYear] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');

  // State lỗi kiểm tra dữ liệu (Câu 2)
  const [errors, setErrors] = useState<FormErrors>({});

  // Điền sẵn dữ liệu cũ khi sửa (Câu 2)
  useEffect(() => {
    if (existingBook) {
      setTitle(existingBook.title || '');
      setAuthor(existingBook.author || '');
      setCategory(existingBook.category || BOOK_CATEGORIES[0]);
      setYear(existingBook.year ? existingBook.year.toString() : '');
      setQuantity(existingBook.quantity ? existingBook.quantity.toString() : '');
    }
  }, [existingBook]);

  // Kiểm tra dữ liệu (Câu 2)
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 1. Không để trống tên sách
    if (!title.trim()) {
      newErrors.title = 'Vui lòng nhập tên sách';
    }

    // 2. Không để trống tác giả
    if (!author.trim()) {
      newErrors.author = 'Vui lòng nhập tên tác giả';
    }

    // 3. Năm xuất bản hợp lệ: 1900 đến năm hiện tại
    const yearNum = Number(year.trim());
    if (!year.trim()) {
      newErrors.year = 'Vui lòng nhập năm xuất bản';
    } else if (isNaN(yearNum) || !Number.isInteger(yearNum)) {
      newErrors.year = 'Năm xuất bản phải là số nguyên';
    } else if (yearNum < 1900 || yearNum > currentYear) {
      newErrors.year = `Năm xuất bản phải từ 1900 đến ${currentYear}`;
    }

    // 4. Số lượng sách hợp lệ (> 0)
    const qtyNum = Number(quantity.trim());
    if (!quantity.trim()) {
      newErrors.quantity = 'Vui lòng nhập số lượng sách';
    } else if (isNaN(qtyNum) || !Number.isInteger(qtyNum)) {
      newErrors.quantity = 'Số lượng phải là số nguyên';
    } else if (qtyNum <= 0) {
      newErrors.quantity = 'Số lượng phải lớn hơn 0';
    } else if (isEditing && existingBook) {
      // Khi sửa, số lượng không được nhỏ hơn số cuốn đang mượn
      if (qtyNum < existingBook.borrowed) {
        newErrors.quantity = `Số lượng không được nhỏ hơn số cuốn đang mượn (${existingBook.borrowed} cuốn)`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const bookData = {
        title: title.trim(),
        author: author.trim(),
        category,
        year: parseInt(year.trim(), 10),
        quantity: parseInt(quantity.trim(), 10),
      };

      if (isEditing && existingBook) {
        await updateBook({
          id: existingBook.id,
          ...bookData,
          borrowed: existingBook.borrowed,
        });
        Alert.alert('Thành công', 'Đã cập nhật thông tin sách.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        await addBook(bookData);
        Alert.alert('Thành công', 'Đã thêm sách mới vào thư viện.', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch (err) {
      console.error('Lỗi khi lưu sách:', err);
      Alert.alert('Lỗi', 'Không thể lưu sách. Vui lòng thử lại sau.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header form */}
          <View style={styles.headerBox}>
            <Text style={styles.formTitle}>
              {isEditing ? 'Chỉnh Sửa Sách' : 'Thêm Sách Mới'}
            </Text>
          </View>

          {/* Ô nhập Tên sách */}
          <CustomInput
            label="Tên sách"
            required
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
            }}
            placeholder="Nhập tên sách..."
            error={errors.title}
          />

          {/* Ô nhập Tác giả */}
          <CustomInput
            label="Tác giả"
            required
            value={author}
            onChangeText={(text) => {
              setAuthor(text);
              if (errors.author) setErrors((prev) => ({ ...prev, author: null }));
            }}
            placeholder="Nhập tên tác giả..."
            error={errors.author}
          />

          {/* Thể loại */}
          <View style={styles.categoryContainer}>
            <View style={styles.categoryLabelRow}>
              <Text style={styles.categoryLabel}>Thể loại</Text>
              <Text style={styles.requiredStar}>*</Text>
            </View>
            <View style={styles.categoryChipsGrid}>
              {BOOK_CATEGORIES.map((cat) => {
                const isSelected = category === cat;
                return (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      isSelected
                        ? styles.categoryChipSelected
                        : styles.categoryChipUnselected,
                    ]}
                    onPress={() => setCategory(cat)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        isSelected
                          ? styles.categoryChipTextSelected
                          : styles.categoryChipTextUnselected,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Ô nhập Năm xuất bản */}
          <CustomInput
            label="Năm xuất bản"
            required
            value={year}
            onChangeText={(text) => {
              const clean = text.replace(/[^0-9]/g, '');
              setYear(clean);
              if (errors.year) setErrors((prev) => ({ ...prev, year: null }));
            }}
            placeholder={`1900 - ${currentYear}`}
            keyboardType="numeric"
            maxLength={4}
            error={errors.year}
            helperText={`Hợp lệ từ năm 1900 đến ${currentYear}`}
          />

          {/* Ô nhập Số lượng */}
          <CustomInput
            label="Số lượng sách"
            required
            value={quantity}
            onChangeText={(text) => {
              const clean = text.replace(/[^0-9]/g, '');
              setQuantity(clean);
              if (errors.quantity) setErrors((prev) => ({ ...prev, quantity: null }));
            }}
            placeholder="Nhập số lượng..."
            keyboardType="numeric"
            error={errors.quantity}
            helperText={
              isEditing && existingBook
                ? `Hiện đang mượn: ${existingBook.borrowed} cuốn (số lượng mới phải ≥ ${existingBook.borrowed})`
                : 'Số lượng phải lớn hơn 0'
            }
          />

          {/* Nút hành động */}
          <View style={styles.actionsContainer}>
            <CustomButton
              title={isEditing ? 'Lưu thay đổi' : 'Xác nhận thêm sách'}
              onPress={handleSave}
              variant="primary"
              style={styles.saveBtn}
            />

            <CustomButton
              title="Huỷ"
              onPress={() => navigation.goBack()}
              variant="outline"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  headerBox: {
    marginBottom: 18,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.text,
  },
  requiredStar: {
    fontSize: 13,
    color: colors.error,
    marginLeft: 3,
  },
  categoryChipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  categoryChipUnselected: {
    backgroundColor: colors.card,
    borderColor: colors.border,
  },
  categoryChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  categoryChipTextUnselected: {
    color: colors.textSecondary,
  },
  categoryChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  actionsContainer: {
    marginTop: 8,
  },
  saveBtn: {
    marginBottom: 10,
    paddingVertical: 13,
  },
});
